from datetime import datetime

from app.extensions import db


class MealFoodEntry(db.Model):
    __tablename__ = "meal_food_entries"

    id = db.Column(db.Integer, primary_key=True)

    meal_id = db.Column(
        db.Integer,
        db.ForeignKey("meals.id"),
        nullable=False
    )

    food_id = db.Column(
        db.Integer,
        db.ForeignKey("foods.id"),
        nullable=False
    )

    food_name = db.Column(db.String(100), nullable=False)
    food_brand = db.Column(db.String(100), nullable=True)
    grams = db.Column(db.Float, nullable=False)

    consumed_calories = db.Column(db.Float, nullable=False)
    consumed_protein = db.Column(db.Float, nullable=False)
    consumed_carbs = db.Column(db.Float, nullable=False)
    consumed_fat = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    food = db.relationship("Food", backref="meal_entries")

    def to_dict(self):
        return {
            "id": self.id,
            "meal_id": self.meal_id,
            "food_id": self.food_id,
            "food_name": self.food_name,
            "food_brand": self.food_brand,
            "grams": self.grams,
            "consumed_calories": self.consumed_calories,
            "consumed_protein": self.consumed_protein,
            "consumed_carbs": self.consumed_carbs,
            "consumed_fat": self.consumed_fat,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
