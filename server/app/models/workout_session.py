from datetime import datetime

from app.extensions import db


class WorkoutSession(db.Model):
    __tablename__ = "workout_sessions"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    workout_plan_id = db.Column(
        db.Integer,
        db.ForeignKey("workout_plans.id"),
        nullable=True
    )

    name = db.Column(db.String(120), nullable=False)
    notes = db.Column(db.Text, nullable=True)

    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime, nullable=True)

    duration_seconds = db.Column(db.Integer, nullable=True)
    total_reps = db.Column(db.Integer, nullable=False, default=0)
    total_volume = db.Column(db.Float, nullable=False, default=0.0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    exercises = db.relationship(
        "WorkoutExerciseSession",
        backref="workout_session",
        cascade="all, delete-orphan",
        order_by="WorkoutExerciseSession.exercise_order.asc()"
    )

    def to_dict(self, include_exercises: bool = False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "workout_plan_id": self.workout_plan_id,
            "name": self.name,
            "notes": self.notes,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "finished_at": self.finished_at.isoformat() if self.finished_at else None,
            "duration_seconds": self.duration_seconds,
            "total_reps": self.total_reps,
            "total_volume": self.total_volume,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

        if include_exercises:
            data["exercises"] = [exercise.to_dict(include_sets=True) for exercise in self.exercises]

        return data