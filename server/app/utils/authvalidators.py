import re


def validate_email(email: str):
    if not email:
        return False, "Email is required."

    pattern = r"^[^@]+@[^@]+\.[^@]+$"

    if not re.match(pattern, email):
        return False, "Invalid email format."

    return True, None


def validate_username(username: str):
    if not username:
        return False, "Username is required."

    if len(username) < 3:
        return False, "Username must be at least 3 characters long."

    if len(username) > 30:
        return False, "Username is too long."

    return True, None


def validate_password(password: str):
    if not password:
        return False, "Password is required."

    if len(password) < 8:
        return False, "Password must be at least 8 characters long."

    return True, None


def validate_login_password(password: str):
    if not password:
        return False, "Password is required."

    return True, None

def validate_first_name(first_name: str):
    if not first_name:
        return False, "First name is required."

    if len(first_name) < 2:
        return False, "First name must be at least 2 characters long."

    return True, None


def validate_last_name(last_name: str):
    if not last_name:
        return False, "Last name is required."

    if len(last_name) < 2:
        return False, "Last name must be at least 2 characters long."

    return True, None