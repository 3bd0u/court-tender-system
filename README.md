# 🏛️ Court Tender Management System

![CI/CD Pipeline](https://github.com/3bd0u/court-tender-system/workflows/CI/CD%20Pipeline/badge.svg)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

Système de gestion des appels d'offres pour projets d'ingénierie judiciaire. Permet aux administrateurs de publier des projets (réparations, constructions, maintenance) et aux entreprises de soumettre leurs offres avec les documents requis.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Tests](#-tests)
- [CI/CD](#-cicd)
- [Contribution](#-contribution)

## ✨ Fonctionnalités

### Pour les Administrateurs (Ingénieurs)
- ✅ Publier de nouveaux projets (climatisation, électricité, construction, etc.)
- ✅ Définir les exigences et documents nécessaires
- ✅ Consulter toutes les offres soumises
- ✅ Vérifier les documents des candidats
- ✅ Approuver ou rejeter les offres
- ✅ Suivre l'état des projets (ouvert, en cours, terminé)
- ✅ Tableau de bord avec statistiques

### Pour les Candidats (Entreprises)
- ✅ S'inscrire avec les informations de l'entreprise
- ✅ Parcourir les projets disponibles
- ✅ Soumettre des offres avec montant et délai proposés
- ✅ Uploader les documents requis (registre de commerce, certificats, assurances)
- ✅ Suivre l'état de leurs offres
- ✅ Recevoir des notifications sur les décisions

## 🛠️ Technologies

### Backend
- **Flask 3.0** - Framework web Python
- **SQLAlchemy** - ORM pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **Flask-CORS** - Support des requêtes cross-origin

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-conteneurs
- **GitHub Actions** - CI/CD automatisé
- **Pytest** - Tests automatisés
- **Flake8** - Linting et qualité du code
- **Trivy** - Scan de sécurité

### Outils
- **Postman** - Test des APIs
- **Git** - Contrôle de version

## 🏗️ Architecture

```
court-tender-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # Application factory
│   │   ├── models.py         # Models SQLAlchemy
│   │   └── routes.py         # API endpoints
│   ├── tests/
│   │   ├── conftest.py       # Fixtures pytest
│   │   ├── test_auth.py      # Tests authentification
│   │   ├── test_projects.py  # Tests projets
│   │   └── test_bids.py      # Tests offres
│   ├── uploads/              # Documents uploadés
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── run.py
│   └── init_db.py
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # Pipeline CI/CD
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 📦 Installation

### Prérequis
- Docker & Docker Compose
- Git
- (Optionnel) Python 3.11+ pour développement local

### Option 1 : Avec Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/3bd0u/court-tender-system.git
cd court-tender-system

# Lancer avec Docker Compose
docker-compose up --build

# Initialiser la base de données avec des données de test
docker-compose exec backend python init_db.py
```

L'application sera disponible sur `http://localhost:5000`

### Option 2 : Installation locale

```bash
# Cloner le repository
git clone https://github.com/3bd0u/court-tender-system.git
cd court-tender-system/backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Initialiser la base de données
python init_db.py

# Lancer l'application
python run.py
```

## 🚀 Utilisation

### Accès par défaut
- **Admin:** `admin@court.dz` / `admin123`
- **Test Candidate:** `test@company.dz` / `test123`

### Commandes Docker utiles

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter les services
docker-compose down

# Rebuild après modifications
docker-compose up --build

# Accéder au shell du container
docker-compose exec backend bash

# Réinitialiser la base de données
docker-compose exec backend python init_db.py
```

## 📚 API Documentation

### Authentication

#### Register (Candidate)
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "company_name",
  "email": "contact@company.dz",
  "password": "secure_password",
  "company_name": "ABC Construction SARL",
  "phone": "0555123456",
  "registration_number": "RC123456789"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@court.dz",
  "password": "admin123"
}

Response: { "access_token": "...", "user": {...} }
```

### Projects

#### Get all projects
```http
GET /api/projects?status=open
```

#### Create project (Admin only)
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Réparation Climatisation Salle 3",
  "description": "Réparation et maintenance du système de climatisation",
  "project_type": "repair",
  "budget": 50000,
  "deadline": "2025-02-15T00:00:00"
}
```

### Bids

#### Submit bid
```http
POST /api/projects/{project_id}/bids
Authorization: Bearer {token}
Content-Type: application/json

{
  "proposed_amount": 45000,
  "proposed_timeline": "15 jours",
  "notes": "Expérience de 10 ans dans ce domaine"
}
```

#### Upload document
```http
POST /api/bids/{bid_id}/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

document_type: commerce_register
file: [fichier PDF]
```

### Admin

#### Get all bids
```http
GET /api/admin/bids?project_id=1
Authorization: Bearer {admin_token}
```

#### Update bid status
```http
PUT /api/admin/bids/{bid_id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "accepted",
  "notes": "Offre retenue"
}
```

#### Dashboard stats
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

## 🧪 Tests

### Exécuter tous les tests
```bash
# Avec Docker
docker-compose run --rm backend pytest -v

# Localement
cd backend
pytest -v
```

### Tests avec couverture
```bash
docker-compose run --rm backend pytest --cov=app --cov-report=term-missing
```

### Tests spécifiques
```bash
# Tests d'authentification uniquement
pytest tests/test_auth.py -v

# Tests de projets uniquement
pytest tests/test_projects.py -v
```

## 🔄 CI/CD

Le projet utilise **GitHub Actions** pour l'intégration et le déploiement continus.

### Pipeline automatique
À chaque push ou pull request sur `main` :

1. **Tests** - Exécution de tous les tests pytest
2. **Linting** - Vérification de la qualité du code avec flake8
3. **Build** - Construction de l'image Docker
4. **Security** - Scan des vulnérabilités avec Trivy

### Voir le statut du pipeline
```bash
# Badge dans le README ou visitez :
https://github.com/3bd0u/court-tender-system/actions
```

## 🗃️ Base de données

### Schéma principal

- **users** - Utilisateurs (admin, candidats)
- **candidates** - Profils des entreprises
- **projects** - Projets publiés
- **bids** - Offres soumises
- **documents** - Documents uploadés

### Migrations
```bash
# Créer une nouvelle migration (si vous utilisez Flask-Migrate)
docker-compose exec backend flask db migrate -m "Description"

# Appliquer les migrations
docker-compose exec backend flask db upgrade
```

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (Werkzeug)
- ✅ Validation des fichiers uploadés
- ✅ Protection CORS configurée
- ✅ Variables d'environnement pour les secrets
- ✅ Scan de sécurité automatisé (Trivy)

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

### Standards de code
- Suivre PEP 8 pour Python
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les fonctions complexes
- Mettre à jour le README si nécessaire

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **abderrahmane bellatreche** - *Développeur DevOps* - [GitHub](https://github.com/3bd0u)

## 🙏 Remerciements

- Flask documentation
- Docker documentation
- Communauté DevOps

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [Issue](https://github.com/3bd0u/court-tender-system/issues)
- Email : a.bellatreche@esi-sba.dz

---

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile sur GitHub !
