from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.profile_service import ProfileService

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    user_id = int(get_jwt_identity())

    profile = ProfileService.get_my_profile(user_id)

    if not profile:
        return {"message": "Profile not found."}, 404

    return {"profile": profile.to_dict()}, 200


@profile_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    date_of_birth = data.get("date_of_birth") if "date_of_birth" in data else None
    profile_image_url = data.get("profile_image_url") if "profile_image_url" in data else None
    height_cm = data.get("height_cm") if "height_cm" in data else None
    weight_kg = data.get("weight_kg") if "weight_kg" in data else None

    if isinstance(profile_image_url, str):
        profile_image_url = profile_image_url.strip() or None

    profile, error = ProfileService.update_profile(
        user_id=user_id,
        date_of_birth=date_of_birth,
        profile_image_url=profile_image_url,
        height_cm=height_cm,
        weight_kg=weight_kg
    )

    if error:
        return {"message": error}, 400

    return {
        "message": "Profile updated successfully.",
        "profile": profile.to_dict()
    }, 200