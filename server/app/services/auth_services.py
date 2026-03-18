from app.repositories.auth_repository import AuthRepository
from app.repositories.profile_repository import ProfileRepository

class AuthService:

    @staticmethod
    def register_user(username: str, first_name: str, last_name: str, email: str, password: str):
        existing_email = AuthRepository.get_by_email(email)
        if existing_email:
            return None, "Email already exists."

        existing_username = AuthRepository.get_by_username(username)
        if existing_username:
            return None, "Username already exists."
        user = AuthRepository.create_user(
            username,
            first_name,
            last_name,
            email,
            password
        )
        ProfileRepository.create_empty_profile(user.id)

        return user, None

    @staticmethod
    def login_user(email: str, password: str):
        user = AuthRepository.get_by_email(email)

        if not user:
            return None

        if not user.check_password(password):
            return None

        if not user.is_active:
            return None

        return user

    @staticmethod
    def get_user_by_id(user_id: int):
        return AuthRepository.get_by_id(user_id)