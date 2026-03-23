from app.extensions import db
from app.models.nutrition_goal import NutritionGoal


class NutritionRepository:
    @staticmethod
    def get_goal_by_user_id(user_id: int):
        return NutritionGoal.query.filter_by(user_id=user_id).first()

    @staticmethod
    def create_goal(
        user_id: int,
        bmi: float,
        maintenance_calories: float,
        target_calories: float,
        target_protein: float,
        target_carbs: float,
        target_fat: float
    ):
        goal = NutritionGoal(
            user_id=user_id,
            bmi=bmi,
            maintenance_calories=maintenance_calories,
            target_calories=target_calories,
            target_protein=target_protein,
            target_carbs=target_carbs,
            target_fat=target_fat
        )

        db.session.add(goal)
        db.session.commit()

        return goal

    @staticmethod
    def update_goal(
        goal: NutritionGoal,
        bmi: float,
        maintenance_calories: float,
        target_calories: float,
        target_protein: float,
        target_carbs: float,
        target_fat: float
    ):
        goal.bmi = bmi
        goal.maintenance_calories = maintenance_calories
        goal.target_calories = target_calories
        goal.target_protein = target_protein
        goal.target_carbs = target_carbs
        goal.target_fat = target_fat

        db.session.commit()

        return goal