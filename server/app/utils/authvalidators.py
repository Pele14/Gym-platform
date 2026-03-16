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