from datetime import date

from app.extensions import db
from app.models.daily_nutrition_log import DailyNutritionLog
from app.models.meal import Meal
from app.models.meal_food_entry import MealFoodEntry


class NutritionLogRepository:
    @staticmethod
    def get_daily_log_by_user_and_date(user_id: int, log_date: date):
        return DailyNutritionLog.query.filter_by(
            user_id=user_id,
            log_date=log_date
        ).first()

    @staticmethod
    def create_daily_log(user_id: int, log_date: date):
        daily_log = DailyNutritionLog(
            user_id=user_id,
            log_date=log_date
        )

        db.session.add(daily_log)
        db.session.commit()

        return daily_log

    @staticmethod
    def get_meal_by_id(meal_id: int):
        return db.session.get(Meal, meal_id)

    @staticmethod
    def create_meal(
        daily_nutrition_log_id: int,
        name: str,
        meal_order: int = 1
    ):
        meal = Meal(
            daily_nutrition_log_id=daily_nutrition_log_id,
            name=name,
            meal_order=meal_order
        )

        db.session.add(meal)
        db.session.commit()

        return meal

    @staticmethod
    def update_meal(
        meal: Meal,
        name: str = None,
        meal_order: int = None
    ):
        if name is not None:
            meal.name = name

        if meal_order is not None:
            meal.meal_order = meal_order

        db.session.commit()

        return meal

    @staticmethod
    def delete_meal(meal: Meal):
        db.session.delete(meal)
        db.session.commit()

    @staticmethod
    def get_entry_by_id(entry_id: int):
        return db.session.get(MealFoodEntry, entry_id)

    @staticmethod
    def create_entry(
        meal_id: int,
        food_id: int,
        food_name: str,
        food_brand: str,
        grams: float,
        consumed_calories: float,
        consumed_protein: float,
        consumed_carbs: float,
        consumed_fat: float
    ):
        entry = MealFoodEntry(
            meal_id=meal_id,
            food_id=food_id,
            food_name=food_name,
            food_brand=food_brand,
            grams=grams,
            consumed_calories=consumed_calories,
            consumed_protein=consumed_protein,
            consumed_carbs=consumed_carbs,
            consumed_fat=consumed_fat
        )

        db.session.add(entry)
        db.session.commit()

        return entry

    @staticmethod
    def update_entry(
        entry: MealFoodEntry,
        food_id: int = None,
        food_name: str = None,
        food_brand: str = None,
        grams: float = None,
        consumed_calories: float = None,
        consumed_protein: float = None,
        consumed_carbs: float = None,
        consumed_fat: float = None
    ):
        if food_id is not None:
            entry.food_id = food_id

        if food_name is not None:
            entry.food_name = food_name

        if food_brand is not None or food_brand is None:
            entry.food_brand = food_brand

        if grams is not None:
            entry.grams = grams

        if consumed_calories is not None:
            entry.consumed_calories = consumed_calories

        if consumed_protein is not None:
            entry.consumed_protein = consumed_protein

        if consumed_carbs is not None:
            entry.consumed_carbs = consumed_carbs

        if consumed_fat is not None:
            entry.consumed_fat = consumed_fat

        db.session.commit()

        return entry

    @staticmethod
    def delete_entry(entry: MealFoodEntry):
        db.session.delete(entry)
        db.session.commit()
