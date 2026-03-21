def validate_plan_name(name: str):
    if not isinstance(name, str):
        return False, "Plan name is required."

    value = name.strip()

    if not value:
        return False, "Plan name is required."

    if len(value) < 2:
        return False, "Plan name must be at least 2 characters long."

    if len(value) > 120:
        return False, "Plan name must be at most 120 characters long."

    return True, None


def validate_optional_text(value, field_name: str, max_length: int = 1000):
    if value is None:
        return True, None

    if not isinstance(value, str):
        return False, f"{field_name} must be a string."

    if len(value) > max_length:
        return False, f"{field_name} must be at most {max_length} characters long."

    return True, None


def validate_positive_int(value, field_name: str, required: bool = False):
    if value is None:
        if required:
            return False, f"{field_name} is required."
        return True, None

    if isinstance(value, bool):
        return False, f"{field_name} must be a positive integer."

    try:
        parsed = int(value)
    except (ValueError, TypeError):
        return False, f"{field_name} must be a positive integer."

    if parsed <= 0:
        return False, f"{field_name} must be greater than 0."

    return True, None


def validate_weight(value, field_name: str = "Weight"):
    if value is None:
        return True, None

    try:
        parsed = float(value)
    except (ValueError, TypeError):
        return False, f"{field_name} must be a number."

    if parsed < 0:
        return False, f"{field_name} cannot be negative."

    if parsed > 500:
        return False, f"{field_name} is unrealistically high."

    return True, None