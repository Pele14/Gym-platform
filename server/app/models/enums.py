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

class ActivityFactorEnum(enum.Enum):
    SEDENTARY = 1.2
    LIGHT = 1.375
    MODERATE = 1.55
    ACTIVE = 1.725
    VERY_ACTIVE = 1.9