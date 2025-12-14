from app import create_app, db
from app.models import User, Candidate, Project
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Drop all tables and recreate
    print("Dropping all tables...")
    db.drop_all()
    
    print("Creating all tables...")
    db.create_all()
    
    # Create admin user
    admin = User(username='admin', email='admin@court.dz', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)
    
    # Create a test candidate
    candidate_user = User(username='test_company', email='test@company.dz', role='candidate')
    candidate_user.set_password('test123')
    db.session.add(candidate_user)
    db.session.flush()
    
    candidate = Candidate(
        user_id=candidate_user.id,
        company_name='Test Company SARL',
        phone='0555123456',
        address='Blida, Algeria',
        registration_number='RC123456'
    )
    db.session.add(candidate)
    
    # Create a test project
    project = Project(
        title='Test Project - AC Repair',
        description='Test project for demonstration',
        project_type='repair',
        budget=50000.0,
        deadline=datetime.now() + timedelta(days=30),
        status='open'
    )
    db.session.add(project)
    
    db.session.commit()
    
    print("✓ Database initialized with test data!")
    print("  Admin: admin@court.dz / admin123")
    print("  Candidate: test@company.dz / test123")