def validate_log_date(value):
    if not value or not isinstance(value, str):
        return False, "Date is required."

    parts = value.split("-")
    if len(parts) != 3:
        return False, "Date must be in YYYY-MM-DD format."

    return True, None


def validate_meal_name(name):
    if not name or not isinstance(name, str) or len(name.strip()) < 2:
        return False, "Meal name must be at least 2 characters long."

    return True, None


def validate_meal_order(value):
    try:
        parsed_value = int(value)
    except (TypeError, ValueError):
        return False, "Meal order must be a positive integer."

    if parsed_value <= 0:
        return False, "Meal order must be a positive integer."

    return True, None


def validate_food_id(value):
    try:
        parsed_value = int(value)
    except (TypeError, ValueError):
        return False, "Food ID must be a positive integer."

    if parsed_value <= 0:
        return False, "Food ID must be a positive integer."

    return True, None


def validate_grams(value):
    try:
        parsed_value = float(value)
    except (TypeError, ValueError):
        return False, "Grams must be a number."

    if parsed_value <= 0:
        return False, "Grams must be greater than 0."

    return True, None
