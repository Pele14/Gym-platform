from datetime import datetime

from app.extensions import db


class WorkoutPlanExerciseSet(db.Model):
    __tablename__ = "workout_plan_exercise_sets"

    id = db.Column(db.Integer, primary_key=True)

    workout_plan_exercise_id = db.Column(
        db.Integer,
        db.ForeignKey("workout_plan_exercises.id"),
        nullable=False
    )

    set_order = db.Column(db.Integer, nullable=False, default=1)
    target_reps = db.Column(db.Integer, nullable=True)
    target_weight_kg = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "workout_plan_exercise_id": self.workout_plan_exercise_id,
            "set_order": self.set_order,
            "target_reps": self.target_reps,
            "target_weight_kg": self.target_weight_kg,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }