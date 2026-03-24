from datetime import datetime

from app.extensions import db


class Meal(db.Model):
    __tablename__ = "meals"

    id = db.Column(db.Integer, primary_key=True)

    daily_nutrition_log_id = db.Column(
        db.Integer,
        db.ForeignKey("daily_nutrition_logs.id"),
        nullable=False
    )

    name = db.Column(db.String(100), nullable=False)
    meal_order = db.Column(db.Integer, nullable=False, default=1)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    entries = db.relationship(
        "MealFoodEntry",
        backref="meal",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="MealFoodEntry.created_at.asc()"
    )

    def get_total_calories(self):
        return round(sum(entry.consumed_calories for entry in self.entries), 2)

    def get_total_protein(self):
        return round(sum(entry.consumed_protein for entry in self.entries), 2)

    def get_total_carbs(self):
        return round(sum(entry.consumed_carbs for entry in self.entries), 2)

    def get_total_fat(self):
        return round(sum(entry.consumed_fat for entry in self.entries), 2)

    def to_dict(self, include_entries: bool = True):
        return {
            "id": self.id,
            "daily_nutrition_log_id": self.daily_nutrition_log_id,
            "name": self.name,
            "meal_order": self.meal_order,
            "total_calories": self.get_total_calories(),
            "total_protein": self.get_total_protein(),
            "total_carbs": self.get_total_carbs(),
            "total_fat": self.get_total_fat(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "entries": [entry.to_dict() for entry in self.entries] if include_entries else []
        }
