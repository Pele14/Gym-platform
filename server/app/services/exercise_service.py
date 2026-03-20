from app.repositories.auth_repository import AuthRepository
from app.repositories.exercise_repository import ExerciseRepository


class ExerciseService:
    @staticmethod
    def get_all_exercises(current_user_id: int):
        user = AuthRepository.get_by_id(current_user_id)

        if not user:
            return []

        if user.role == "admin":
            return ExerciseRepository.get_all()

        return ExerciseRepository.get_all_for_user(current_user_id)

    @staticmethod
    def get_exercise_by_id(current_user_id: int, exercise_id: int):
        exercise = ExerciseRepository.get_by_id(exercise_id)

        if not exercise:
            return None, "Exercise not found."

        user = AuthRepository.get_by_id(current_user_id)

        if not user:
            return None, "User not found."

        if user.role == "admin":
            return exercise, None

        if exercise.is_system or exercise.created_by_user_id == current_user_id:
            return exercise, None

        return None, "You are not allowed to view this exercise."

    @staticmethod
    def create_system_exercise(
        current_user_id: int,
        name: str,
        muscle_group: str,
        description: str = None,
        equipment: str = None,
        difficulty: str = None
    ):
        user = AuthRepository.get_by_id(current_user_id)

        if not user or user.role != "admin":
            return None, "Only admin can create system exercises."

        exercise = ExerciseRepository.create_exercise(
            name=name,
            muscle_group=muscle_group,
            description=description,
            equipment=equipment,
            difficulty=difficulty,
            is_system=True,
            created_by_user_id=None
        )

        return exercise, None

    @staticmethod
    def create_custom_exercise(
        current_user_id: int,
        name: str,
        muscle_group: str,
        description: str = None,
        equipment: str = None,
        difficulty: str = None
    ):
        exercise = ExerciseRepository.create_exercise(
            name=name,
            muscle_group=muscle_group,
            description=description,
            equipment=equipment,
            difficulty=difficulty,
            is_system=False,
            created_by_user_id=current_user_id
        )

        return exercise, None

    @staticmethod
    def update_system_exercise(
        current_user_id: int,
        exercise_id: int,
        name: str = None,
        muscle_group: str = None,
        description: str = None,
        equipment: str = None,
        difficulty: str = None
    ):
        user = AuthRepository.get_by_id(current_user_id)

        if not user or user.role != "admin":
            return None, "Only admin can update system exercises."

        exercise = ExerciseRepository.get_by_id(exercise_id)

        if not exercise:
            return None, "Exercise not found."

        if not exercise.is_system:
            return None, "This is not a system exercise."

        exercise = ExerciseRepository.update_exercise(
            exercise=exercise,
            name=name,
            muscle_group=muscle_group,
            description=description,
            equipment=equipment,
            difficulty=difficulty
        )

        return exercise, None

    @staticmethod
    def update_custom_exercise(
        current_user_id: int,
        exercise_id: int,
        name: str = None,
        muscle_group: str = None,
        description: str = None,
        equipment: str = None,
        difficulty: str = None
    ):
        exercise = ExerciseRepository.get_by_id(exercise_id)

        if not exercise:
            return None, "Exercise not found."

        if exercise.is_system:
            return None, "System exercises cannot be edited here."

        if exercise.created_by_user_id != current_user_id:
            return None, "You are not allowed to edit this exercise."

        exercise = ExerciseRepository.update_exercise(
            exercise=exercise,
            name=name,
            muscle_group=muscle_group,
            description=description,
            equipment=equipment,
            difficulty=difficulty
        )

        return exercise, None

    @staticmethod
    def delete_system_exercise(current_user_id: int, exercise_id: int):
        user = AuthRepository.get_by_id(current_user_id)

        if not user or user.role != "admin":
            return False, "Only admin can delete system exercises."

        exercise = ExerciseRepository.get_by_id(exercise_id)

        if not exercise:
            return False, "Exercise not found."

        if not exercise.is_system:
            return False, "This is not a system exercise."

        ExerciseRepository.delete_exercise(exercise)

        return True, None

    @staticmethod
    def delete_custom_exercise(current_user_id: int, exercise_id: int):
        exercise = ExerciseRepository.get_by_id(exercise_id)

        if not exercise:
            return False, "Exercise not found."

        if exercise.is_system:
            return False, "System exercises cannot be deleted here."

        if exercise.created_by_user_id != current_user_id:
            return False, "You are not allowed to delete this exercise."

        ExerciseRepository.delete_exercise(exercise)

        return True, None