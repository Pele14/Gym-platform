from datetime import datetime

from app.repositories.profile_repository import ProfileRepository


class ProfileService:
    @staticmethod
    def get_my_profile(user_id: int):
        return ProfileRepository.get_by_user_id(user_id)

    @staticmethod
    def update_profile(
        user_id: int,
        date_of_birth=None,
        profile_image_url=None,
        height_cm=None,
        weight_kg=None
    ):
        profile = ProfileRepository.get_by_user_id(user_id)
        if not profile:
            return None, "Profile not found."

        parsed_date_of_birth = None
        if date_of_birth is not None:
            if date_of_birth == "":
                parsed_date_of_birth = None
            else:
                try:
                    parsed_date_of_birth = datetime.strptime(
                        date_of_birth, "%Y-%m-%d"
                    ).date()
                except ValueError:
                    return None, "Date of birth must be in YYYY-MM-DD format."

        parsed_height_cm = None
        if height_cm is not None:
            try:
                parsed_height_cm = float(height_cm)
            except (ValueError, TypeError):
                return None, "Height must be a number."

            if parsed_height_cm <= 0:
                return None, "Height must be greater than 0."

        parsed_weight_kg = None
        if weight_kg is not None:
            try:
                parsed_weight_kg = float(weight_kg)
            except (ValueError, TypeError):
                return None, "Weight must be a number."

            if parsed_weight_kg <= 0:
                return None, "Weight must be greater than 0."

        updated_profile = ProfileRepository.update_profile(
            profile=profile,
            date_of_birth=parsed_date_of_birth if date_of_birth is not None else None,
            profile_image_url=profile_image_url,
            height_cm=parsed_height_cm if height_cm is not None else None,
            weight_kg=parsed_weight_kg if weight_kg is not None else None
        )

        return updated_profile, None