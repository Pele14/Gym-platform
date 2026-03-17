from app.repositories.auth_repository import AuthRepository
from app.repositories.food_repository import FoodRepository


class FoodService:
    @staticmethod
    def get_all_foods(user_id: int):
        return FoodRepository.get_all_for_user(user_id)

    @staticmethod
    def create_system_food(current_user_id, **data):
        user = AuthRepository.get_by_id(current_user_id)

        if not user or user.role != "admin":
            return None, "Only admin can create system foods."

        food = FoodRepository.create_food(
            is_system=True,
            created_by_user_id=None,
            **data
        )

        return food, None

    @staticmethod
    def create_custom_food(current_user_id, **data):
        food = FoodRepository.create_food(
            is_system=False,
            created_by_user_id=current_user_id,
            **data
        )

        return food, None

    @staticmethod
    def update_food(current_user_id, food_id, **data):
        food = FoodRepository.get_by_id(food_id)

        if not food:
            return None, "Food not found."

        user = AuthRepository.get_by_id(current_user_id)

        if food.is_system and user.role != "admin":
            return None, "Only admin can edit system foods."

        if not food.is_system and food.created_by_user_id != current_user_id:
            return None, "Not allowed."

        updated = FoodRepository.update_food(food, **data)
        return updated, None

    @staticmethod
    def delete_food(current_user_id, food_id):
        food = FoodRepository.get_by_id(food_id)

        if not food:
            return None, "Food not found."

        user = AuthRepository.get_by_id(current_user_id)

        if food.is_system and user.role != "admin":
            return None, "Only admin can delete system foods."

        if not food.is_system and food.created_by_user_id != current_user_id:
            return None, "Not allowed."

        FoodRepository.delete_food(food)

        return True, None