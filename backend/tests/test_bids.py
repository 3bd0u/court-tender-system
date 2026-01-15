from datetime import datetime, timedelta
from app import db
from app.models import Project

def test_submit_bid(client, candidate_token, app):
    with app.app_context():
        # Create a test project
        project = Project(
            title='Test Project',
            description='Test',
            project_type='repair',
            budget=50000,
            deadline=datetime.now() + timedelta(days=30)
        )
        db.session.add(project)
        db.session.commit()
        project_id = project.id
    
    response = client.post(f'/api/projects/{project_id}/bids',
        headers={'Authorization': f'Bearer {candidate_token}'},
        json={
            'proposed_amount': 45000,
            'proposed_timeline': '15 days',
            'notes': 'Test bid'
        }
    )
    assert response.status_code == 201
    assert 'bid_id' in response.json

def test_get_my_bids(client, candidate_token):
    response = client.get('/api/bids',
        headers={'Authorization': f'Bearer {candidate_token}'}
    )
    assert response.status_code == 200
    assert isinstance(response.json, list)