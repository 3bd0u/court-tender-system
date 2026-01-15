def test_register_candidate(client):
    response = client.post('/api/auth/register', json={
        'username': 'newuser',
        'email': 'new@test.com',
        'password': 'pass123',
        'company_name': 'New Company'
    })
    assert response.status_code == 201
    assert b'User registered successfully' in response.data

def test_login_success(client, admin_user):
    """Test successful login with existing admin user"""
    response = client.post('/api/auth/login', json={
        'email': 'admin@test.com',
        'password': 'admin123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert response.json['user']['role'] == 'admin'

def test_login_invalid_credentials(client, admin_user):
    """Test login with wrong password"""
    response = client.post('/api/auth/login', json={
        'email': 'admin@test.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert 'Invalid credentials' in response.json['message']

def test_register_duplicate_email(client, admin_user):
    """Test registering with existing email"""
    response = client.post('/api/auth/register', json={
        'username': 'another_user',
        'email': 'admin@test.com',  # Email already exists
        'password': 'pass123',
        'company_name': 'Another Company'
    })
    assert response.status_code == 400
    assert 'Email already registered' in response.json['message']