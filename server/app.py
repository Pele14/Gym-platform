from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
CORS(app)

# konekcija ka MySQL containeru
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:root@db:3306/gym_platform"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

@app.route("/")
def home():
    return {"message": "Gym Platform API running"}

@app.route("/api/test")
def test():
    return {"message": "Backend works"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)