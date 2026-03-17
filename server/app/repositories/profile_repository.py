from app.extensions import db
from app.models.user_profile import UserProfile


class ProfileRepository:
    @staticmethod
    def get_by_user_id(user_id: int):
        return UserProfile.query.filter_by(user_id=user_id).first()

    @staticmethod
    def create_empty_profile(user_id: int):
        profile = UserProfile(
            user_id=user_id,
            date_of_birth=None,
            profile_image_url=None,
            height_cm=None,
            weight_kg=None
        )

        db.session.add(profile)
        db.session.commit()

        return profile

    @staticmethod
    def update_profile(
        profile: UserProfile,
        date_of_birth=None,
        profile_image_url=None,
        height_cm=None,
        weight_kg=None
    ):
        if date_of_birth is not None:
            profile.date_of_birth = date_of_birth

        if profile_image_url is not None:
            profile.profile_image_url = profile_image_url

        if height_cm is not None:
            profile.height_cm = height_cm

        if weight_kg is not None:
            profile.weight_kg = weight_kg

        db.session.commit()

        return profile