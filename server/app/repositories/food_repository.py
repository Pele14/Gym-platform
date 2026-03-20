from app.extensions import db
from app.models.food import Food


class FoodRepository:
    @staticmethod
    def get_all_for_user(user_id: int):
        return Food.query.filter(
            (Food.is_system == True) | (Food.created_by_user_id == user_id)
        ).order_by(Food.name.asc()).all()

    @staticmethod
    def get_all():
        return Food.query.order_by(Food.name.asc()).all()

    @staticmethod
    def get_by_id(food_id: int):
        return db.session.get(Food, food_id)

    @staticmethod
    def create_food(
        name: str,
        brand: str,
        calories: float,
        protein: float,
        carbs: float,
        fat: float,
        is_system: bool,
        created_by_user_id: int = None
    ):
        food = Food(
            name=name,
            brand=brand,
            calories_per_100g=calories,
            protein_per_100g=protein,
            carbs_per_100g=carbs,
            fat_per_100g=fat,
            is_system=is_system,
            created_by_user_id=created_by_user_id
        )

        db.session.add(food)
        db.session.commit()

        return food

    @staticmethod
    def update_food(
        food: Food,
        name=None,
        brand=None,
        calories=None,
        protein=None,
        carbs=None,
        fat=None
    ):
        if name is not None:
            food.name = name

        if brand is not None:
            food.brand = brand

        if calories is not None:
            food.calories_per_100g = calories

        if protein is not None:
            food.protein_per_100g = protein

        if carbs is not None:
            food.carbs_per_100g = carbs

        if fat is not None:
            food.fat_per_100g = fat

        db.session.commit()

        return food

    @staticmethod
    def delete_food(food: Food):
        db.session.delete(food)
        db.session.commit()