def validate_exercise_name(name: str):
    if not name:
        return False, "Exercise name is required."

    if len(name) < 2:
        return False, "Exercise name must be at least 2 characters long."

    if len(name) > 100:
        return False, "Exercise name is too long."

    return True, None


def validate_muscle_group(muscle_group: str):
    if not muscle_group:
        return False, "Muscle group is required."

    if len(muscle_group) < 2:
        return False, "Muscle group must be at least 2 characters long."

    if len(muscle_group) > 50:
        return False, "Muscle group is too long."

    return True, None


def validate_optional_text(value: str, field_name: str, max_length: int):
    if value is None:
        return True, None

    if len(value) > max_length:
        return False, f"{field_name} is too long."

    return True, None