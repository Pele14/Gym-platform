from datetime import datetime

from app.models.enums import ActivityLevelEnum, GoalTypeEnum, SexEnum
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
        weight_kg=None,
        sex=None,
        activity_level=None,
        goal_type=None
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

        parsed_sex = None
        if sex is not None:
            if sex == "":
                parsed_sex = None
            elif not isinstance(sex, str):
                return None, "Sex must be a string."
            else:
                try:
                    parsed_sex = SexEnum(sex.strip().lower())
                except ValueError:
                    return None, "Sex must be 'male' or 'female'."

        parsed_activity_level = None
        if activity_level is not None:
            if activity_level == "":
                parsed_activity_level = None
            elif not isinstance(activity_level, str):
                return None, "Activity level must be a string."
            else:
                try:
                    parsed_activity_level = ActivityLevelEnum(
                        activity_level.strip().lower()
                    )
                except ValueError:
                    return None, (
                        "Activity level must be one of: "
                        "sedentary, light, moderate, active, very_active."
                    )

        parsed_goal_type = None
        if goal_type is not None:
            if goal_type == "":
                parsed_goal_type = None
            elif not isinstance(goal_type, str):
                return None, "Goal type must be a string."
            else:
                try:
                    parsed_goal_type = GoalTypeEnum(goal_type.strip().lower())
                except ValueError:
                    return None, "Goal type must be one of: lose, maintain, gain."

        updated_profile = ProfileRepository.update_profile(
            profile=profile,
            date_of_birth=parsed_date_of_birth if date_of_birth is not None else None,
            profile_image_url=profile_image_url,
            height_cm=parsed_height_cm if height_cm is not None else None,
            weight_kg=parsed_weight_kg if weight_kg is not None else None,
            sex=parsed_sex if sex is not None else None,
            activity_level=parsed_activity_level if activity_level is not None else None,
            goal_type=parsed_goal_type if goal_type is not None else None
        )

        return updated_profile, None