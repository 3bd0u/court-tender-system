import os
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    with app.app_context():
        db.create_all()
        print("✓ Database tables created!")
    
    app.run(host='0.0.0.0', port=port)
    