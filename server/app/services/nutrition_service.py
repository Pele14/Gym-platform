from app.models.enums import ActivityLevelEnum, GoalTypeEnum, SexEnum, ActivityFactorEnum
from app.repositories.nutrition_repository import NutritionRepository
from app.repositories.profile_repository import ProfileRepository


class NutritionService:

    @staticmethod
    def get_goal(user_id: int):
        return NutritionRepository.get_goal_by_user_id(user_id)

    @staticmethod
    def calculate_and_save_goal(user_id: int):
        profile = ProfileRepository.get_by_user_id(user_id)

        if not profile:
            return None, "Profile not found."

        if (
            profile.height_cm is None
            or profile.weight_kg is None
            or profile.get_age() is None
            or profile.sex is None
            or profile.activity_level is None
            or profile.goal_type is None
        ):
            return None, "Complete your profile information first."

        height_cm = profile.height_cm
        weight_kg = profile.weight_kg
        age = profile.get_age()
        sex = profile.sex
        activity_level = profile.activity_level
        goal_type = profile.goal_type

        bmi = weight_kg / ((height_cm / 100) ** 2)

        if sex == SexEnum.MALE:
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
        elif sex == SexEnum.FEMALE:
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
        else:
            return None, "Invalid sex value."

        activity_factor = ActivityFactorEnum[activity_level.name].value
        if activity_factor is None:
            return None, "Invalid activity level."

        maintenance_calories = bmr * activity_factor

        if goal_type == GoalTypeEnum.LOSE:
            target_calories = maintenance_calories - 400
        elif goal_type == GoalTypeEnum.MAINTAIN:
            target_calories = maintenance_calories
        elif goal_type == GoalTypeEnum.GAIN:
            target_calories = maintenance_calories + 300
        else:
            return None, "Invalid goal type."

        target_protein = weight_kg * 2.0
        target_fat = weight_kg * 0.8

        protein_calories = target_protein * 4
        fat_calories = target_fat * 9
        carbs_calories = target_calories - protein_calories - fat_calories

        if carbs_calories < 0:
            carbs_calories = 0

        target_carbs = carbs_calories / 4

        bmi = round(bmi, 2)
        maintenance_calories = round(maintenance_calories, 2)
        target_calories = round(target_calories, 2)
        target_protein = round(target_protein, 2)
        target_fat = round(target_fat, 2)
        target_carbs = round(target_carbs, 2)

        existing_goal = NutritionRepository.get_goal_by_user_id(user_id)

        if existing_goal:
            updated_goal = NutritionRepository.update_goal(
                goal=existing_goal,
                bmi=bmi,
                maintenance_calories=maintenance_calories,
                target_calories=target_calories,
                target_protein=target_protein,
                target_carbs=target_carbs,
                target_fat=target_fat
            )
            return updated_goal, None

        new_goal = NutritionRepository.create_goal(
            user_id=user_id,
            bmi=bmi,
            maintenance_calories=maintenance_calories,
            target_calories=target_calories,
            target_protein=target_protein,
            target_carbs=target_carbs,
            target_fat=target_fat
        )

        return new_goal, None