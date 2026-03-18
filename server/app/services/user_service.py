from app.repositories.auth_repository import AuthRepository


class UserService:
    @staticmethod
    def get_user_by_id(user_id: int):
        return AuthRepository.get_by_id(user_id)

    @staticmethod
    def get_all_users():
        return AuthRepository.get_all_users()