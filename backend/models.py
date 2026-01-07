from .app import db

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(255), nullable=False)
    company_url = db.Column(db.String(255))
    job_url = db.Column(db.String(255), nullable=False)
    job_posting_date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<Job {self.job_title}>"





