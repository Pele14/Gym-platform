from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.nutrition_log_service import NutritionLogService
from app.utils.nutrition_log_validators import (
    validate_food_id,
    validate_grams,
    validate_log_date,
    validate_meal_name,
    validate_meal_order
)

nutrition_log_bp = Blueprint(
    "nutrition_log",
    __name__,
    url_prefix="/api/nutrition/logs"
)


def _build_remaining(goal, daily_log):
    if not goal:
        return None

    return {
        "calories": round(goal.target_calories - daily_log.get_total_calories(), 2),
        "protein": round(goal.target_protein - daily_log.get_total_protein(), 2),
        "carbs": round(goal.target_carbs - daily_log.get_total_carbs(), 2),
        "fat": round(goal.target_fat - daily_log.get_total_fat(), 2)
    }


@nutrition_log_bp.route("", methods=["GET"])
@jwt_required()
def get_daily_log():
    user_id = int(get_jwt_identity())
    log_date = request.args.get("date")

    valid, error = validate_log_date(log_date)
    if not valid:
        return {"message": error}, 400

    daily_log, goal, error = NutritionLogService.get_daily_log(user_id, log_date)

    if error:
        status = 404 if error == "User not found." else 400
        return {"message": error}, status

    return {
        "log": daily_log.to_dict(include_meals=True),
        "goal": goal.to_dict() if goal else None,
        "remaining": _build_remaining(goal, daily_log)
    }, 200


@nutrition_log_bp.route("/meals", methods=["POST"])
@jwt_required()
def create_meal():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    log_date = data.get("date")
    name = data.get("name")
    meal_order = data.get("meal_order", 1)

    valid, error = validate_log_date(log_date)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_meal_name(name)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_meal_order(meal_order)
    if not valid:
        return {"message": error}, 400

    meal, goal, error = NutritionLogService.create_meal(
        current_user_id=user_id,
        log_date=log_date,
        name=name.strip(),
        meal_order=int(meal_order)
    )

    if error:
        status = 404 if error == "User not found." else 400
        return {"message": error}, status

    return {
        "message": "Meal created successfully.",
        "meal": meal.to_dict()
    }, 201


@nutrition_log_bp.route("/meals/<int:meal_id>", methods=["PUT"])
@jwt_required()
def update_meal(meal_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    meal_order = data.get("meal_order")

    if name is not None:
        valid, error = validate_meal_name(name)
        if not valid:
            return {"message": error}, 400

    if meal_order is not None:
        valid, error = validate_meal_order(meal_order)
        if not valid:
            return {"message": error}, 400
        meal_order = int(meal_order)

    meal, goal, error = NutritionLogService.update_meal(
        current_user_id=user_id,
        meal_id=meal_id,
        name=name.strip() if isinstance(name, str) else name,
        meal_order=meal_order
    )

    if error:
        status = 404 if error == "Meal not found." else 400
        return {"message": error}, status

    return {
        "message": "Meal updated successfully.",
        "meal": meal.to_dict()
    }, 200


@nutrition_log_bp.route("/meals/<int:meal_id>", methods=["DELETE"])
@jwt_required()
def delete_meal(meal_id):
    user_id = int(get_jwt_identity())

    success, error = NutritionLogService.delete_meal(user_id, meal_id)

    if error:
        status = 404 if error == "Meal not found." else 400
        return {"message": error}, status

    return {"message": "Meal deleted successfully."}, 200


@nutrition_log_bp.route("/meals/<int:meal_id>/entries", methods=["POST"])
@jwt_required()
def create_entry(meal_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    food_id = data.get("food_id")
    grams = data.get("grams")

    valid, error = validate_food_id(food_id)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_grams(grams)
    if not valid:
        return {"message": error}, 400

    entry, goal, error = NutritionLogService.create_entry(
        current_user_id=user_id,
        meal_id=meal_id,
        food_id=int(food_id),
        grams=float(grams)
    )

    if error:
        status = 404 if error in ["Meal not found.", "Food not found."] else 400
        return {"message": error}, status

    return {
        "message": "Food entry created successfully.",
        "entry": entry.to_dict()
    }, 201


@nutrition_log_bp.route("/meals/<int:meal_id>/entries/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_entry(meal_id, entry_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    food_id = data.get("food_id")
    grams = data.get("grams")

    if food_id is not None:
        valid, error = validate_food_id(food_id)
        if not valid:
            return {"message": error}, 400
        food_id = int(food_id)

    if grams is not None:
        valid, error = validate_grams(grams)
        if not valid:
            return {"message": error}, 400
        grams = float(grams)

    entry, goal, error = NutritionLogService.update_entry(
        current_user_id=user_id,
        meal_id=meal_id,
        entry_id=entry_id,
        food_id=food_id,
        grams=grams
    )

    if error:
        status = 404 if error in [
            "Meal not found.",
            "Meal food entry not found.",
            "Food not found."
        ] else 400
        return {"message": error}, status

    return {
        "message": "Food entry updated successfully.",
        "entry": entry.to_dict()
    }, 200


@nutrition_log_bp.route("/meals/<int:meal_id>/entries/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(meal_id, entry_id):
    user_id = int(get_jwt_identity())

    success, error = NutritionLogService.delete_entry(
        current_user_id=user_id,
        meal_id=meal_id,
        entry_id=entry_id
    )

    if error:
        status = 404 if error in ["Meal not found.", "Meal food entry not found."] else 400
        return {"message": error}, status

    return {"message": "Food entry deleted successfully."}, 200
