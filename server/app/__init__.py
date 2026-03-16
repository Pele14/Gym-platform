import time

from flask import Flask
from flask_cors import CORS
from sqlalchemy.exc import OperationalError

from app.config import Config
from app.extensions import db, jwt
from app.routes import register_routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    register_routes(app)

    with app.app_context():
        from app.models import User

        max_retries = 10
        retry_delay = 3

        for attempt in range(max_retries):
            try:
                db.create_all()
                print("Database connected and tables created.")
                break
            except OperationalError:
                print(
                    f"Database not ready yet... "
                    f"attempt {attempt + 1}/{max_retries}"
                )
                time.sleep(retry_delay)
        else:
            raise RuntimeError("Could not connect to the database after multiple attempts.")

    return app