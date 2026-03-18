from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app.services.auth_services import AuthService
from app.utils.authvalidators import (
    validate_email,
    validate_password,
    validate_username,
    validate_login_password,
    validate_first_name,
    validate_last_name
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    username = data.get("username", "").strip()
    first_name = data.get("first_name", "").strip()
    last_name = data.get("last_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
   

    valid, error = validate_username(username)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_email(email)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_password(password)
    if not valid:
        return {"message": error}, 400
    
    valid, error = validate_first_name(first_name)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_last_name(last_name)
    if not valid:
        return {"message": error}, 400
    
    user, error = AuthService.register_user(username, first_name, last_name, email, password)

    if error:
        return {"message": error}, 400

    access_token = create_access_token(identity=str(user.id))

    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "user": user.to_dict()
    }, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    valid, error = validate_email(email)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_login_password(password)
    if not valid:
        return {"message": error}, 400

    user = AuthService.login_user(email, password)

    if not user:
        return {"message": "Invalid credentials"}, 401

    access_token = create_access_token(identity=str(user.id))

    return {
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }, 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = AuthService.get_user_by_id(int(user_id))

    if not user:
        return {"message": "User not found"}, 404

    return {"user": user.to_dict()}, 200