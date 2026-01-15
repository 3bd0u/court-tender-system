import sys
import os

# Ajouter le dossier parent au PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app import create_app, db
from app.models import User, Candidate, Project

@pytest.fixture(scope='function')
def app():
    """Create application for testing"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['WTF_CSRF_ENABLED'] = False
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    """Test client"""
    return app.test_client()

@pytest.fixture(scope='function')
def admin_user(app):
    """Create admin user"""
    with app.app_context():
        admin = User(username='admin_test', email='admin@test.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        return admin

@pytest.fixture(scope='function')
def candidate_user(app):
    """Create candidate user with profile"""
    with app.app_context():
        candidate_user = User(username='candidate_test', email='candidate@test.com', role='candidate')
        candidate_user.set_password('pass123')
        db.session.add(candidate_user)
        db.session.flush()
        
        candidate = Candidate(
            user_id=candidate_user.id,
            company_name='Test Company',
            phone='0555123456',
            registration_number='RC123'
        )
        db.session.add(candidate)
        db.session.commit()
        return candidate_user

@pytest.fixture(scope='function')
def admin_token(client, admin_user):
    """Get admin authentication token"""
    response = client.post('/api/auth/login', json={
        'email': 'admin@test.com',
        'password': 'admin123'
    })
    return response.json['access_token']

@pytest.fixture(scope='function')
def candidate_token(client, candidate_user):
    """Get candidate authentication token"""
    response = client.post('/api/auth/login', json={
        'email': 'candidate@test.com',
        'password': 'pass123'
    })
    return response.json['access_token']