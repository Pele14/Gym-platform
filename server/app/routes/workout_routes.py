from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.workout_service import WorkoutService
from app.utils.workout_validators import (
    validate_plan_name,
    validate_optional_text,
    validate_positive_int,
    validate_weight
)

workout_bp = Blueprint("workout", __name__, url_prefix="/api/workouts")


# ======================
# WORKOUT PLANS
# ======================

@workout_bp.route("", methods=["GET"])
@jwt_required()
def get_plans():
    user_id = int(get_jwt_identity())
    plans = WorkoutService.get_all_plans(user_id)

    return {"plans": [p.to_dict() for p in plans]}, 200


@workout_bp.route("/<int:plan_id>", methods=["GET"])
@jwt_required()
def get_plan(plan_id):
    user_id = int(get_jwt_identity())

    plan, error = WorkoutService.get_plan_by_id(user_id, plan_id)

    if error:
        return {"message": error}, 404

    return {"plan": plan.to_dict(include_exercises=True)}, 200


@workout_bp.route("", methods=["POST"])
@jwt_required()
def create_plan():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description")

    valid, error = validate_plan_name(name)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(description, "Description", 500)
    if not valid:
        return {"message": error}, 400

    plan, error = WorkoutService.create_plan(
        current_user_id=user_id,
        name=name.strip(),
        description=description
    )

    return {"plan": plan.to_dict()}, 201


@workout_bp.route("/<int:plan_id>", methods=["PUT"])
@jwt_required()
def update_plan(plan_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description")
    is_active = data.get("is_active")

    if isinstance(name, str):
        valid, error = validate_plan_name(name)
        if not valid:
            return {"message": error}, 400

    valid, error = validate_optional_text(description, "Description", 500)
    if not valid:
        return {"message": error}, 400

    plan, error = WorkoutService.update_plan(
        current_user_id=user_id,
        plan_id=plan_id,
        name=name,
        description=description,
        is_active=is_active
    )

    if error:
        return {"message": error}, 400

    return {"plan": plan.to_dict()}, 200


@workout_bp.route("/<int:plan_id>", methods=["DELETE"])
@jwt_required()
def delete_plan(plan_id):
    user_id = int(get_jwt_identity())

    success, error = WorkoutService.delete_plan(user_id, plan_id)

    if error:
        return {"message": error}, 400

    return {"message": "Workout plan deleted."}, 200


# ======================
# PLAN EXERCISES
# ======================

@workout_bp.route("/<int:plan_id>/exercises", methods=["POST"])
@jwt_required()
def add_exercise(plan_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    exercise_id = data.get("exercise_id")
    exercise_order = data.get("exercise_order")
    notes = data.get("notes")

    valid, error = validate_positive_int(exercise_id, "Exercise ID", True)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_positive_int(exercise_order, "Exercise order", True)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_optional_text(notes, "Notes", 500)
    if not valid:
        return {"message": error}, 400

    plan_exercise, error = WorkoutService.add_exercise_to_plan(
        user_id,
        plan_id,
        exercise_id,
        exercise_order,
        notes
    )

    if error:
        return {"message": error}, 400

    return {"exercise": plan_exercise.to_dict()}, 201

@workout_bp.route("/<int:plan_id>/exercises/<int:pe_id>", methods=["PUT"])
@jwt_required()
def update_exercise(plan_id, pe_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    exercise_id = data.get("exercise_id")
    exercise_order = data.get("exercise_order")
    notes = data.get("notes")

    if exercise_id is not None:
        valid, error = validate_positive_int(exercise_id, "Exercise ID", True)
        if not valid:
            return {"message": error}, 400

    if exercise_order is not None:
        valid, error = validate_positive_int(exercise_order, "Exercise order", True)
        if not valid:
            return {"message": error}, 400

    valid, error = validate_optional_text(notes, "Notes", 500)
    if not valid:
        return {"message": error}, 400

    plan_exercise, error = WorkoutService.update_plan_exercise(
        current_user_id=user_id,
        workout_plan_id=plan_id,
        plan_exercise_id=pe_id,
        exercise_id=exercise_id,
        exercise_order=exercise_order,
        notes=notes
    )

    if error:
        return {"message": error}, 400

    return {"exercise": plan_exercise.to_dict(include_sets=True)}, 200 


@workout_bp.route("/<int:plan_id>/exercises/<int:pe_id>", methods=["DELETE"])
@jwt_required()
def delete_exercise(plan_id, pe_id):
    user_id = int(get_jwt_identity())

    success, error = WorkoutService.delete_plan_exercise(
        user_id,
        plan_id,
        pe_id
    )

    if error:
        return {"message": error}, 400

    return {"message": "Exercise removed from plan."}, 200


# ======================
# SETS
# ======================

@workout_bp.route("/<int:plan_id>/exercises/<int:pe_id>/sets", methods=["POST"])
@jwt_required()
def add_set(plan_id, pe_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    set_order = data.get("set_order")
    reps = data.get("target_reps")
    weight = data.get("target_weight_kg")

    valid, error = validate_positive_int(set_order, "Set order", True)
    if not valid:
        return {"message": error}, 400

    valid, error = validate_positive_int(reps, "Reps")
    if not valid:
        return {"message": error}, 400

    valid, error = validate_weight(weight)
    if not valid:
        return {"message": error}, 400

    new_set, error = WorkoutService.add_set_to_plan_exercise(
        user_id,
        plan_id,
        pe_id,
        set_order,
        reps,
        weight
    )

    if error:
        return {"message": error}, 400

    return {"set": new_set.to_dict()}, 201

@workout_bp.route("/<int:plan_id>/exercises/<int:pe_id>/sets/<int:set_id>", methods=["PUT"])
@jwt_required()
def update_set(plan_id, pe_id, set_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    set_order = data.get("set_order")
    reps = data.get("target_reps")
    weight = data.get("target_weight_kg")

    if set_order is not None:
        valid, error = validate_positive_int(set_order, "Set order", True)
        if not valid:
            return {"message": error}, 400

    if reps is not None:
        valid, error = validate_positive_int(reps, "Reps")
        if not valid:
            return {"message": error}, 400

    valid, error = validate_weight(weight)
    if not valid:
        return {"message": error}, 400

    updated_set, error = WorkoutService.update_plan_exercise_set(
        current_user_id=user_id,
        workout_plan_id=plan_id,
        plan_exercise_id=pe_id,
        plan_exercise_set_id=set_id,
        set_order=set_order,
        target_reps=reps,
        target_weight_kg=weight
    )

    if error:
        return {"message": error}, 400

    return {"set": updated_set.to_dict()}, 200
    
@workout_bp.route("/<int:plan_id>/exercises/<int:pe_id>/sets/<int:set_id>", methods=["DELETE"])
@jwt_required()
def delete_set(plan_id, pe_id, set_id):
    user_id = int(get_jwt_identity())

    success, error = WorkoutService.delete_plan_exercise_set(
        user_id,
        plan_id,
        pe_id,
        set_id
    )

    if error:
        return {"message": error}, 400

    return {"message": "Set deleted."}, 200