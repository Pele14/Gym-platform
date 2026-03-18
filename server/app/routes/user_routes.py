from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.user_service import UserService

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