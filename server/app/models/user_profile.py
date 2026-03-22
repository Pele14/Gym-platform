from datetime import datetime, date

from app.extensions import db


class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    date_of_birth = db.Column(db.Date, nullable=True)
    profile_image_url = db.Column(db.String(500), nullable=True)
    height_cm = db.Column(db.Float, nullable=True)
    weight_kg = db.Column(db.Float, nullable=True)

    sex = db.Column(db.String(20), nullable=True)
    activity_level = db.Column(db.String(30), nullable=True)
    goal_type = db.Column(db.String(20), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    def get_age(self):
        if not self.date_of_birth:
            return None

        today = date.today()
        age = today.year - self.date_of_birth.year

        if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
            age -= 1

        return age

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "age": self.get_age(),
            "profile_image_url": self.profile_image_url,
            "height_cm": self.height_cm,
            "weight_kg": self.weight_kg,
            "sex": self.sex,
            "activity_level": self.activity_level,
            "goal_type": self.goal_type,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }