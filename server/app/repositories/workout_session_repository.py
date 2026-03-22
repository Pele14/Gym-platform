from app.extensions import db
from app.models.workout_session import WorkoutSession
from app.models.workout_exercise_session import WorkoutExerciseSession
from app.models.workout_set_session import WorkoutSetSession


class WorkoutSessionRepository:
    @staticmethod
    def get_all_sessions_for_user(user_id: int):
        return WorkoutSession.query.filter_by(user_id=user_id).order_by(
            WorkoutSession.started_at.desc()
        ).all()

    @staticmethod
    def get_session_by_id(session_id: int):
        return db.session.get(WorkoutSession, session_id)

    @staticmethod
    def create_session(
        user_id: int,
        name: str,
        workout_plan_id: int = None,
        notes: str = None
    ):
        session = WorkoutSession(
            user_id=user_id,
            workout_plan_id=workout_plan_id,
            name=name,
            notes=notes
        )

        db.session.add(session)
        db.session.commit()

        return session

    @staticmethod
    def update_session(
        session: WorkoutSession,
        name: str = None,
        notes: str = None,
        finished_at=None,
        duration_seconds: int = None,
        total_reps: int = None,
        total_volume: float = None
    ):
        if name is not None:
            session.name = name

        if notes is not None:
            session.notes = notes

        if finished_at is not None:
            session.finished_at = finished_at

        if duration_seconds is not None:
            session.duration_seconds = duration_seconds

        if total_reps is not None:
            session.total_reps = total_reps

        if total_volume is not None:
            session.total_volume = total_volume

        db.session.commit()

        return session

    @staticmethod
    def delete_session(session: WorkoutSession):
        db.session.delete(session)
        db.session.commit()

    @staticmethod
    def get_session_exercise_by_id(session_exercise_id: int):
        return db.session.get(WorkoutExerciseSession, session_exercise_id)

    @staticmethod
    def create_session_exercise(
        workout_session_id: int,
        exercise_id: int,
        exercise_order: int,
        notes: str = None
    ):
        session_exercise = WorkoutExerciseSession(
            workout_session_id=workout_session_id,
            exercise_id=exercise_id,
            exercise_order=exercise_order,
            notes=notes
        )

        db.session.add(session_exercise)
        db.session.commit()

        return session_exercise

    @staticmethod
    def update_session_exercise(
        session_exercise: WorkoutExerciseSession,
        notes: str = None,
        exercise_order: int = None
    ):
        if notes is not None:
            session_exercise.notes = notes

        if exercise_order is not None:
            session_exercise.exercise_order = exercise_order

        db.session.commit()

        return session_exercise

    @staticmethod
    def delete_session_exercise(session_exercise: WorkoutExerciseSession):
        db.session.delete(session_exercise)
        db.session.commit()

    @staticmethod
    def get_session_set_by_id(session_set_id: int):
        return db.session.get(WorkoutSetSession, session_set_id)

    @staticmethod
    def create_session_set(
        workout_exercise_session_id: int,
        set_order: int,
        planned_reps: int = None,
        planned_weight_kg: float = None,
        actual_reps: int = None,
        actual_weight_kg: float = None,
        volume: float = 0.0,
        is_completed: bool = False
    ):
        session_set = WorkoutSetSession(
            workout_exercise_session_id=workout_exercise_session_id,
            set_order=set_order,
            planned_reps=planned_reps,
            planned_weight_kg=planned_weight_kg,
            actual_reps=actual_reps,
            actual_weight_kg=actual_weight_kg,
            volume=volume,
            is_completed=is_completed
        )

        db.session.add(session_set)
        db.session.commit()

        return session_set

    @staticmethod
    def update_session_set(
        session_set: WorkoutSetSession,
        set_order: int = None,
        planned_reps: int = None,
        planned_weight_kg: float = None,
        actual_reps: int = None,
        actual_weight_kg: float = None,
        volume: float = None,
        is_completed: bool = None
    ):
        if set_order is not None:
            session_set.set_order = set_order

        if planned_reps is not None:
            session_set.planned_reps = planned_reps

        if planned_weight_kg is not None:
            session_set.planned_weight_kg = planned_weight_kg

        if actual_reps is not None:
            session_set.actual_reps = actual_reps

        if actual_weight_kg is not None:
            session_set.actual_weight_kg = actual_weight_kg

        if volume is not None:
            session_set.volume = volume

        if is_completed is not None:
            session_set.is_completed = is_completed

        db.session.commit()

        return session_set

    @staticmethod
    def delete_session_set(session_set: WorkoutSetSession):
        db.session.delete(session_set)
        db.session.commit()

    @staticmethod
    def get_last_completed_set_for_user_exercise(user_id: int, exercise_id: int, set_order: int):
        return (
            WorkoutSetSession.query
            .join(
                WorkoutExerciseSession,
                WorkoutSetSession.workout_exercise_session_id == WorkoutExerciseSession.id
            )
            .join(
                WorkoutSession,
                WorkoutExerciseSession.workout_session_id == WorkoutSession.id
            )
            .filter(
                WorkoutSession.user_id == user_id,
                WorkoutExerciseSession.exercise_id == exercise_id,
                WorkoutSetSession.set_order == set_order,
                WorkoutSession.finished_at.isnot(None),
                WorkoutSetSession.is_completed == True
            )
            .order_by(WorkoutSession.finished_at.desc())
            .first()
        )