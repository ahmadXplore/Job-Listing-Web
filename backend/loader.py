import json
from datetime import datetime
from .database import db, Job

def load_jobs_from_json(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        # Check if job already exists to avoid duplicates
        existing_job = Job.query.filter_by(job_url=item["Job URL"]).first()
        if existing_job:
            print(f"Skipping duplicate job: {item['Job Title']} ({item['Job URL']})")
            continue

        # Convert string date to datetime object
        post_date_str = item.get("Job Posting Date")
        if post_date_str:
            try:
                post_date = datetime.strptime(post_date_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                post_date = datetime.utcnow() # Default to now if parsing fails
        else:
            post_date = datetime.utcnow() # Default to now if no date provided

        job = Job(
            title=item["Job Title"],
            company_url=item.get("Company URL"),
            job_url=item["Job URL"],
            post_date=post_date
        )
        db.session.add(job)
    db.session.commit()
