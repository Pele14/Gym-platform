from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.nutrition_service import NutritionService

nutrition_bp = Blueprint("nutrition", __name__, url_prefix="/api/nutrition")


@nutrition_bp.route("/goal", methods=["GET"])
@jwt_required()
def get_nutrition_goal():
    user_id = int(get_jwt_identity())

    goal = NutritionService.get_goal(user_id)

    if not goal:
        return {"message": "Nutrition goal not found."}, 404

    return {"goal": goal.to_dict()}, 200


@nutrition_bp.route("/goal/calculate", methods=["POST"])
@jwt_required()
def calculate_nutrition_goal():
    user_id = int(get_jwt_identity())

    goal, error = NutritionService.calculate_and_save_goal(user_id)

    if error:
        status = 404 if error == "Profile not found." else 400
        return {"message": error}, status

    return {
        "message": "Nutrition goal calculated successfully.",
        "goal": goal.to_dict()
    }, 200