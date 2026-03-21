from datetime import datetime

from app.extensions import db


class WorkoutPlan(db.Model):
    __tablename__ = "workout_plans"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    exercises = db.relationship(
        "WorkoutPlanExercise",
        backref="workout_plan",
        cascade="all, delete-orphan",
        order_by="WorkoutPlanExercise.exercise_order.asc()"
    )

    def to_dict(self, include_exercises: bool = False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

        if include_exercises:
            data["exercises"] = [exercise.to_dict(include_sets=True) for exercise in self.exercises]

        return data