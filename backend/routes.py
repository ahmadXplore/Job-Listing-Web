from flask import Blueprint, request, jsonify
from .database import db, Job
from sqlalchemy import or_
from datetime import datetime
from urllib.parse import unquote

api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/jobs', methods=['GET'])
def get_jobs():
    query = Job.query

    # Keyword filter
    keyword = request.args.get('keyword')
    if keyword:
        query = query.filter(or_(
            Job.title.ilike(f'%{keyword}%'),
            Job.company_url.ilike(f'%{keyword}%')
        ))

    # Date filter (posted after a particular date)
    posted_after = request.args.get('posted_after')
    if posted_after:
        try:
            date_obj = datetime.strptime(posted_after, '%Y-%m-%d')
            query = query.filter(Job.post_date >= date_obj)
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    jobs = query.all()
    return jsonify([job.to_dict() for job in jobs])

# Replace int-only single-job endpoints with identifier-aware handlers


@api_bp.route('/jobs/<path:identifier>', methods=['GET'])
def get_job(identifier):
    # try numeric id first
    job = None
    if identifier.isdigit():
        job = Job.query.get(int(identifier))
    if not job:
        # treat identifier as encoded job URL
        job_url = unquote(identifier)
        job = Job.query.filter_by(job_url=job_url).first()
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify(job.to_dict())


@api_bp.route('/jobs', methods=['POST'])
def add_job():
    data = request.get_json()
    if not data or not all(key in data for key in ['Job Title', 'Job URL']):
        return jsonify({'error': 'Missing required fields (Job Title, Job URL)'}), 400

    # Check for duplicate job URL
    if Job.query.filter_by(job_url=data['Job URL']).first():
        return jsonify({'error': 'Job with this URL already exists.'}), 409

    post_date = datetime.utcnow()
    if 'Job Posting Date' in data:
        try:
            post_date = datetime.strptime(
                data['Job Posting Date'], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            pass  # Use default utcnow if format is wrong

    new_job = Job(
        title=data['Job Title'],
        company_url=data.get('Company URL'),
        job_url=data['Job URL'],
        post_date=post_date
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 201


@api_bp.route('/jobs/<path:identifier>', methods=['PUT'])
def update_job(identifier):
    # locate job by id or job_url
    job = None
    if identifier.isdigit():
        job = Job.query.get(int(identifier))
    if not job:
        job_url = unquote(identifier)
        job = Job.query.filter_by(job_url=job_url).first()
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided for update'}), 400

    if 'Job Title' in data:
        job.title = data['Job Title']
    if 'Company URL' in data:
        job.company_url = data['Company URL']
    if 'Job URL' in data:
        new_url = data['Job URL']
        # check duplicate URL (allow if it's the same job)
        existing = Job.query.filter_by(job_url=new_url).first()
        if existing and existing.id != job.id:
            return jsonify({'error': 'Job with this URL already exists.'}), 409
        job.job_url = new_url
    if 'Job Posting Date' in data:
        try:
            job.post_date = datetime.strptime(
                data['Job Posting Date'], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({'error': 'Invalid date format for Job Posting Date. Use YYYY-MM-DD HH:MM:SS.'}), 400

    db.session.commit()
    return jsonify(job.to_dict())


@api_bp.route('/jobs/<path:identifier>', methods=['DELETE'])
def delete_job(identifier):
    # locate job by id or job_url
    job = None
    if identifier.isdigit():
        job = Job.query.get(int(identifier))
    if not job:
        job_url = unquote(identifier)
        job = Job.query.filter_by(job_url=job_url).first()
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'}), 200
