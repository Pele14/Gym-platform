from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.services.gym_service import GymService
from app.utils.gym_validators import validate_nearby_coordinates

gym_bp = Blueprint("gyms", __name__, url_prefix="/api/gyms")


@gym_bp.route("/nearby", methods=["GET"])
@jwt_required()
def get_nearby_gyms():
    current_user_id = int(get_jwt_identity())

    lat = request.args.get("lat")
    lng = request.args.get("lng")

    valid, error = validate_nearby_coordinates(lat, lng)
    if not valid:
        return {"message": error}, 400

    gyms, error = GymService.get_nearby_gyms(
        current_user_id=current_user_id,
        lat=float(lat),
        lng=float(lng)
    )

    if error:
        if error == "User not found.":
            status = 404
        elif error.startswith("Gym provider"):
            status = 502
        else:
            status = 400

        return {"message": error}, status

    return {"gyms": gyms}, 200