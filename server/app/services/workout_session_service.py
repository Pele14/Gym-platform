from datetime import datetime

from app.repositories.exercise_repository import ExerciseRepository
from app.repositories.workout_repository import WorkoutRepository
from app.repositories.workout_session_repository import WorkoutSessionRepository


class WorkoutSessionService:
    @staticmethod
    def _serialize_session_with_previous(session):
        session_data = session.to_dict(include_exercises=True)

        for exercise_item in session_data.get("exercises", []):
            exercise = exercise_item.get("exercise")
            exercise_id = exercise["id"] if exercise else None

            for set_item in exercise_item.get("sets", []):
                previous_data = None

                if exercise_id is not None:
                    previous_set = WorkoutSessionRepository.get_last_completed_set_for_user_exercise(
                        user_id=session.user_id,
                        exercise_id=exercise_id,
                        set_order=set_item["set_order"]
                    )

                    if previous_set:
                        previous_data = {
                            "reps": previous_set.actual_reps,
                            "weight_kg": previous_set.actual_weight_kg
                        }

                set_item["previous"] = previous_data

        return session_data

    @staticmethod
    def start_workout_from_plan(current_user_id: int, plan_id: int):
        plan = WorkoutRepository.get_plan_by_id(plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to start this workout plan."

        session = WorkoutSessionRepository.create_session(
            user_id=current_user_id,
            workout_plan_id=plan.id,
            name=plan.name,
            notes=plan.description
        )

        for plan_exercise in plan.exercises:
            session_exercise = WorkoutSessionRepository.create_session_exercise(
                workout_session_id=session.id,
                exercise_id=plan_exercise.exercise_id,
                exercise_order=plan_exercise.exercise_order,
                notes=plan_exercise.notes
            )

            for plan_set in plan_exercise.sets:
                WorkoutSessionRepository.create_session_set(
                    workout_exercise_session_id=session_exercise.id,
                    set_order=plan_set.set_order,
                    planned_reps=plan_set.target_reps,
                    planned_weight_kg=plan_set.target_weight_kg,
                    actual_reps=None,
                    actual_weight_kg=None,
                    volume=0.0,
                    is_completed=False
                )

        fresh_session = WorkoutSessionRepository.get_session_by_id(session.id)
        return WorkoutSessionService._serialize_session_with_previous(fresh_session), None

    @staticmethod
    def get_session_by_id(current_user_id: int, session_id: int):
        session = WorkoutSessionRepository.get_session_by_id(session_id)

        if not session:
            return None, "Workout session not found."

        if session.user_id != current_user_id:
            return None, "You are not allowed to view this workout session."

        return WorkoutSessionService._serialize_session_with_previous(session), None

    @staticmethod
    def get_history(current_user_id: int):
        return WorkoutSessionRepository.get_all_sessions_for_user(current_user_id)

    @staticmethod
    def update_session_set(
        current_user_id: int,
        session_id: int,
        session_set_id: int,
        actual_reps: int = None,
        actual_weight_kg: float = None,
        is_completed: bool = None
    ):
        session = WorkoutSessionRepository.get_session_by_id(session_id)

        if not session:
            return None, "Workout session not found."

        if session.user_id != current_user_id:
            return None, "You are not allowed to modify this workout session."

        session_set = WorkoutSessionRepository.get_session_set_by_id(session_set_id)

        if not session_set:
            return None, "Workout session set not found."

        session_exercise = WorkoutSessionRepository.get_session_exercise_by_id(
            session_set.workout_exercise_session_id
        )

        if not session_exercise:
            return None, "Workout session exercise not found."

        if session_exercise.workout_session_id != session_id:
            return None, "Workout session set does not belong to this session."

        final_actual_reps = actual_reps
        final_actual_weight_kg = actual_weight_kg

        if is_completed is True:
            if final_actual_reps is None:
                final_actual_reps = session_set.planned_reps

            if final_actual_weight_kg is None:
                final_actual_weight_kg = session_set.planned_weight_kg

        final_volume = 0.0
        if final_actual_reps is not None and final_actual_weight_kg is not None:
            final_volume = float(final_actual_reps) * float(final_actual_weight_kg)

        updated_set = WorkoutSessionRepository.update_session_set(
            session_set=session_set,
            actual_reps=final_actual_reps,
            actual_weight_kg=final_actual_weight_kg,
            volume=final_volume,
            is_completed=is_completed
        )

        return updated_set, None

    @staticmethod
    def finish_workout(current_user_id: int, session_id: int):
        session = WorkoutSessionRepository.get_session_by_id(session_id)

        if not session:
            return None, "Workout session not found."

        if session.user_id != current_user_id:
            return None, "You are not allowed to finish this workout session."

        if session.finished_at is not None:
            return None, "Workout session is already finished."

        finished_at = datetime.utcnow()
        duration_seconds = int((finished_at - session.started_at).total_seconds())

        total_reps = 0
        total_volume = 0.0

        for session_exercise in session.exercises:
            plan_exercise = None

            if session.workout_plan_id is not None:
                plan = WorkoutRepository.get_plan_by_id(session.workout_plan_id)
                if plan:
                    for candidate in plan.exercises:
                        if candidate.exercise_id == session_exercise.exercise_id and candidate.exercise_order == session_exercise.exercise_order:
                            plan_exercise = candidate
                            break

            for session_set in session_exercise.sets:
                if session_set.is_completed:
                    if session_set.actual_reps is not None:
                        total_reps += session_set.actual_reps

                    if session_set.volume is not None:
                        total_volume += session_set.volume

                if plan_exercise is not None and session_set.is_completed:
                    matching_plan_set = None
                    for plan_set in plan_exercise.sets:
                        if plan_set.set_order == session_set.set_order:
                            matching_plan_set = plan_set
                            break

                    if matching_plan_set is not None:
                        planned_weight = matching_plan_set.target_weight_kg
                        planned_reps = matching_plan_set.target_reps
                        actual_weight = session_set.actual_weight_kg
                        actual_reps = session_set.actual_reps

                        is_better = False

                        if actual_weight is not None and planned_weight is not None:
                            if actual_weight > planned_weight:
                                is_better = True
                            elif actual_weight == planned_weight:
                                if actual_reps is not None and planned_reps is not None and actual_reps > planned_reps:
                                    is_better = True

                        elif actual_weight is not None and planned_weight is None:
                            is_better = True

                        elif actual_weight == planned_weight:
                            if actual_reps is not None and planned_reps is not None and actual_reps > planned_reps:
                                is_better = True
                            elif actual_reps is not None and planned_reps is None:
                                is_better = True

                        if is_better:
                            WorkoutRepository.update_plan_exercise_set(
                                plan_exercise_set=matching_plan_set,
                                target_reps=actual_reps,
                                target_weight_kg=actual_weight
                            )

        updated_session = WorkoutSessionRepository.update_session(
            session=session,
            finished_at=finished_at,
            duration_seconds=duration_seconds,
            total_reps=total_reps,
            total_volume=total_volume
        )

        return updated_session.to_dict(include_exercises=True), None

    @staticmethod
    def discard_workout(current_user_id: int, session_id: int):
        session = WorkoutSessionRepository.get_session_by_id(session_id)

        if not session:
            return False, "Workout session not found."

        if session.user_id != current_user_id:
            return False, "You are not allowed to discard this workout session."

        if session.finished_at is not None:
            return False, "Only unfinished workout sessions can be discarded."

        WorkoutSessionRepository.delete_session(session)
        return True, None

    @staticmethod
    def get_exercise_stats(current_user_id: int, exercise_id: int):
        sessions = WorkoutSessionRepository.get_all_sessions_for_user(current_user_id)

        max_weight = None
        best_set_volume = None
        total_exercise_volume = 0.0

        for session in sessions:
            if session.finished_at is None:
                continue

            for session_exercise in session.exercises:
                if session_exercise.exercise_id != exercise_id:
                    continue

                for session_set in session_exercise.sets:
                    if not session_set.is_completed:
                        continue

                    if session_set.actual_weight_kg is not None:
                        if max_weight is None or session_set.actual_weight_kg > max_weight:
                            max_weight = session_set.actual_weight_kg

                    if session_set.volume is not None:
                        total_exercise_volume += session_set.volume

                        if best_set_volume is None or session_set.volume > best_set_volume:
                            best_set_volume = session_set.volume

        return {
            "exercise_id": exercise_id,
            "max_weight": max_weight,
            "best_set_volume": best_set_volume,
            "total_volume": total_exercise_volume
        }