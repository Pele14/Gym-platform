from datetime import datetime

from app.repositories.auth_repository import AuthRepository
from app.repositories.food_repository import FoodRepository
from app.repositories.nutrition_repository import NutritionRepository
from app.repositories.nutrition_log_repository import NutritionLogRepository


class NutritionLogService:
    @staticmethod
    def _parse_log_date(log_date: str):
        try:
            return datetime.strptime(log_date, "%Y-%m-%d").date(), None
        except ValueError:
            return None, "Date must be in YYYY-MM-DD format."

    @staticmethod
    def _can_use_food(current_user, food):
        if not current_user or not food:
            return False

        return (
            current_user.role == "admin"
            or food.is_system
            or food.created_by_user_id == current_user.id
        )

    @staticmethod
    def _calculate_entry_macros(food, grams: float):
        factor = grams / 100

        return {
            "consumed_calories": round(food.calories_per_100g * factor, 2),
            "consumed_protein": round(food.protein_per_100g * factor, 2),
            "consumed_carbs": round(food.carbs_per_100g * factor, 2),
            "consumed_fat": round(food.fat_per_100g * factor, 2),
        }

    @staticmethod
    def _get_meal_for_user(current_user_id: int, meal_id: int):
        meal = NutritionLogRepository.get_meal_by_id(meal_id)

        if not meal:
            return None, None, "Meal not found."

        daily_log = meal.daily_log

        if daily_log.user_id != current_user_id:
            return None, None, "You are not allowed to access this meal."

        return meal, daily_log, None

    @staticmethod
    def _get_entry_for_user(current_user_id: int, meal_id: int, entry_id: int):
        meal, daily_log, error = NutritionLogService._get_meal_for_user(
            current_user_id,
            meal_id
        )

        if error:
            return None, None, None, error

        entry = NutritionLogRepository.get_entry_by_id(entry_id)

        if not entry:
            return None, None, None, "Meal food entry not found."

        if entry.meal_id != meal_id:
            return None, None, None, (
                "Meal food entry does not belong to this meal."
            )

        return meal, daily_log, entry, None

    @staticmethod
    def get_daily_log(current_user_id: int, log_date: str):
        user = AuthRepository.get_by_id(current_user_id)

        if not user:
            return None, None, "User not found."

        parsed_date, error = NutritionLogService._parse_log_date(log_date)
        if error:
            return None, None, error

        daily_log = NutritionLogRepository.get_daily_log_by_user_and_date(
            current_user_id,
            parsed_date
        )

        if not daily_log:
            daily_log = NutritionLogRepository.create_daily_log(
                current_user_id,
                parsed_date
            )

        goal = NutritionRepository.get_goal_by_user_id(current_user_id)

        return daily_log, goal, None

    @staticmethod
    def create_meal(
        current_user_id: int,
        log_date: str,
        name: str,
        meal_order: int = 1
    ):
        daily_log, goal, error = NutritionLogService.get_daily_log(
            current_user_id,
            log_date
        )

        if error:
            return None, None, error

        meal = NutritionLogRepository.create_meal(
            daily_nutrition_log_id=daily_log.id,
            name=name,
            meal_order=meal_order
        )

        return meal, goal, None

    @staticmethod
    def update_meal(
        current_user_id: int,
        meal_id: int,
        name: str = None,
        meal_order: int = None
    ):
        meal, goal_source_log, error = NutritionLogService._get_meal_for_user(
            current_user_id,
            meal_id
        )

        if error:
            return None, None, error

        updated_meal = NutritionLogRepository.update_meal(
            meal=meal,
            name=name,
            meal_order=meal_order
        )

        goal = NutritionRepository.get_goal_by_user_id(current_user_id)

        return updated_meal, goal, None

    @staticmethod
    def delete_meal(current_user_id: int, meal_id: int):
        meal, goal_source_log, error = NutritionLogService._get_meal_for_user(
            current_user_id,
            meal_id
        )

        if error:
            return False, error

        NutritionLogRepository.delete_meal(meal)

        return True, None

    @staticmethod
    def create_entry(
        current_user_id: int,
        meal_id: int,
        food_id: int,
        grams: float
    ):
        meal, daily_log, error = NutritionLogService._get_meal_for_user(
            current_user_id,
            meal_id
        )

        if error:
            return None, None, error

        current_user = AuthRepository.get_by_id(current_user_id)
        food = FoodRepository.get_by_id(food_id)

        if not food:
            return None, None, "Food not found."

        if not NutritionLogService._can_use_food(current_user, food):
            return None, None, "You are not allowed to use this food."

        macros = NutritionLogService._calculate_entry_macros(food, grams)

        entry = NutritionLogRepository.create_entry(
            meal_id=meal.id,
            food_id=food.id,
            food_name=food.name,
            food_brand=food.brand,
            grams=grams,
            **macros
        )

        goal = NutritionRepository.get_goal_by_user_id(current_user_id)

        return entry, goal, None

    @staticmethod
    def update_entry(
        current_user_id: int,
        meal_id: int,
        entry_id: int,
        food_id: int = None,
        grams: float = None
    ):
        meal, daily_log, entry, error = NutritionLogService._get_entry_for_user(
            current_user_id,
            meal_id,
            entry_id
        )

        if error:
            return None, None, error

        next_food = entry.food
        if food_id is not None:
            current_user = AuthRepository.get_by_id(current_user_id)
            next_food = FoodRepository.get_by_id(food_id)

            if not next_food:
                return None, None, "Food not found."

            if not NutritionLogService._can_use_food(current_user, next_food):
                return None, None, "You are not allowed to use this food."

        next_grams = grams if grams is not None else entry.grams
        macros = NutritionLogService._calculate_entry_macros(next_food, next_grams)

        updated_entry = NutritionLogRepository.update_entry(
            entry=entry,
            food_id=next_food.id,
            food_name=next_food.name,
            food_brand=next_food.brand,
            grams=next_grams,
            **macros
        )

        goal = NutritionRepository.get_goal_by_user_id(current_user_id)

        return updated_entry, goal, None

    @staticmethod
    def delete_entry(
        current_user_id: int,
        meal_id: int,
        entry_id: int
    ):
        meal, daily_log, entry, error = NutritionLogService._get_entry_for_user(
            current_user_id,
            meal_id,
            entry_id
        )

        if error:
            return False, error

        NutritionLogRepository.delete_entry(entry)

        return True, None
