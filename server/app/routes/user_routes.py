from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.user_service import UserService
from app.services.profile_service import ProfileService
from app.utils.authvalidators import (
    validate_email,
    validate_username,
    validate_first_name,
    validate_last_name
)

user_bp = Blueprint("users", __name__, url_prefix="/api/users")


@user_bp.route("", methods=["GET"])
@jwt_required()
def get_users():
    current_user_id = int(get_jwt_identity())
    current_user = UserService.get_user_by_id(current_user_id)

    if not current_user:
        return {"message": "User not found."}, 404

    if current_user.role != "admin":
        return {"message": "Access denied."}, 403

    users = UserService.get_all_users()

    return {
        "users": [user.to_admin_dict() for user in users]
    }, 200


@user_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())

    user = UserService.get_user_by_id(user_id)

    if not user:
        return {"message": "User not found"}, 404

    return {"user": user.to_client_dict()}, 200


@user_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    username = data.get("username")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")

    date_of_birth = data.get("date_of_birth")
    profile_image_url = data.get("profile_image_url")
    height_cm = data.get("height_cm")
    weight_kg = data.get("weight_kg")
    sex = data.get("sex")
    activity_level = data.get("activity_level")
    goal_type = data.get("goal_type")

    if username is not None:
        username = username.strip()
        valid, error = validate_username(username)
        if not valid:
            return {"message": error}, 400

    if first_name is not None:
        first_name = first_name.strip()
        valid, error = validate_first_name(first_name)
        if not valid:
            return {"message": error}, 400

    if last_name is not None:
        last_name = last_name.strip()
        valid, error = validate_last_name(last_name)
        if not valid:
            return {"message": error}, 400

    if email is not None:
        email = email.strip().lower()
        valid, error = validate_email(email)
        if not valid:
            return {"message": error}, 400

    user, user_error = UserService.update_my_user(
        user_id=current_user_id,
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email
    )

    if user_error:
        return {"message": user_error}, 400

    profile, profile_error = ProfileService.update_profile(
        user_id=current_user_id,
        date_of_birth=date_of_birth,
        profile_image_url=profile_image_url,
        height_cm=height_cm,
        weight_kg=weight_kg,
        sex=sex,
        activity_level=activity_level,
        goal_type=goal_type
    )

    if profile_error:
        return {"message": profile_error}, 400

    refreshed_user = UserService.get_user_by_id(current_user_id)

    return {
        "message": "User and profile updated successfully.",
        "user": refreshed_user.to_client_dict()
    }, 200