# backend/app/routes.py - FICHIER COMPLET
from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import os
from werkzeug.utils import secure_filename

from . import db
from .models import User, Candidate, Project, Bid, Document

app = current_app._get_current_object()

# ============================================
# AUTHENTIFICATION
# ============================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Inscription d'un nouveau candidat"""
    try:
        data = request.get_json()
        
        # Vérifier si l'email existe déjà
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 400
        
        # Créer l'utilisateur
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            role='candidate'
        )
        db.session.add(user)
        db.session.flush()
        
        # Créer le profil candidat
        candidate = Candidate(
            user_id=user.id,
            company_name=data.get('company_name'),
            phone=data.get('phone'),
            address=data.get('address'),
            registration_number=data.get('registration_number')
        )
        db.session.add(candidate)
        db.session.commit()
        
        return jsonify({'message': 'Registration successful'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Connexion"""
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
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
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ============================================
# PROJETS (PUBLIC)
# ============================================

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Récupérer tous les projets (ou filtrés par statut)"""
    try:
        status = request.args.get('status')
        query = Project.query
        
        if status:
            query = query.filter_by(status=status)
        
        projects = query.order_by(Project.created_at.desc()).all()
        
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
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Récupérer un projet spécifique"""
    try:
        project = Project.query.get_or_404(project_id)
        
        return jsonify({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'project_type': project.project_type,
            'budget': project.budget,
            'deadline': project.deadline.isoformat(),
            'status': project.status,
            'created_at': project.created_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ============================================
# OFFRES (BIDS) - CANDIDAT
# ============================================




@app.route('/api/projects/<int:project_id>/bids', methods=['POST'])
@jwt_required()
def submit_bid(project_id):
    """Soumettre une offre pour un projet"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'candidate':
            return jsonify({'message': 'Unauthorized'}), 403
        
        candidate = Candidate.query.filter_by(user_id=user.id).first()
        if not candidate:
            return jsonify({'message': 'Candidate profile not found'}), 404
        
        # Vérifier que le projet existe et est ouvert
        project = Project.query.get_or_404(project_id)
        if project.status != 'open':
            return jsonify({'message': 'Project is not open for bidding'}), 400
        
        # Vérifier si le candidat a déjà soumis une offre
        existing_bid = Bid.query.filter_by(
            project_id=project_id,
            candidate_id=candidate.id
        ).first()
        
        if existing_bid:
            return jsonify({'message': 'You have already submitted a bid for this project'}), 400
        
        # Créer l'offre
        bid = Bid(
            project_id=project_id,
            candidate_id=candidate.id,
            proposed_amount=request.form.get('proposed_amount'),
            proposed_timeline=request.form.get('proposed_timeline'),
            status='submitted'
        )
        db.session.add(bid)
        db.session.flush()
        
        # Gérer les fichiers uploadés
        if 'technical_proposal' in request.files:
            file = request.files['technical_proposal']
            if file and file.filename:
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                doc = Document(
                    bid_id=bid.id,
                    document_type='technical_proposal',
                    filename=filename,
                    file_path=filepath
                )
                db.session.add(doc)
        
        if 'financial_proposal' in request.files:
            file = request.files['financial_proposal']
            if file and file.filename:
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                doc = Document(
                    bid_id=bid.id,
                    document_type='financial_proposal',
                    filename=filename,
                    file_path=filepath
                )
                db.session.add(doc)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Bid submitted successfully',
            'bid_id': bid.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in submit_bid: {str(e)}")
        return jsonify({'message': str(e)}), 500


# ============================================
# ADMIN - PROJETS
# ============================================

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Créer un nouveau projet (admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        project = Project(
            title=data['title'],
            description=data['description'],
            project_type=data['project_type'],
            budget=data['budget'],
            deadline=datetime.fromisoformat(data['deadline']),
            status='open',
            created_by=user.id
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'message': 'Project created successfully',
            'project_id': project.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Mettre à jour un projet (admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        if 'title' in data:
            project.title = data['title']
        if 'description' in data:
            project.description = data['description']
        if 'project_type' in data:
            project.project_type = data['project_type']
        if 'budget' in data:
            project.budget = data['budget']
        if 'deadline' in data:
            project.deadline = datetime.fromisoformat(data['deadline'])
        if 'status' in data:
            project.status = data['status']
        
        db.session.commit()
        
        return jsonify({'message': 'Project updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Supprimer un projet (admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({'message': 'Project deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


# ============================================
# ADMIN - DASHBOARD
# ============================================

@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Statistiques pour le dashboard admin"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        stats = {
            'total_projects': Project.query.count(),
            'open_projects': Project.query.filter_by(status='open').count(),
            'total_bids': Bid.query.count(),
            'pending_bids': Bid.query.filter_by(status='submitted').count(),
            'accepted_bids': Bid.query.filter_by(status='accepted').count(),
            'rejected_bids': Bid.query.filter_by(status='rejected').count()
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ============================================
# ADMIN - OFFRES
# ============================================

@app.route('/api/admin/bids', methods=['GET'])
@jwt_required()
def get_all_bids():
    """Récupérer toutes les offres (admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        project_id = request.args.get('project_id')
        query = Bid.query
        
        if project_id:
            query = query.filter_by(project_id=project_id)
        
        bids = query.order_by(Bid.created_at.desc()).all()
        
        result = []
        for bid in bids:
            project = Project.query.get(bid.project_id)
            candidate = Candidate.query.get(bid.candidate_id)
            
            result.append({
                'id': bid.id,
                'project_id': bid.project_id,
                'project_title': project.title if project else 'Unknown',
                'company_name': candidate.company_name if candidate else 'Unknown',
                'proposed_amount': bid.proposed_amount,
                'proposed_timeline': bid.proposed_timeline,
                'status': bid.status,
                'notes': bid.notes,
                'created_at': bid.created_at.isoformat()
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/admin/bids/<int:bid_id>/status', methods=['PUT'])
@jwt_required()
def update_bid_status(bid_id):
    """Mettre à jour le statut d'une offre (admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        bid = Bid.query.get_or_404(bid_id)
        data = request.get_json()
        
        bid.status = data['status']
        if 'notes' in data:
            bid.notes = data['notes']
        bid.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Bid status updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


# ============================================
# HEALTH CHECK
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

    # ============================================
# CANDIDAT - MES OFFRES
# ============================================

@app.route('/api/bids/mine', methods=['GET'])
@jwt_required()
def get_my_bids():
    """Récupérer les offres du candidat connecté"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'candidate':
            return jsonify({'message': 'Unauthorized'}), 403
        
        candidate = Candidate.query.filter_by(user_id=user.id).first()
        if not candidate:
            return jsonify([]), 200
        
        bids = Bid.query.filter_by(candidate_id=candidate.id).order_by(Bid.created_at.desc()).all()
        
        result = []
        for bid in bids:
            project = Project.query.get(bid.project_id)
            result.append({
                'id': bid.id,
                'project_id': bid.project_id,
                'project_title': project.title if project else 'Unknown',
                'company_name': candidate.company_name,
                'proposed_amount': float(bid.proposed_amount),
                'proposed_timeline': bid.proposed_timeline,
                'status': bid.status,
                'notes': bid.notes,
                'created_at': bid.created_at.isoformat()
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500