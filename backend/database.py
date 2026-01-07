from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company_url = db.Column(db.String(200))
    job_url = db.Column(db.String(200), unique=True, nullable=False)
    post_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Job {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'Job Title': self.title,
            'Company URL': self.company_url,
            'Job URL': self.job_url,
            'Job Posting Date': self.post_date.strftime("%Y-%m-%d %H:%M:%S")
        }
