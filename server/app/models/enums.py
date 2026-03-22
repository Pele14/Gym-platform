import enum


class SexEnum(enum.Enum):
    MALE = "male"
    FEMALE = "female"


class ActivityLevelEnum(enum.Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    ACTIVE = "active"
    VERY_ACTIVE = "very_active"


class GoalTypeEnum(enum.Enum):
    LOSE = "lose"
    MAINTAIN = "maintain"
    GAIN = "gain"