from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.profile_service import ProfileService

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


# ======================
# GET MY PROFILE
# ======================
@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    user_id = int(get_jwt_identity())

    profile = ProfileService.get_my_profile(user_id)

    if not profile:
        return {"message": "Profile not found."}, 404

    return {"profile": profile.to_dict()}, 200


# ======================
# UPDATE MY PROFILE
# ======================
@profile_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    profile, error = ProfileService.update_profile(
        user_id=user_id,
        date_of_birth=data.get("date_of_birth"),
        profile_image_url=data.get("profile_image_url"),
        height_cm=data.get("height_cm"),
        weight_kg=data.get("weight_kg"),
        sex=data.get("sex"),
        activity_level=data.get("activity_level"),
        goal_type=data.get("goal_type"),
    )

    if error:
        return {"message": error}, 400

    return {
        "message": "Profile updated successfully.",
        "profile": profile.to_dict()
    }, 200