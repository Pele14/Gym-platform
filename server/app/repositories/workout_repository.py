from app.extensions import db
from app.models.workout_plan import WorkoutPlan
from app.models.workout_plan_exercise import WorkoutPlanExercise
from app.models.workout_plan_exercise_set import WorkoutPlanExerciseSet


class WorkoutRepository:
    @staticmethod
    def get_all_plans_for_user(user_id: int):
        return WorkoutPlan.query.filter_by(user_id=user_id).order_by(
            WorkoutPlan.created_at.desc()
        ).all()

    @staticmethod
    def get_plan_by_id(plan_id: int):
        return db.session.get(WorkoutPlan, plan_id)

    @staticmethod
    def create_plan(
        user_id: int,
        name: str,
        description: str = None,
        is_active: bool = True
    ):
        plan = WorkoutPlan(
            user_id=user_id,
            name=name,
            description=description,
            is_active=is_active
        )

        db.session.add(plan)
        db.session.commit()

        return plan

    @staticmethod
    def update_plan(
        plan: WorkoutPlan,
        name: str = None,
        description: str = None,
        is_active: bool = None
    ):
        if name is not None:
            plan.name = name

        if description is not None:
            plan.description = description

        if is_active is not None:
            plan.is_active = is_active

        db.session.commit()

        return plan

    @staticmethod
    def delete_plan(plan: WorkoutPlan):
        db.session.delete(plan)
        db.session.commit()

    @staticmethod
    def get_plan_exercise_by_id(plan_exercise_id: int):
        return db.session.get(WorkoutPlanExercise, plan_exercise_id)

    @staticmethod
    def create_plan_exercise(
        workout_plan_id: int,
        exercise_id: int,
        exercise_order: int,
        notes: str = None
    ):
        plan_exercise = WorkoutPlanExercise(
            workout_plan_id=workout_plan_id,
            exercise_id=exercise_id,
            exercise_order=exercise_order,
            notes=notes
        )

        db.session.add(plan_exercise)
        db.session.commit()

        return plan_exercise

    @staticmethod
    def update_plan_exercise(
        plan_exercise: WorkoutPlanExercise,
        exercise_id: int = None,
        exercise_order: int = None,
        notes: str = None
    ):
        if exercise_id is not None:
            plan_exercise.exercise_id = exercise_id

        if exercise_order is not None:
            plan_exercise.exercise_order = exercise_order

        if notes is not None:
            plan_exercise.notes = notes

        db.session.commit()

        return plan_exercise

    @staticmethod
    def delete_plan_exercise(plan_exercise: WorkoutPlanExercise):
        db.session.delete(plan_exercise)
        db.session.commit()

    @staticmethod
    def get_plan_exercise_set_by_id(plan_exercise_set_id: int):
        return db.session.get(WorkoutPlanExerciseSet, plan_exercise_set_id)

    @staticmethod
    def create_plan_exercise_set(
        workout_plan_exercise_id: int,
        set_order: int,
        target_reps: int = None,
        target_weight_kg: float = None
    ):
        plan_exercise_set = WorkoutPlanExerciseSet(
            workout_plan_exercise_id=workout_plan_exercise_id,
            set_order=set_order,
            target_reps=target_reps,
            target_weight_kg=target_weight_kg
        )

        db.session.add(plan_exercise_set)
        db.session.commit()

        return plan_exercise_set

    @staticmethod
    def update_plan_exercise_set(
        plan_exercise_set: WorkoutPlanExerciseSet,
        set_order: int = None,
        target_reps: int = None,
        target_weight_kg: float = None
    ):
        if set_order is not None:
            plan_exercise_set.set_order = set_order

        if target_reps is not None:
            plan_exercise_set.target_reps = target_reps

        if target_weight_kg is not None:
            plan_exercise_set.target_weight_kg = target_weight_kg

        db.session.commit()

        return plan_exercise_set

    @staticmethod
    def delete_plan_exercise_set(plan_exercise_set: WorkoutPlanExerciseSet):
        db.session.delete(plan_exercise_set)
        db.session.commit()