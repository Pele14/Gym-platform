from app.repositories.auth_repository import AuthRepository
from app.repositories.food_repository import FoodRepository


class FoodService:
    @staticmethod
    def get_all_foods(current_user_id: int):
        user = AuthRepository.get_by_id(current_user_id)

        if not user:
            return []

        if user.role == "admin":
            return FoodRepository.get_all()

        return FoodRepository.get_all_for_user(current_user_id)

    @staticmethod
    def get_food_by_id(current_user_id: int, food_id: int):
        food = FoodRepository.get_by_id(food_id)

        if not food:
            return None, "Food not found."

        user = AuthRepository.get_by_id(current_user_id)

        if not user:
            return None, "User not found."

        if user.role == "admin":
            return food, None

        if food.is_system or food.created_by_user_id == current_user_id:
            return food, None

        return None, "You are not allowed to view this food."

    @staticmethod
    def create_system_food(current_user_id: int, **data):
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
    def create_custom_food(current_user_id: int, **data):
        food = FoodRepository.create_food(
            is_system=False,
            created_by_user_id=current_user_id,
            **data
        )

        return food, None

    @staticmethod
    def update_system_food(current_user_id: int, food_id: int, **data):
        user = AuthRepository.get_by_id(current_user_id)

        if not user or user.role != "admin":
            return None, "Only admin can edit system foods."

        food = FoodRepository.get_by_id(food_id)

        if not food:
            return None, "Food not found."

        if not food.is_system:
            return None, "This is not a system food."

        updated = FoodRepository.update_food(food, **data)
        return updated, None

    @staticmethod
    def update_custom_food(current_user_id: int, food_id: int, **data):
        food = FoodRepository.get_by_id(food_id)

        if not food:
            return None, "Food not found."

        if food.is_system:
            return None, "System foods cannot be edited here."

        if food.created_by_user_id != current_user_id:
            return None, "You are not allowed to edit this food."

        updated = FoodRepository.update_food(food, **data)
        return updated, None

    @staticmethod
    def delete_system_food(current_user_id: int, food_id: int):
        user = AuthRepository.get_by_id(current_user_id)

        if not user or user.role != "admin":
            return False, "Only admin can delete system foods."

        food = FoodRepository.get_by_id(food_id)

        if not food:
            return False, "Food not found."

        if not food.is_system:
            return False, "This is not a system food."

        FoodRepository.delete_food(food)

        return True, None

    @staticmethod
    def delete_custom_food(current_user_id: int, food_id: int):
        food = FoodRepository.get_by_id(food_id)

        if not food:
            return False, "Food not found."

        if food.is_system:
            return False, "System foods cannot be deleted here."

        if food.created_by_user_id != current_user_id:
            return False, "You are not allowed to delete this food."

        FoodRepository.delete_food(food)

        return True, None