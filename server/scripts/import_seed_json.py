import argparse
import json
from pathlib import Path
from typing import Any

from sqlalchemy import func

from app import create_app
from app.extensions import db
from app.models.exercise import Exercise
from app.models.food import Food
from app.utils.exercise_validators import (
    validate_exercise_name,
    validate_muscle_group,
    validate_optional_text,
)
from app.utils.food_validators import validate_food_name, validate_macros


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().lower()


def normalize_nullable_text(value: Any) -> str | None:
    if value is None:
        return None
    cleaned = str(value).strip()
    return cleaned if cleaned else None


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Seed file not found: {path}")

    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    if not isinstance(payload, dict):
        raise ValueError("Seed file root must be a JSON object.")

    return payload


def validate_payload(payload: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    foods = payload.get("foods", [])
    exercises = payload.get("exercises", [])

    if not isinstance(foods, list):
        raise ValueError("'foods' must be a list.")
    if not isinstance(exercises, list):
        raise ValueError("'exercises' must be a list.")

    return foods, exercises


def validate_food_row(row: dict[str, Any], index: int) -> dict[str, Any]:
    name = str(row.get("name", "")).strip()
    brand = normalize_nullable_text(row.get("brand"))

    valid, error = validate_food_name(name)
    if not valid:
        raise ValueError(f"foods[{index}]: {error}")

    calories = row.get("calories_per_100g")
    protein = row.get("protein_per_100g")
    carbs = row.get("carbs_per_100g")
    fat = row.get("fat_per_100g")

    for field_name, field_value in [
        ("calories_per_100g", calories),
        ("protein_per_100g", protein),
        ("carbs_per_100g", carbs),
        ("fat_per_100g", fat),
    ]:
        valid, error = validate_macros(field_value, field_name)
        if not valid:
            raise ValueError(f"foods[{index}]: {error}")

    return {
        "name": name,
        "brand": brand,
        "calories_per_100g": float(calories),
        "protein_per_100g": float(protein),
        "carbs_per_100g": float(carbs),
        "fat_per_100g": float(fat),
    }


def validate_exercise_row(row: dict[str, Any], index: int) -> dict[str, Any]:
    name = str(row.get("name", "")).strip()
    muscle_group = str(row.get("muscle_group", "")).strip()
    description = normalize_nullable_text(row.get("description"))
    equipment = normalize_nullable_text(row.get("equipment"))
    difficulty = normalize_nullable_text(row.get("difficulty"))

    valid, error = validate_exercise_name(name)
    if not valid:
        raise ValueError(f"exercises[{index}]: {error}")

    valid, error = validate_muscle_group(muscle_group)
    if not valid:
        raise ValueError(f"exercises[{index}]: {error}")

    for value, field_name, max_length in [
        (description, "Description", 2000),
        (equipment, "Equipment", 50),
        (difficulty, "Difficulty", 20),
    ]:
        valid, error = validate_optional_text(value, field_name, max_length)
        if not valid:
            raise ValueError(f"exercises[{index}]: {error}")

    return {
        "name": name,
        "muscle_group": muscle_group,
        "description": description,
        "equipment": equipment,
        "difficulty": difficulty,
    }


def upsert_food(row: dict[str, Any]) -> str:
    existing = (
        Food.query
        .filter(Food.is_system.is_(True))
        .filter(func.lower(Food.name) == normalize_text(row["name"]))
        .filter(func.lower(func.coalesce(Food.brand, "")) == normalize_text(row["brand"] or ""))
        .first()
    )

    if not existing:
        db.session.add(
            Food(
                name=row["name"],
                brand=row["brand"],
                calories_per_100g=row["calories_per_100g"],
                protein_per_100g=row["protein_per_100g"],
                carbs_per_100g=row["carbs_per_100g"],
                fat_per_100g=row["fat_per_100g"],
                is_system=True,
                created_by_user_id=None,
            )
        )
        return "created"

    changed = False

    for field in [
        "name",
        "brand",
        "calories_per_100g",
        "protein_per_100g",
        "carbs_per_100g",
        "fat_per_100g",
    ]:
        new_value = row[field]
        if getattr(existing, field) != new_value:
            setattr(existing, field, new_value)
            changed = True

    if existing.is_system is not True:
        existing.is_system = True
        changed = True

    if existing.created_by_user_id is not None:
        existing.created_by_user_id = None
        changed = True

    return "updated" if changed else "skipped"


def upsert_exercise(row: dict[str, Any]) -> str:
    existing = (
        Exercise.query
        .filter(Exercise.is_system.is_(True))
        .filter(func.lower(Exercise.name) == normalize_text(row["name"]))
        .first()
    )

    if not existing:
        db.session.add(
            Exercise(
                name=row["name"],
                muscle_group=row["muscle_group"],
                description=row["description"],
                equipment=row["equipment"],
                difficulty=row["difficulty"],
                is_system=True,
                created_by_user_id=None,
            )
        )
        return "created"

    changed = False

    for field in ["name", "muscle_group", "description", "equipment", "difficulty"]:
        new_value = row[field]
        if getattr(existing, field) != new_value:
            setattr(existing, field, new_value)
            changed = True

    if existing.is_system is not True:
        existing.is_system = True
        changed = True

    if existing.created_by_user_id is not None:
        existing.created_by_user_id = None
        changed = True

    return "updated" if changed else "skipped"


def run_import(payload: dict[str, Any]) -> None:
    foods_payload, exercises_payload = validate_payload(payload)

    food_stats = {"created": 0, "updated": 0, "skipped": 0}
    exercise_stats = {"created": 0, "updated": 0, "skipped": 0}

    for index, row in enumerate(foods_payload):
        if not isinstance(row, dict):
            raise ValueError(f"foods[{index}] must be an object.")
        validated = validate_food_row(row, index)
        status = upsert_food(validated)
        food_stats[status] += 1

    for index, row in enumerate(exercises_payload):
        if not isinstance(row, dict):
            raise ValueError(f"exercises[{index}] must be an object.")
        validated = validate_exercise_row(row, index)
        status = upsert_exercise(validated)
        exercise_stats[status] += 1

    db.session.commit()

    print("Seed import completed.")
    print(
        "Foods    -> "
        f"created: {food_stats['created']}, "
        f"updated: {food_stats['updated']}, "
        f"skipped: {food_stats['skipped']}"
    )
    print(
        "Exercises-> "
        f"created: {exercise_stats['created']}, "
        f"updated: {exercise_stats['updated']}, "
        f"skipped: {exercise_stats['skipped']}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Import seed foods and exercises from JSON.")
    parser.add_argument(
        "--file",
        default="scripts/seed_data.json",
        help="Path to JSON seed file (default: scripts/seed_data.json)",
    )

    args = parser.parse_args()
    seed_file = Path(args.file)

    app = create_app()

    with app.app_context():
        try:
            payload = load_json(seed_file)
            run_import(payload)
        except Exception as exc:
            db.session.rollback()
            raise SystemExit(f"Seed import failed: {exc}") from exc


if __name__ == "__main__":
    main()
