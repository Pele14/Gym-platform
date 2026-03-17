from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.exercise_service import ExerciseService
from app.utils.exercise_validators import (
    validate_exercise_name,
    validate_muscle_group,
    validate_optional_text
)

exercise_bp = Blueprint("exercise", __name__, url_prefix="/api/exercises")


@exercise_bp.route("", methods=["GET"])
@jwt_required()
def get_exercises():
    current_user_id = int(get_jwt_identity())

    exercises = ExerciseService.get_all_exercises(current_user_id)

    return {
        "exercises": [exercise.to_dict() for exercise in exercises]
    }, 200


@exercise_bp.route("/<int:exercise_id>", methods=["GET"])
@jwt_required()
def get_exercise(exercise_id):
    exercise = ExerciseService.get_exercise_by_id(exercise_id)

    if not exercise:
        return {"message": "Exercise not found."}, 404

    return {"exercise": exercise.to_dict()}, 200


@exercise_bp.route("/system", methods=["POST"])
@jwt_required()
def create_system_exercise():
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    muscle_group = data.get("muscle_group", "").strip()
    description = data.get("description", "").strip() or None
    equipment = data.get("equipment", "").strip() or None
    difficulty = data.get("difficulty", "").strip() or None

    valid, error = validate_exercise_name(name)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_muscle_group(muscle_group)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(description, "Description", 1000)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(equipment, "Equipment", 50)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(difficulty, "Difficulty", 20)
    if not valid:
        return {"message": error}, 400

    exercise, error = ExerciseService.create_system_exercise(
        current_user_id=current_user_id,
        name=name,
        muscle_group=muscle_group,
        description=description,
        equipment=equipment,
        difficulty=difficulty
    )

    if error:
        return {"message": error}, 400

    return {
        "message": "System exercise created successfully.",
        "exercise": exercise.to_dict()
    }, 201


@exercise_bp.route("/custom", methods=["POST"])
@jwt_required()
def create_custom_exercise():
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    muscle_group = data.get("muscle_group", "").strip()
    description = data.get("description", "").strip() or None
    equipment = data.get("equipment", "").strip() or None
    difficulty = data.get("difficulty", "").strip() or None

    valid, error = validate_exercise_name(name)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_muscle_group(muscle_group)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(description, "Description", 1000)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(equipment, "Equipment", 50)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(difficulty, "Difficulty", 20)
    if not valid:
        return {"message": error}, 400

    exercise, error = ExerciseService.create_custom_exercise(
        current_user_id=current_user_id,
        name=name,
        muscle_group=muscle_group,
        description=description,
        equipment=equipment,
        difficulty=difficulty
    )

    if error:
        return {"message": error}, 400

    return {
        "message": "Custom exercise created successfully.",
        "exercise": exercise.to_dict()
    }, 201


@exercise_bp.route("/system/<int:exercise_id>", methods=["PUT"])
@jwt_required()
def update_system_exercise(exercise_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    muscle_group = data.get("muscle_group")
    description = data.get("description")
    equipment = data.get("equipment")
    difficulty = data.get("difficulty")

    if isinstance(name, str):
        name = name.strip()
        valid, error = validate_exercise_name(name)
        if not valid:
            return {"message": error}, 400

    if isinstance(muscle_group, str):
        muscle_group = muscle_group.strip()
        valid, error = validate_muscle_group(muscle_group)
        if not valid:
            return {"message": error}, 400

    if isinstance(description, str):
        description = description.strip()

    if isinstance(equipment, str):
        equipment = equipment.strip()

    if isinstance(difficulty, str):
        difficulty = difficulty.strip()

    valid, error = validate_optional_text(description, "Description", 1000)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(equipment, "Equipment", 50)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(difficulty, "Difficulty", 20)
    if not valid:
        return {"message": error}, 400

    exercise, error = ExerciseService.update_system_exercise(
        current_user_id=current_user_id,
        exercise_id=exercise_id,
        name=name,
        muscle_group=muscle_group,
        description=description,
        equipment=equipment,
        difficulty=difficulty
    )

    if error:
        status = 404 if error == "Exercise not found." else 400
        return {"message": error}, status

    return {
        "message": "System exercise updated successfully.",
        "exercise": exercise.to_dict()
    }, 200


@exercise_bp.route("/custom/<int:exercise_id>", methods=["PUT"])
@jwt_required()
def update_custom_exercise(exercise_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    muscle_group = data.get("muscle_group")
    description = data.get("description")
    equipment = data.get("equipment")
    difficulty = data.get("difficulty")

    if isinstance(name, str):
        name = name.strip()
        valid, error = validate_exercise_name(name)
        if not valid:
            return {"message": error}, 400

    if isinstance(muscle_group, str):
        muscle_group = muscle_group.strip()
        valid, error = validate_muscle_group(muscle_group)
        if not valid:
            return {"message": error}, 400

    if isinstance(description, str):
        description = description.strip()

    if isinstance(equipment, str):
        equipment = equipment.strip()

    if isinstance(difficulty, str):
        difficulty = difficulty.strip()

    valid, error = validate_optional_text(description, "Description", 1000)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(equipment, "Equipment", 50)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(difficulty, "Difficulty", 20)
    if not valid:
        return {"message": error}, 400

    exercise, error = ExerciseService.update_custom_exercise(
        current_user_id=current_user_id,
        exercise_id=exercise_id,
        name=name,
        muscle_group=muscle_group,
        description=description,
        equipment=equipment,
        difficulty=difficulty
    )

    if error:
        status = 404 if error == "Exercise not found." else 400
        return {"message": error}, status

    return {
        "message": "Custom exercise updated successfully.",
        "exercise": exercise.to_dict()
    }, 200


@exercise_bp.route("/system/<int:exercise_id>", methods=["DELETE"])
@jwt_required()
def delete_system_exercise(exercise_id):
    current_user_id = int(get_jwt_identity())

    success, error = ExerciseService.delete_system_exercise(
        current_user_id=current_user_id,
        exercise_id=exercise_id
    )

    if error:
        status = 404 if error == "Exercise not found." else 400
        return {"message": error}, status

    return {"message": "System exercise deleted successfully."}, 200


@exercise_bp.route("/custom/<int:exercise_id>", methods=["DELETE"])
@jwt_required()
def delete_custom_exercise(exercise_id):
    current_user_id = int(get_jwt_identity())

    success, error = ExerciseService.delete_custom_exercise(
        current_user_id=current_user_id,
        exercise_id=exercise_id
    )

    if error:
        status = 404 if error == "Exercise not found." else 400
        return {"message": error}, status

    return {"message": "Custom exercise deleted successfully."}, 200