from datetime import datetime

from app.extensions import db


class WorkoutSetSession(db.Model):
    __tablename__ = "workout_set_sessions"

    id = db.Column(db.Integer, primary_key=True)

    workout_exercise_session_id = db.Column(
        db.Integer,
        db.ForeignKey("workout_exercise_sessions.id"),
        nullable=False
    )

    set_order = db.Column(db.Integer, nullable=False, default=1)

    planned_reps = db.Column(db.Integer, nullable=False)
    planned_weight_kg = db.Column(db.Float, nullable=False)

    actual_reps = db.Column(db.Integer, nullable=True)
    actual_weight_kg = db.Column(db.Float, nullable=True)

    volume = db.Column(db.Float, nullable=False, default=0.0)
    is_completed = db.Column(db.Boolean, nullable=False, default=False)

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
            "workout_exercise_session_id": self.workout_exercise_session_id,
            "set_order": self.set_order,
            "planned_reps": self.planned_reps,
            "planned_weight_kg": self.planned_weight_kg,
            "actual_reps": self.actual_reps,
            "actual_weight_kg": self.actual_weight_kg,
            "volume": self.volume,
            "is_completed": self.is_completed,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }