from datetime import datetime

from app.extensions import db


class Exercise(db.Model):
    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    muscle_group = db.Column(db.String(50), nullable=False)
    equipment = db.Column(db.String(50), nullable=True)
    difficulty = db.Column(db.String(20), nullable=True)

    is_system = db.Column(db.Boolean, nullable=False, default=False)
    created_by_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

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
            "name": self.name,
            "description": self.description,
            "muscle_group": self.muscle_group,
            "equipment": self.equipment,
            "difficulty": self.difficulty,
            "is_system": self.is_system,
            "created_by_user_id": self.created_by_user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }