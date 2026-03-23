from datetime import datetime

from app.extensions import db


class NutritionGoal(db.Model):
    __tablename__ = "nutrition_goals"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    bmi = db.Column(db.Float, nullable=False)
    maintenance_calories = db.Column(db.Float, nullable=False)
    target_calories = db.Column(db.Float, nullable=False)

    target_protein = db.Column(db.Float, nullable=False)
    target_carbs = db.Column(db.Float, nullable=False)
    target_fat = db.Column(db.Float, nullable=False)

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
            "user_id": self.user_id,
            "bmi": self.bmi,
            "maintenance_calories": self.maintenance_calories,
            "target_calories": self.target_calories,
            "target_protein": self.target_protein,
            "target_carbs": self.target_carbs,
            "target_fat": self.target_fat,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }