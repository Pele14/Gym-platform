from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.workout_session_service import WorkoutSessionService
from app.utils.workout_validators import validate_positive_int, validate_weight

workout_session_bp = Blueprint(
    "workout_session",
    __name__,
    url_prefix="/api/workout-sessions"
)


@workout_session_bp.route("/start/<int:plan_id>", methods=["POST"])
@jwt_required()
def start_workout(plan_id):
    current_user_id = int(get_jwt_identity())

    session_data, error = WorkoutSessionService.start_workout_from_plan(
        current_user_id=current_user_id,
        plan_id=plan_id
    )

    if error:
        status = 404 if error == "Workout plan not found." else 403
        return {"message": error}, status

    return {
        "message": "Workout started successfully.",
        "session": session_data
    }, 201


@workout_session_bp.route("/<int:session_id>", methods=["GET"])
@jwt_required()
def get_workout_session(session_id):
    current_user_id = int(get_jwt_identity())

    session_data, error = WorkoutSessionService.get_session_by_id(
        current_user_id=current_user_id,
        session_id=session_id
    )

    if error:
        status = 404 if error == "Workout session not found." else 403
        return {"message": error}, status

    return {"session": session_data}, 200


@workout_session_bp.route("/<int:session_id>", methods=["DELETE"])
@jwt_required()
def discard_workout_session(session_id):
    current_user_id = int(get_jwt_identity())

    success, error = WorkoutSessionService.discard_workout(
        current_user_id=current_user_id,
        session_id=session_id
    )

    if error:
        status = 400
        if error == "Workout session not found.":
            status = 404
        elif error == "You are not allowed to discard this workout session.":
            status = 403
        return {"message": error}, status

    return {"message": "Workout discarded successfully."}, 200


@workout_session_bp.route("/history", methods=["GET"])
@jwt_required()
def get_workout_history():
    current_user_id = int(get_jwt_identity())

    sessions = WorkoutSessionService.get_history(current_user_id)

    return {
        "sessions": [session.to_dict() for session in sessions]
    }, 200


@workout_session_bp.route("/<int:session_id>/sets/<int:set_id>", methods=["PUT"])
@jwt_required()
def update_workout_session_set(session_id, set_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    actual_reps = data.get("actual_reps")
    actual_weight_kg = data.get("actual_weight_kg")
    is_completed = data.get("is_completed")

    if actual_reps is not None:
        valid, error = validate_positive_int(actual_reps, "Actual reps")
        if not valid:
            return {"message": error}, 400

    valid, error = validate_weight(actual_weight_kg, "Actual weight")
    if not valid:
        return {"message": error}, 400

    if is_completed is not None and not isinstance(is_completed, bool):
        return {"message": "is_completed must be a boolean."}, 400

    updated_set, error = WorkoutSessionService.update_session_set(
        current_user_id=current_user_id,
        session_id=session_id,
        session_set_id=set_id,
        actual_reps=int(actual_reps) if actual_reps is not None else None,
        actual_weight_kg=float(actual_weight_kg) if actual_weight_kg is not None else None,
        is_completed=is_completed
    )

    if error:
        status = 404 if error in [
            "Workout session not found.",
            "Workout session set not found.",
            "Workout session exercise not found."
        ] else 403
        return {"message": error}, status

    return {
        "message": "Workout set updated successfully.",
        "set": updated_set.to_dict()
    }, 200


@workout_session_bp.route("/<int:session_id>/finish", methods=["POST"])
@jwt_required()
def finish_workout(session_id):
    current_user_id = int(get_jwt_identity())

    session_data, error = WorkoutSessionService.finish_workout(
        current_user_id=current_user_id,
        session_id=session_id
    )

    if error:
        status = 404 if error == "Workout session not found." else 400
        if error == "You are not allowed to finish this workout session.":
            status = 403
        return {"message": error}, status

    return {
        "message": "Workout finished successfully.",
        "session": session_data
    }, 200


@workout_session_bp.route("/exercise-stats/<int:exercise_id>", methods=["GET"])
@jwt_required()
def get_exercise_stats(exercise_id):
    current_user_id = int(get_jwt_identity())

    stats = WorkoutSessionService.get_exercise_stats(
        current_user_id=current_user_id,
        exercise_id=exercise_id
    )

    return {"stats": stats}, 200