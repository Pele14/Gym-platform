from app.repositories.auth_repository import AuthRepository
from app.repositories.exercise_repository import ExerciseRepository
from app.repositories.workout_repository import WorkoutRepository


class WorkoutService:
    @staticmethod
    def get_all_plans(current_user_id: int):
        return WorkoutRepository.get_all_plans_for_user(current_user_id)

    @staticmethod
    def get_plan_by_id(current_user_id: int, plan_id: int):
        plan = WorkoutRepository.get_plan_by_id(plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to view this workout plan."

        return plan, None

    @staticmethod
    def create_plan(
        current_user_id: int,
        name: str,
        description: str = None,
        is_active: bool = True
    ):
        plan = WorkoutRepository.create_plan(
            user_id=current_user_id,
            name=name,
            description=description,
            is_active=is_active
        )

        return plan, None

    @staticmethod
    def update_plan(
        current_user_id: int,
        plan_id: int,
        name: str = None,
        description: str = None,
        is_active: bool = None
    ):
        plan = WorkoutRepository.get_plan_by_id(plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to update this workout plan."

        updated_plan = WorkoutRepository.update_plan(
            plan=plan,
            name=name,
            description=description,
            is_active=is_active
        )

        return updated_plan, None

    @staticmethod
    def delete_plan(current_user_id: int, plan_id: int):
        plan = WorkoutRepository.get_plan_by_id(plan_id)

        if not plan:
            return False, "Workout plan not found."

        if plan.user_id != current_user_id:
            return False, "You are not allowed to delete this workout plan."

        WorkoutRepository.delete_plan(plan)

        return True, None

    @staticmethod
    def add_exercise_to_plan(
        current_user_id: int,
        workout_plan_id: int,
        exercise_id: int,
        exercise_order: int,
        notes: str = None
    ):
        plan = WorkoutRepository.get_plan_by_id(workout_plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to modify this workout plan."

        exercise = ExerciseRepository.get_by_id(exercise_id)

        if not exercise:
            return None, "Exercise not found."

        current_user = AuthRepository.get_by_id(current_user_id)

        if not current_user:
            return None, "User not found."

        can_use_exercise = (
            current_user.role == "admin"
            or exercise.is_system
            or exercise.created_by_user_id == current_user_id
        )

        if not can_use_exercise:
            return None, "You are not allowed to use this exercise."

        plan_exercise = WorkoutRepository.create_plan_exercise(
            workout_plan_id=workout_plan_id,
            exercise_id=exercise_id,
            exercise_order=exercise_order,
            notes=notes
        )

        return plan_exercise, None

    @staticmethod
    def update_plan_exercise(
        current_user_id: int,
        workout_plan_id: int,
        plan_exercise_id: int,
        exercise_id: int = None,
        exercise_order: int = None,
        notes: str = None
    ):
        plan = WorkoutRepository.get_plan_by_id(workout_plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to modify this workout plan."

        plan_exercise = WorkoutRepository.get_plan_exercise_by_id(plan_exercise_id)

        if not plan_exercise:
            return None, "Workout plan exercise not found."

        if plan_exercise.workout_plan_id != workout_plan_id:
            return None, "Workout plan exercise does not belong to this plan."

        if exercise_id is not None:
            exercise = ExerciseRepository.get_by_id(exercise_id)

            if not exercise:
                return None, "Exercise not found."

            current_user = AuthRepository.get_by_id(current_user_id)

            can_use_exercise = (
                current_user
                and (
                    current_user.role == "admin"
                    or exercise.is_system
                    or exercise.created_by_user_id == current_user_id
                )
            )

            if not can_use_exercise:
                return None, "You are not allowed to use this exercise."

        updated_plan_exercise = WorkoutRepository.update_plan_exercise(
            plan_exercise=plan_exercise,
            exercise_id=exercise_id,
            exercise_order=exercise_order,
            notes=notes
        )

        return updated_plan_exercise, None

    @staticmethod
    def delete_plan_exercise(
        current_user_id: int,
        workout_plan_id: int,
        plan_exercise_id: int
    ):
        plan = WorkoutRepository.get_plan_by_id(workout_plan_id)

        if not plan:
            return False, "Workout plan not found."

        if plan.user_id != current_user_id:
            return False, "You are not allowed to modify this workout plan."

        plan_exercise = WorkoutRepository.get_plan_exercise_by_id(plan_exercise_id)

        if not plan_exercise:
            return False, "Workout plan exercise not found."

        if plan_exercise.workout_plan_id != workout_plan_id:
            return False, "Workout plan exercise does not belong to this plan."

        WorkoutRepository.delete_plan_exercise(plan_exercise)

        return True, None

    @staticmethod
    def add_set_to_plan_exercise(
        current_user_id: int,
        workout_plan_id: int,
        plan_exercise_id: int,
        set_order: int,
        target_reps: int = None,
        target_weight_kg: float = None
    ):
        plan = WorkoutRepository.get_plan_by_id(workout_plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to modify this workout plan."

        plan_exercise = WorkoutRepository.get_plan_exercise_by_id(plan_exercise_id)

        if not plan_exercise:
            return None, "Workout plan exercise not found."

        if plan_exercise.workout_plan_id != workout_plan_id:
            return None, "Workout plan exercise does not belong to this plan."

        plan_exercise_set = WorkoutRepository.create_plan_exercise_set(
            workout_plan_exercise_id=plan_exercise_id,
            set_order=set_order,
            target_reps=target_reps,
            target_weight_kg=target_weight_kg
        )

        return plan_exercise_set, None

    @staticmethod
    def update_plan_exercise_set(
        current_user_id: int,
        workout_plan_id: int,
        plan_exercise_id: int,
        plan_exercise_set_id: int,
        set_order: int = None,
        target_reps: int = None,
        target_weight_kg: float = None
    ):
        plan = WorkoutRepository.get_plan_by_id(workout_plan_id)

        if not plan:
            return None, "Workout plan not found."

        if plan.user_id != current_user_id:
            return None, "You are not allowed to modify this workout plan."

        plan_exercise = WorkoutRepository.get_plan_exercise_by_id(plan_exercise_id)

        if not plan_exercise:
            return None, "Workout plan exercise not found."

        if plan_exercise.workout_plan_id != workout_plan_id:
            return None, "Workout plan exercise does not belong to this plan."

        plan_exercise_set = WorkoutRepository.get_plan_exercise_set_by_id(plan_exercise_set_id)

        if not plan_exercise_set:
            return None, "Workout plan exercise set not found."

        if plan_exercise_set.workout_plan_exercise_id != plan_exercise_id:
            return None, "Workout plan exercise set does not belong to this exercise."

        updated_plan_exercise_set = WorkoutRepository.update_plan_exercise_set(
            plan_exercise_set=plan_exercise_set,
            set_order=set_order,
            target_reps=target_reps,
            target_weight_kg=target_weight_kg
        )

        return updated_plan_exercise_set, None

    @staticmethod
    def delete_plan_exercise_set(
        current_user_id: int,
        workout_plan_id: int,
        plan_exercise_id: int,
        plan_exercise_set_id: int
    ):
        plan = WorkoutRepository.get_plan_by_id(workout_plan_id)

        if not plan:
            return False, "Workout plan not found."

        if plan.user_id != current_user_id:
            return False, "You are not allowed to modify this workout plan."

        plan_exercise = WorkoutRepository.get_plan_exercise_by_id(plan_exercise_id)

        if not plan_exercise:
            return False, "Workout plan exercise not found."

        if plan_exercise.workout_plan_id != workout_plan_id:
            return False, "Workout plan exercise does not belong to this plan."

        plan_exercise_set = WorkoutRepository.get_plan_exercise_set_by_id(plan_exercise_set_id)

        if not plan_exercise_set:
            return False, "Workout plan exercise set not found."

        if plan_exercise_set.workout_plan_exercise_id != plan_exercise_id:
            return False, "Workout plan exercise set does not belong to this exercise."

        WorkoutRepository.delete_plan_exercise_set(plan_exercise_set)

        return True, None