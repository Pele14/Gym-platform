from app.extensions import db
from app.models.exercise import Exercise


class ExerciseRepository:
    @staticmethod
    def get_all_for_user(user_id: int):
        return Exercise.query.filter(
            (Exercise.is_system == True) | (Exercise.created_by_user_id == user_id)
        ).order_by(Exercise.name.asc()).all()

    @staticmethod
    def get_by_id(exercise_id: int):
        return db.session.get(Exercise, exercise_id)

    @staticmethod
    def create_exercise(
        name: str,
        muscle_group: str,
        description: str = None,
        equipment: str = None,
        difficulty: str = None,
        is_system: bool = False,
        created_by_user_id: int = None
    ):
        exercise = Exercise(
            name=name,
            muscle_group=muscle_group,
            description=description,
            equipment=equipment,
            difficulty=difficulty,
            is_system=is_system,
            created_by_user_id=created_by_user_id
        )

        db.session.add(exercise)
        db.session.commit()

        return exercise

    @staticmethod
    def update_exercise(
        exercise: Exercise,
        name: str = None,
        muscle_group: str = None,
        description: str = None,
        equipment: str = None,
        difficulty: str = None
    ):
        if name is not None:
            exercise.name = name

        if muscle_group is not None:
            exercise.muscle_group = muscle_group

        if description is not None:
            exercise.description = description

        if equipment is not None:
            exercise.equipment = equipment

        if difficulty is not None:
            exercise.difficulty = difficulty

        db.session.commit()

        return exercise

    @staticmethod
    def delete_exercise(exercise: Exercise):
        db.session.delete(exercise)
        db.session.commit()