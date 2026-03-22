from datetime import datetime

from app.extensions import db


class WorkoutExerciseSession(db.Model):
    __tablename__ = "workout_exercise_sessions"

    id = db.Column(db.Integer, primary_key=True)

    workout_session_id = db.Column(
        db.Integer,
        db.ForeignKey("workout_sessions.id"),
        nullable=False
    )

    exercise_id = db.Column(
        db.Integer,
        db.ForeignKey("exercises.id"),
        nullable=False
    )

    exercise_order = db.Column(db.Integer, nullable=False, default=1)
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    exercise = db.relationship("Exercise")

    sets = db.relationship(
        "WorkoutSetSession",
        backref="workout_exercise_session",
        cascade="all, delete-orphan",
        order_by="WorkoutSetSession.set_order.asc()"
    )

    def to_dict(self, include_sets: bool = False):
        data = {
            "id": self.id,
            "workout_session_id": self.workout_session_id,
            "exercise_id": self.exercise_id,
            "exercise_order": self.exercise_order,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "exercise": self.exercise.to_dict() if self.exercise else None
        }

        if include_sets:
            data["sets"] = [set_item.to_dict() for set_item in self.sets]

        return data