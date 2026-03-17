def validate_food_name(name):
    if not name or len(name) < 2:
        return False, "Invalid food name."
    return True, None


def validate_macros(value, field):
    try:
        value = float(value)
    except:
        return False, f"{field} must be number."

    if value < 0:
        return False, f"{field} cannot be negative."

    return True, None