from app import create_app, db
from app.models import User, Candidate, Project, Bid, Document
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Clear existing data (for testing)
    db.drop_all()
    db.create_all()
    
    print("✓ Database tables created successfully!")
    
    # Create an admin user
    admin = User(username='admin', email='admin@court.dz', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)
    
    # Create a candidate user
    candidate_user = User(username='company1', email='company1@example.com', role='candidate')
    candidate_user.set_password('pass123')
    db.session.add(candidate_user)
    db.session.flush()
    
    # Create candidate profile
    candidate = Candidate(
        user_id=candidate_user.id,
        company_name='ABC Construction',
        phone='0555123456',
        address='Blida, Algeria',
        registration_number='RC123456'
    )
    db.session.add(candidate)
    
    # Create a project
    project = Project(
        title='Air Conditioner Repair - Courtroom 3',
        description='Repair and maintenance of AC unit in main courtroom',
        project_type='repair',
        budget=50000.0,
        deadline=datetime.now() + timedelta(days=30),
        status='open'
    )
    db.session.add(project)
    db.session.flush()
    
    # Create a bid
    bid = Bid(
        project_id=project.id,
        candidate_id=candidate.id,
        proposed_amount=45000.0,
        proposed_timeline='15 days',
        notes='We have experience with similar projects'
    )
    db.session.add(bid)
    
    db.session.commit()
    
    print("✓ Test data created successfully!")
    print(f"  - Admin: {admin.email}")
    print(f"  - Candidate: {candidate_user.email} ({candidate.company_name})")
    print(f"  - Project: {project.title}")
    print(f"  - Bid: ${bid.proposed_amount} by {candidate.company_name}")
    
    # Verify relationships work
    print("\n✓ Testing relationships:")
    print(f"  - Project has {len(project.bids)} bid(s)")
    print(f"  - Candidate has {len(candidate.bids)} bid(s)")
    print(f"  - User {candidate_user.username} is linked to {candidate_user.candidate.company_name}")