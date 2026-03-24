from datetime import datetime

from app.extensions import db


class DailyNutritionLog(db.Model):
    __tablename__ = "daily_nutrition_logs"
    __table_args__ = (
        db.UniqueConstraint("user_id", "log_date", name="uq_user_log_date"),
    )

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    log_date = db.Column(db.Date, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    meals = db.relationship(
        "Meal",
        backref="daily_log",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Meal.meal_order.asc(), Meal.created_at.asc()"
    )

    def get_total_calories(self):
        return round(sum(meal.get_total_calories() for meal in self.meals), 2)

    def get_total_protein(self):
        return round(sum(meal.get_total_protein() for meal in self.meals), 2)

    def get_total_carbs(self):
        return round(sum(meal.get_total_carbs() for meal in self.meals), 2)

    def get_total_fat(self):
        return round(sum(meal.get_total_fat() for meal in self.meals), 2)

    def to_dict(self, include_meals: bool = True):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "log_date": self.log_date.isoformat(),
            "total_calories": self.get_total_calories(),
            "total_protein": self.get_total_protein(),
            "total_carbs": self.get_total_carbs(),
            "total_fat": self.get_total_fat(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "meals": [meal.to_dict() for meal in self.meals] if include_meals else []
        }
