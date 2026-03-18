from app.extensions import db
from app.models.user import User


class AuthRepository:

    @staticmethod
    def get_by_email(email: str):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_by_username(username: str):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_by_id(user_id: int):
        return db.session.get(User, user_id)
    
    @staticmethod
    def get_all_users():
        return User.query.order_by(User.created_at.desc()).all()


    @staticmethod
    def create_user(username: str, first_name: str, last_name: str, email: str, password: str):
        role = "admin" if email == "admin@gmail.com" else "user"

        user = User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role=role
        )

        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return user