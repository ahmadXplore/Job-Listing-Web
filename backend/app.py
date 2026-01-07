from flask import Flask
from flask_cors import CORS
from .database import db, Job
from .loader import load_jobs_from_json
import os

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobs.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

from .routes import api_bp
app.register_blueprint(api_bp)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Load initial data from output.json if the database is empty
        if not os.path.exists('jobs.db') or Job.query.count() == 0:
            json_file = os.path.join(os.path.dirname(__file__), 'output.json')
            print(f"Attempting to load data from: {json_file}")
            if os.path.exists(json_file):
                load_jobs_from_json(json_file)
                print(f"Loaded data from {json_file} into the database.")
            else:
                print(f"Warning: {json_file} not found. Database will be empty.")
    app.run(debug=True)
