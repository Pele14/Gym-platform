from app.repositories.auth_repository import AuthRepository


class AuthService:

    @staticmethod
    def register_user(username: str, email: str, password: str):
        existing_email = AuthRepository.get_by_email(email)
        if existing_email:
            return None, "Email already exists."

        existing_username = AuthRepository.get_by_username(username)
        if existing_username:
            return None, "Username already exists."

        user = AuthRepository.create_user(username, email, password)

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