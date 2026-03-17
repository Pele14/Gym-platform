from app.routes.auth_routes import auth_bp
from app.routes.profile_routes import profile_bp
from app.routes.exercise_routes import exercise_bp
from app.routes.food_routes import food_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(exercise_bp)
    app.register_blueprint(food_bp)