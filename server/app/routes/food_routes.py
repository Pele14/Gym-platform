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

    return {"foods": [food.to_dict() for food in foods]}, 200


@food_bp.route("/<int:food_id>", methods=["GET"])
@jwt_required()
def get_food(food_id):
    user_id = int(get_jwt_identity())

    food, error = FoodService.get_food_by_id(user_id, food_id)

    if error:
        status = 404 if error == "Food not found." else 403
        return {"message": error}, status

    return {"food": food.to_dict()}, 200


@food_bp.route("/system", methods=["POST"])
@jwt_required()
def create_system_food():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    brand = data.get("brand")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    valid, err = validate_food_name(name)
    if not valid:
        return {"message": err}, 400

    for value, field in [
        (calories, "Calories"),
        (protein, "Protein"),
        (carbs, "Carbs"),
        (fat, "Fat"),
    ]:
        valid, err = validate_macros(value, field)
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

    return {
        "message": "System food created successfully.",
        "food": food.to_dict()
    }, 201


@food_bp.route("/custom", methods=["POST"])
@jwt_required()
def create_custom_food():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    brand = data.get("brand")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    valid, err = validate_food_name(name)
    if not valid:
        return {"message": err}, 400

    for value, field in [
        (calories, "Calories"),
        (protein, "Protein"),
        (carbs, "Carbs"),
        (fat, "Fat"),
    ]:
        valid, err = validate_macros(value, field)
        if not valid:
            return {"message": err}, 400

    food, err = FoodService.create_custom_food(
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

    return {
        "message": "Custom food created successfully.",
        "food": food.to_dict()
    }, 201


@food_bp.route("/system/<int:food_id>", methods=["PUT"])
@jwt_required()
def update_system_food(food_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    brand = data.get("brand")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    if name is not None:
        valid, err = validate_food_name(name)
        if not valid:
            return {"message": err}, 400

    for value, field in [
        (calories, "Calories"),
        (protein, "Protein"),
        (carbs, "Carbs"),
        (fat, "Fat"),
    ]:
        if value is not None:
            valid, err = validate_macros(value, field)
            if not valid:
                return {"message": err}, 400

    food, err = FoodService.update_system_food(
        current_user_id=user_id,
        food_id=food_id,
        name=name,
        brand=brand,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat
    )

    if err:
        status = 404 if err == "Food not found." else 400
        return {"message": err}, status

    return {
        "message": "System food updated successfully.",
        "food": food.to_dict()
    }, 200


@food_bp.route("/custom/<int:food_id>", methods=["PUT"])
@jwt_required()
def update_custom_food(food_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    brand = data.get("brand")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    if name is not None:
        valid, err = validate_food_name(name)
        if not valid:
            return {"message": err}, 400

    for value, field in [
        (calories, "Calories"),
        (protein, "Protein"),
        (carbs, "Carbs"),
        (fat, "Fat"),
    ]:
        if value is not None:
            valid, err = validate_macros(value, field)
            if not valid:
                return {"message": err}, 400

    food, err = FoodService.update_custom_food(
        current_user_id=user_id,
        food_id=food_id,
        name=name,
        brand=brand,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat
    )

    if err:
        status = 404 if err == "Food not found." else 400
        return {"message": err}, status

    return {
        "message": "Custom food updated successfully.",
        "food": food.to_dict()
    }, 200


@food_bp.route("/system/<int:food_id>", methods=["DELETE"])
@jwt_required()
def delete_system_food(food_id):
    user_id = int(get_jwt_identity())

    success, err = FoodService.delete_system_food(
        current_user_id=user_id,
        food_id=food_id
    )

    if err:
        status = 404 if err == "Food not found." else 400
        return {"message": err}, status

    return {"message": "System food deleted successfully."}, 200


@food_bp.route("/custom/<int:food_id>", methods=["DELETE"])
@jwt_required()
def delete_custom_food(food_id):
    user_id = int(get_jwt_identity())

    success, err = FoodService.delete_custom_food(
        current_user_id=user_id,
        food_id=food_id
    )

    if err:
        status = 404 if err == "Food not found." else 400
        return {"message": err}, status

    return {"message": "Custom food deleted successfully."}, 200