from app.routes.auth_routes import auth_bp
from app.routes.exercise_routes import exercise_bp
from app.routes.food_routes import food_bp
from app.routes.user_routes import user_bp
from app.routes.workout_routes import workout_bp
from app.routes.workout_session_routes import workout_session_bp
from app.routes.nutrition_routes import nutrition_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(exercise_bp)
    app.register_blueprint(food_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(workout_bp)
    app.register_blueprint(workout_session_bp)
    app.register_blueprint(nutrition_bp)