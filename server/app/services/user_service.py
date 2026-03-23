from app.repositories.auth_repository import AuthRepository


class UserService:
    @staticmethod
    def get_user_by_id(user_id: int):
        return AuthRepository.get_by_id(user_id)

    @staticmethod
    def get_all_users():
        return AuthRepository.get_all_users()

    @staticmethod
    def update_my_user(
        user_id: int,
        username: str = None,
        first_name: str = None,
        last_name: str = None,
        email: str = None
    ):
        user = AuthRepository.get_by_id(user_id)

        if not user:
            return None, "User not found."

        if username is not None:
            existing_username = AuthRepository.get_by_username(username)
            if existing_username and existing_username.id != user.id:
                return None, "Username already exists."

        if email is not None:
            existing_email = AuthRepository.get_by_email(email)
            if existing_email and existing_email.id != user.id:
                return None, "Email already exists."

        updated_user = AuthRepository.update_user(
            user=user,
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        return updated_user, None