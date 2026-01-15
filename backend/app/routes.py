from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Candidate, Project, Bid, Document
from datetime import datetime
import os
from werkzeug.utils import secure_filename

api_bp = Blueprint('api', __name__)

# Helper function
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Authentication Routes
@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'candidate')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.flush()
    
    # If candidate, create candidate profile
    if user.role == 'candidate':
        candidate = Candidate(
            user_id=user.id,
            company_name=data.get('company_name', ''),
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            registration_number=data.get('registration_number', '')
        )
        db.session.add(candidate)
    
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # CORRECTION ICI : Convertir user.id en string
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    }), 200

# Project Routes
@api_bp.route('/projects', methods=['GET'])
def get_projects():
    status = request.args.get('status', 'open')
    projects = Project.query.filter_by(status=status).all()
    
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'project_type': p.project_type,
        'budget': p.budget,
        'deadline': p.deadline.isoformat(),
        'status': p.status,
        'created_at': p.created_at.isoformat()
    } for p in projects]), 200

@api_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    # CORRECTION ICI : Convertir identity en int
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    project = Project(
        title=data['title'],
        description=data['description'],
        project_type=data['project_type'],
        budget=data.get('budget'),
        deadline=datetime.fromisoformat(data['deadline'])
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify({'message': 'Project created', 'id': project.id}), 201

@api_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    
    return jsonify({
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'project_type': project.project_type,
        'budget': project.budget,
        'deadline': project.deadline.isoformat(),
        'status': project.status,
        'bids_count': len(project.bids)
    }), 200

# Bid Routes
@api_bp.route('/projects/<int:project_id>/bids', methods=['POST'])
@jwt_required()
def submit_bid(project_id):
    # CORRECTION ICI : Convertir identity en int
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'candidate':
        return jsonify({'message': 'Only candidates can submit bids'}), 403
    
    project = Project.query.get_or_404(project_id)
    if project.status != 'open':
        return jsonify({'message': 'Project is not open for bids'}), 400
    
    data = request.get_json()
    bid = Bid(
        project_id=project_id,
        candidate_id=user.candidate.id,
        proposed_amount=data['proposed_amount'],
        proposed_timeline=data.get('proposed_timeline'),
        notes=data.get('notes')
    )
    
    db.session.add(bid)
    db.session.commit()
    
    return jsonify({'message': 'Bid submitted', 'bid_id': bid.id}), 201

@api_bp.route('/bids/<int:bid_id>/documents', methods=['POST'])
@jwt_required()
def upload_document(bid_id):
    bid = Bid.query.get_or_404(bid_id)
    
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    document_type = request.form.get('document_type')
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{bid_id}_{timestamp}_{filename}"
        
        upload_folder = os.getenv('UPLOAD_FOLDER', './uploads')
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        document = Document(
            bid_id=bid_id,
            document_type=document_type,
            file_name=filename,
            file_path=filepath,
            file_size=os.path.getsize(filepath)
        )
        
        db.session.add(document)
        db.session.commit()
        
        return jsonify({'message': 'Document uploaded', 'document_id': document.id}), 201
    
    return jsonify({'message': 'Invalid file type'}), 400

@api_bp.route('/bids', methods=['GET'])
@jwt_required()
def get_my_bids():
    # CORRECTION ICI : Convertir identity en int
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'candidate':
        return jsonify({'message': 'Only candidates can view bids'}), 403
    
    bids = Bid.query.filter_by(candidate_id=user.candidate.id).all()
    
    return jsonify([{
        'id': b.id,
        'project_title': b.project.title,
        'proposed_amount': b.proposed_amount,
        'status': b.status,
        'submitted_at': b.submitted_at.isoformat()
    } for b in bids]), 200

# Admin Routes
@api_bp.route('/admin/bids', methods=['GET'])
@jwt_required()
def get_all_bids():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    project_id = request.args.get('project_id')
    
    if project_id:
        bids = Bid.query.filter_by(project_id=project_id).all()
    else:
        bids = Bid.query.all()
    
    return jsonify([{
        'id': b.id,
        'project_id': b.project_id,
        'project_title': b.project.title,
        'candidate_id': b.candidate_id,
        'company_name': b.candidate.company_name,
        'proposed_amount': b.proposed_amount,
        'proposed_timeline': b.proposed_timeline,
        'status': b.status,
        'notes': b.notes,
        'submitted_at': b.submitted_at.isoformat(),
        'documents_count': len(b.documents)
    } for b in bids]), 200

@api_bp.route('/admin/bids/<int:bid_id>', methods=['GET'])
@jwt_required()
def get_bid_details(bid_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    bid = Bid.query.get_or_404(bid_id)
    
    return jsonify({
        'id': bid.id,
        'project': {
            'id': bid.project.id,
            'title': bid.project.title,
            'description': bid.project.description,
            'budget': bid.project.budget
        },
        'candidate': {
            'id': bid.candidate.id,
            'company_name': bid.candidate.company_name,
            'phone': bid.candidate.phone,
            'address': bid.candidate.address,
            'registration_number': bid.candidate.registration_number
        },
        'proposed_amount': bid.proposed_amount,
        'proposed_timeline': bid.proposed_timeline,
        'status': bid.status,
        'notes': bid.notes,
        'submitted_at': bid.submitted_at.isoformat(),
        'documents': [{
            'id': d.id,
            'document_type': d.document_type,
            'file_name': d.file_name,
            'file_size': d.file_size,
            'uploaded_at': d.uploaded_at.isoformat(),
            'verified': d.verified
        } for d in bid.documents]
    }), 200

@api_bp.route('/admin/bids/<int:bid_id>/status', methods=['PUT'])
@jwt_required()
def update_bid_status(bid_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    bid = Bid.query.get_or_404(bid_id)
    data = request.get_json()
    
    bid.status = data['status']  # accepted, rejected, under_review
    bid.reviewed_at = datetime.utcnow()
    
    if 'notes' in data:
        bid.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({'message': 'Bid status updated', 'status': bid.status}), 200

@api_bp.route('/admin/documents/<int:document_id>/verify', methods=['PUT'])
@jwt_required()
def verify_document(document_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    document = Document.query.get_or_404(document_id)
    data = request.get_json()
    
    document.verified = data.get('verified', True)
    document.verification_notes = data.get('notes', '')
    
    db.session.commit()
    
    return jsonify({'message': 'Document verified', 'verified': document.verified}), 200

@api_bp.route('/documents/<int:document_id>/download', methods=['GET'])
@jwt_required()
def download_document(document_id):
    document = Document.query.get_or_404(document_id)
    
    if not os.path.exists(document.file_path):
        return jsonify({'message': 'File not found'}), 404
    
    return send_file(document.file_path, as_attachment=True, download_name=document.file_name)

@api_bp.route('/admin/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    
    if 'title' in data:
        project.title = data['title']
    if 'description' in data:
        project.description = data['description']
    if 'status' in data:
        project.status = data['status']
    if 'budget' in data:
        project.budget = data['budget']
    if 'deadline' in data:
        project.deadline = datetime.fromisoformat(data['deadline'])
    
    project.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Project updated', 'id': project.id}), 200

@api_bp.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    total_projects = Project.query.count()
    open_projects = Project.query.filter_by(status='open').count()
    total_bids = Bid.query.count()
    pending_bids = Bid.query.filter_by(status='submitted').count()
    total_candidates = Candidate.query.count()
    
    return jsonify({
        'total_projects': total_projects,
        'open_projects': open_projects,
        'total_bids': total_bids,
        'pending_bids': pending_bids,
        'total_candidates': total_candidates
    }), 200