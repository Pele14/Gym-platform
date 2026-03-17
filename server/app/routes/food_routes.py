from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.food_service import FoodService
from app.utils.food_validators import validate_food_name, validate_macros

food_bp = Blueprint("food", __name__, url_prefix="/api/foods")


@food_bp.route("", methods=["GET"])
@jwt_required()
def get_foods():
    user_id = int(get_jwt_identity())
    foods = FoodService.get_all_foods(user_id)

    return {"foods": [f.to_dict() for f in foods]}, 200


@food_bp.route("/system", methods=["POST"])
@jwt_required()
def create_system_food():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    name = data.get("name")
    brand = data.get("brand")

    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    valid, err = validate_food_name(name)
    if not valid:
        return {"message": err}, 400

    for val, field in [
        (calories, "Calories"),
        (protein, "Protein"),
        (carbs, "Carbs"),
        (fat, "Fat"),
    ]:
        valid, err = validate_macros(val, field)
        if not valid:
            return {"message": err}, 400

    food, err = FoodService.create_system_food(
        user_id,
        name=name,
        brand=brand,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat
    )

    if err:
        return {"message": err}, 400

    return {"food": food.to_dict()}, 201


@food_bp.route("/custom", methods=["POST"])
@jwt_required()
def create_custom_food():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    food, err = FoodService.create_custom_food(user_id, **data)

    if err:
        return {"message": err}, 400

    return {"food": food.to_dict()}, 201