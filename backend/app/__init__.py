# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max
    
    # ============================================
    # CONFIGURATION CORS - CORRECTION ICI
    # ============================================
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",           # Frontend local Vite
                "http://localhost:3000",           # Frontend local React
                "http://54.196.196.2",             # Backend AWS
                "http://54.196.196.2:5173",        # Si frontend sur AWS
                "*"                                 # TEMPORAIRE - À enlever en production
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Register routes
    with app.app_context():
        from . import routes
        db.create_all()
    
    return app