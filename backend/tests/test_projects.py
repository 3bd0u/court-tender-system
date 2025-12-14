from datetime import datetime, timedelta

def test_get_projects(client):
    response = client.get('/api/projects')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_project_as_admin(client, admin_token):
    response = client.post('/api/projects', 
        headers={'Authorization': f'Bearer {admin_token}'},
        json={
            'title': 'Test Project',
            'description': 'Test description',
            'project_type': 'repair',
            'budget': 50000,
            'deadline': (datetime.now() + timedelta(days=30)).isoformat()
        }
    )
    assert response.status_code == 201
    assert 'id' in response.json

def test_create_project_as_candidate_fails(client, candidate_token):
    response = client.post('/api/projects',
        headers={'Authorization': f'Bearer {candidate_token}'},
        json={
            'title': 'Test Project',
            'description': 'Test description',
            'project_type': 'repair',
            'budget': 50000,
            'deadline': (datetime.now() + timedelta(days=30)).isoformat()
        }
    )
    assert response.status_code == 403