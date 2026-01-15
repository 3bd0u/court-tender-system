# 🏛️ Application de Gestion des Marchés Publics

![CI/CD Pipeline](https://github.com/3bd0u/gestion-marches-publics/workflows/CI/CD%20Pipeline/badge.svg)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

Système moderne de gestion des marchés publics pour l'ingénierie judiciaire en Algérie. Interface élégante avec design glassmorphism, animations fluides et support bilingue (العربية / Français).

## 📖 À Propos

Application web complète permettant aux administrations publiques de gérer leurs appels d'offres et aux entreprises de soumettre leurs candidatures de manière digitalisée, transparente et efficace.

## ✨ Nouveautés Design (v2.0)

### 🎨 Interface Moderne
- **Glassmorphism** - Cartes semi-transparentes avec effet de verre
- **Animations Blob** - Formes organiques animées en arrière-plan
- **Gradients Dynamiques** - Dégradés animés sur les bannières
- **Micro-interactions** - Effets hover sophistiqués
- **Design System** - Palette de couleurs cohérente et professionnelle

### 🌍 Support Bilingue Complet
- **Arabe (العربية)** - Interface complète en arabe avec support RTL
- **Français** - Interface française moderne
- **Switch instantané** - Changement de langue sans rechargement

### 📱 Responsive & Accessible
- Design adaptatif mobile/tablette/desktop
- Navigation tactile optimisée
- Accessibilité WCAG 2.1

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Design System](#-design-system)
- [API Documentation](#-api-documentation)
- [Tests](#-tests)
- [CI/CD](#-cicd)
- [Contribution](#-contribution)

## ✨ Fonctionnalités

### 🏛️ Pour les Administrations Publiques
- ✅ **Publication de Marchés** - Créer et publier des appels d'offres
- ✅ **Gestion Complète** - Projets de réparation, construction, maintenance
- ✅ **Dashboard Analytics** - Statistiques en temps réel avec cartes animées
- ✅ **Examen des Offres** - Interface de révision avec tri et filtres
- ✅ **Validation Documents** - Vérification des pièces justificatives
- ✅ **Décisions Transparentes** - Acceptation/rejet avec justification
- ✅ **Rapports Visuels** - Graphiques et visualisations des données
- ✅ **Historique Complet** - Traçabilité de toutes les actions

### 🏢 Pour les Entreprises Candidates
- ✅ **Inscription Digitale** - Création de compte entreprise simplifiée
- ✅ **Profil Entreprise** - Gestion des informations et documents
- ✅ **Parcours des Marchés** - Navigation fluide des opportunités disponibles
- ✅ **Soumission d'Offres** - Interface guidée avec upload de documents
- ✅ **Offre Technique** - Upload du dossier technique (PDF)
- ✅ **Offre Financière** - Upload du dossier financier (PDF)
- ✅ **Suivi en Direct** - État des candidatures en temps réel
- ✅ **Notifications** - Alertes sur les décisions
- ✅ **Historique** - Tableau de bord des offres soumises

### 🔐 Sécurité & Conformité
- ✅ Authentification sécurisée (JWT)
- ✅ Rôles et permissions (Admin/Candidat)
- ✅ Validation des documents uploadés
- ✅ Traçabilité des actions
- ✅ Conformité avec la réglementation algérienne

## 🛠️ Technologies

### Frontend
- **React 19.2** - Framework JavaScript moderne
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS 3** - Framework CSS utility-first
- **Lucide React** - Icônes modernes et cohérentes
- **Recharts** - Graphiques interactifs
- **React Router** - Navigation SPA
- **Axios** - Client HTTP

### Backend
- **Flask 3.0** - Framework web Python
- **SQLAlchemy** - ORM pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **Flask-CORS** - Support des requêtes cross-origin
- **Werkzeug** - Sécurité et hashing

### DevOps & Infrastructure
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-conteneurs
- **GitHub Actions** - CI/CD automatisé
- **Pytest** - Tests automatisés
- **Flake8** - Linting et qualité du code
- **Trivy** - Scan de sécurité

## 🏗️ Architecture

```
gestion-marches-publics/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundShapes.jsx   # Formes animées
│   │   │   ├── Modal.jsx              # Modal réutilisable
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx     # Dashboard administration
│   │   │   ├── CandidateDashboard.jsx # Dashboard entreprise
│   │   │   ├── Login.jsx              # Page de connexion
│   │   │   ├── Register.jsx           # Page d'inscription
│   │   │   └── Projects.jsx           # Gestion marchés
│   │   ├── services/
│   │   │   ├── api.js                 # Configuration Axios
│   │   │   ├── auth.js                # Service authentification
│   │   │   └── projects.js            # Service marchés/offres
│   │   ├── hooks/
│   │   │   └── useTranslation.js      # Hook traduction AR/FR
│   │   ├── config/
│   │   │   └── app.js                 # Configuration application
│   │   ├── index.css                  # Styles globaux + animations
│   │   └── main.jsx                   # Point d'entrée
│   ├── public/
│   │   └── logo.svg                   # Logo application
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # API Flask
│   ├── app/
│   │   ├── __init__.py         # Application factory
│   │   ├── models.py           # Models SQLAlchemy
│   │   └── routes.py           # API endpoints
│   ├── tests/
│   │   ├── conftest.py         # Fixtures pytest
│   │   ├── test_auth.py        # Tests authentification
│   │   ├── test_projects.py    # Tests marchés
│   │   └── test_bids.py        # Tests offres
│   ├── uploads/                # Documents uploadés
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── run.py
│   └── init_db.py
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # Pipeline CI/CD
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 📦 Installation

### Prérequis
- Docker & Docker Compose (recommandé)
- Node.js 18+ & npm (pour développement frontend)
- Python 3.11+ (pour développement backend)
- Git

### Option 1 : Avec Docker Compose (Stack Complet)

```bash
# Cloner le repository
git clone https://github.com/3bd0u/gestion-marches-publics.git
cd gestion-marches-publics

# Lancer le stack complet (Backend + Frontend + PostgreSQL)
docker-compose up --build

# Initialiser la base de données avec des données de test
docker-compose exec backend python init_db.py
```

**Accès :**
- Frontend : `http://localhost:5173`
- Backend API : `http://localhost:5000`

### Option 2 : Installation locale (Développement)

#### Backend
```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

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

#### Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production (optionnel)
npm run build
```

## 🎨 Design System

### Palette de Couleurs
```css
/* Primary Colors - Bleu institutionnel */
--primary-500: #3b82f6  /* Bleu principal */
--primary-600: #2563eb  /* Bleu hover */
--primary-700: #1d4ed8  /* Bleu actif */

/* Gradients */
gradient-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
text-gradient: linear-gradient(to right, #2563eb, #9333ea)
```

### Animations CSS

#### Animations Disponibles
```css
.float              /* Animation flottante (logos, icônes) */
.animate-blob       /* Animation organique (formes arrière-plan) */
.animate-gradient   /* Gradient animé (bannières) */
.animate-scale-in   /* Apparition avec zoom */
.animate-slide-up   /* Glissement depuis le bas */
```

#### Classes Utilitaires
```css
.card               /* Carte avec glassmorphism */
.card-gradient      /* Carte avec gradient */
.stats-card         /* Carte de statistiques avec hover */
.glass              /* Effet verre dépoli */
.gradient-bg        /* Fond avec gradient animé */
.text-gradient      /* Texte avec gradient */
.btn-primary        /* Bouton principal avec gradient */
.btn-secondary      /* Bouton secondaire */
.input-field        /* Champ de formulaire stylisé */
.icon-container     /* Container pour icônes colorées */
```

### Composants Réutilisables

#### BackgroundShapes
```jsx
import BackgroundShapes from '../components/BackgroundShapes';

// Ajoute des formes animées en arrière-plan
<BackgroundShapes />
```

#### Modal
```jsx
import Modal from '../components/Modal';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Titre du Modal"
  size="lg"
>
  {/* Contenu */}
</Modal>
```

## 🚀 Utilisation

### Comptes par Défaut
```
👤 Administration:
   Email: admin@court.dz
   Password: admin123

👤 Entreprise Test:
   Email: test@company.dz
   Password: test123
```

### Workflow Typique

#### Pour une Administration Publique
1. **Connexion** avec compte administrateur
2. **Créer un marché public** via "Gérer les Marchés"
3. **Définir les exigences** (budget, délai, type de projet)
4. **Publier l'appel d'offres**
5. **Examiner les offres** reçues des entreprises
6. **Valider les documents** (registre commerce, assurances)
7. **Approuver/Rejeter** les offres avec justification
8. **Attribuer le marché** à l'entreprise sélectionnée
9. **Suivre les statistiques** sur le dashboard

#### Pour une Entreprise Candidate
1. **Inscription** avec informations entreprise (SARL, EURL, etc.)
2. **Compléter le profil** (registre commerce, certifications)
3. **Connexion** avec identifiants
4. **Parcourir** les marchés publics disponibles
5. **Consulter** les détails du cahier des charges
6. **Préparer l'offre** (technique + financière)
7. **Soumettre l'offre** avec montant et délai proposés
8. **Upload des documents** requis (PDF)
9. **Suivre l'état** de la candidature en temps réel
10. **Recevoir notification** de la décision

### Commandes Utiles

#### Docker
```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Rebuild après modifications
docker-compose up --build

# Shell dans le container backend
docker-compose exec backend bash

# Shell dans le container frontend
docker-compose exec frontend sh

# Réinitialiser la BDD
docker-compose exec backend python init_db.py
```

#### Frontend
```bash
# Développement avec hot-reload
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
```

## 📚 API Documentation

### Authentication

#### Register (Entreprise)
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "abc_construction",
  "email": "contact@abc-construction.dz",
  "password": "MotDePasseSecurise123!",
  "company_name": "ABC Construction SARL",
  "phone": "0555123456",
  "address": "Zone Industrielle, Blida, Algérie",
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

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@court.dz",
    "role": "admin"
  }
}
```

### Marchés Publics

#### Liste des marchés
```http
GET /api/projects?status=open&project_type=construction
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "title": "Construction d'un tribunal",
    "description": "Construction d'un nouveau tribunal de première instance",
    "project_type": "construction",
    "budget": 50000000,
    "deadline": "2025-12-31T00:00:00",
    "status": "open",
    "created_at": "2025-01-10T10:00:00"
  }
]
```

#### Créer un marché (Admin uniquement)
```http
POST /api/projects
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Réparation Climatisation Tribunal",
  "description": "Maintenance complète du système de climatisation",
  "project_type": "repair",
  "budget": 500000,
  "deadline": "2025-06-30"
}
```

#### Modifier un marché (Admin uniquement)
```http
PUT /api/projects/{project_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Titre modifié",
  "status": "closed"
}
```

#### Supprimer un marché (Admin uniquement)
```http
DELETE /api/projects/{project_id}
Authorization: Bearer {admin_token}
```

### Offres

#### Soumettre une offre
```http
POST /api/projects/{project_id}/bids
Authorization: Bearer {token}
Content-Type: multipart/form-data

proposed_amount: 450000
proposed_timeline: "90 jours"
technical_proposal: [Offre_Technique.pdf]
financial_proposal: [Offre_Financiere.pdf]
```

#### Mes offres
```http
GET /api/bids/mine
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "project_id": 1,
    "project_title": "Construction d'un tribunal",
    "company_name": "ABC Construction SARL",
    "proposed_amount": 45000000,
    "proposed_timeline": "18 mois",
    "status": "submitted",
    "created_at": "2025-01-10T14:30:00"
  }
]
```

### Administration

#### Statistiques dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}

Response:
{
  "total_projects": 25,
  "open_projects": 8,
  "total_bids": 156,
  "pending_bids": 34,
  "accepted_bids": 18,
  "rejected_bids": 12
}
```

#### Liste toutes les offres
```http
GET /api/admin/bids?project_id=1&status=submitted
Authorization: Bearer {admin_token}
```

#### Modifier le statut d'une offre
```http
PUT /api/admin/bids/{bid_id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "accepted",
  "notes": "Offre retenue - Meilleur rapport qualité/prix"
}
```

## 🧪 Tests

### Backend Tests

```bash
# Tous les tests
docker-compose run --rm backend pytest -v

# Tests avec couverture
docker-compose run --rm backend pytest --cov=app --cov-report=html

# Tests spécifiques
pytest tests/test_auth.py -v
pytest tests/test_projects.py -v
pytest tests/test_bids.py -v
```

### Couverture de Code

```bash
# Générer rapport HTML
pytest --cov=app --cov-report=html
# Ouvrir htmlcov/index.html dans le navigateur
```

## 🔄 CI/CD

Pipeline GitHub Actions automatisé sur chaque push/PR vers `main` :

### Étapes du Pipeline

1. **🧪 Tests Backend**
   - Exécution des tests pytest
   - Vérification de la couverture (>80%)

2. **🎨 Linting**
   - Flake8 pour Python (PEP 8)
   - Vérification qualité du code

3. **🏗️ Build**
   - Construction image Docker backend
   - Build production frontend

4. **🔒 Security Scan**
   - Trivy scan des vulnérabilités
   - Audit des dépendances

5. **📊 Rapports**
   - Couverture de code
   - Métriques de qualité

### Voir le statut
[![CI/CD Pipeline](https://github.com/3bd0u/gestion-marches-publics/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/3bd0u/gestion-marches-publics/actions)

## 🗃️ Base de données

### Schéma

```sql
users (Utilisateurs)
  - id (PK)
  - username
  - email (unique)
  - password_hash
  - role (admin/candidate)
  - created_at

candidates (Entreprises)
  - id (PK)
  - user_id (FK → users)
  - company_name
  - phone
  - address
  - registration_number (Registre de commerce)
  - created_at

projects (Marchés publics)
  - id (PK)
  - title
  - description
  - project_type (repair/construction/maintenance)
  - budget (Montant en DZD)
  - deadline
  - status (open/closed/under_review/awarded)
  - created_by (FK → users)
  - created_at

bids (Offres)
  - id (PK)
  - project_id (FK → projects)
  - candidate_id (FK → candidates)
  - proposed_amount (Montant proposé)
  - proposed_timeline (Délai proposé)
  - status (submitted/under_review/accepted/rejected)
  - notes (Justification admin)
  - created_at
  - updated_at

documents (Documents)
  - id (PK)
  - bid_id (FK → bids)
  - document_type (technical_proposal/financial_proposal)
  - filename
  - file_path
  - uploaded_at
```

## 🔐 Sécurité

### Mesures Implémentées
- ✅ **JWT Authentication** - Tokens sécurisés avec expiration
- ✅ **Password Hashing** - Werkzeug PBKDF2 SHA256
- ✅ **File Validation** - Type (PDF uniquement) et taille de fichiers
- ✅ **CORS Configuration** - Origins autorisés uniquement
- ✅ **Environment Variables** - Secrets jamais committés
- ✅ **SQL Injection Protection** - SQLAlchemy ORM
- ✅ **XSS Protection** - Sanitization des inputs
- ✅ **Security Scanning** - Trivy automatisé dans CI/CD
- ✅ **Role-Based Access** - Admin vs Candidat
- ✅ **Audit Trail** - Logs de toutes les actions

### Conformité Réglementaire
- Respect du code des marchés publics algérien
- Transparence dans l'attribution des marchés
- Traçabilité complète des décisions
- Égalité de traitement des candidats

## 🤝 Contribution

Les contributions sont bienvenues ! 🎉

### Process

1. **Fork** le projet
2. **Créer** une branche feature
   ```bash
   git checkout -b feature/ma-nouvelle-feature
   ```
3. **Commit** vos changements
   ```bash
   git commit -m "✨ Ajout: nouvelle fonctionnalité"
   ```
4. **Push** vers la branche
   ```bash
   git push origin feature/ma-nouvelle-feature
   ```
5. **Ouvrir** une Pull Request

### Standards de Commits

Utiliser les préfixes conventionnels :
- `✨ Ajout:` - Nouvelle fonctionnalité
- `🐛 Fix:` - Correction de bug
- `🎨 Style:` - Changements visuels/CSS
- `♻️ Refactor:` - Refactoring de code
- `📝 Docs:` - Documentation
- `🧪 Test:` - Ajout de tests
- `⚡ Perf:` - Amélioration de performance
- `🔒 Security:` - Correctif de sécurité

### Standards de Code

#### Backend (Python)
- Suivre **PEP 8**
- Docstrings pour les fonctions
- Type hints quand approprié
- Tests pour nouvelles fonctionnalités

#### Frontend (JavaScript/React)
- ESLint + Prettier
- Composants fonctionnels avec hooks
- PropTypes ou TypeScript
- CSS classes utilitaires (Tailwind)

## 📝 License

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

**Abderrahmane Bellatreche**
- Rôle: Développeur Full-Stack & DevOps Engineer
- GitHub: [@3bd0u](https://github.com/3bd0u)
- Email: a.bellatreche@esi-sba.dz
- Institution: ESI-SBA (École Supérieure en Informatique)

## 🙏 Remerciements

- **Ministère de la Justice Algérien** - Pour le contexte et les besoins
- **Flask Community** - Framework backend élégant
- **React Community** - Librairie UI moderne et performante
- **Tailwind CSS** - Framework CSS révolutionnaire
- **Docker** - Conteneurisation simplifiée
- **GitHub** - Hébergement et CI/CD gratuit
- **Open Source Community** - Pour l'inspiration et les outils

## 📞 Support

### Besoin d'aide ?

- 📫 **Email:** a.bellatreche@esi-sba.dz
- 🐛 **Issues:** [GitHub Issues](https://github.com/3bd0u/gestion-marches-publics/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/3bd0u/gestion-marches-publics/discussions)

### Rapport de Bug

Ouvrir une issue avec :
- ✅ Description détaillée du problème
- ✅ Étapes pour reproduire le bug
- ✅ Comportement attendu vs comportement actuel
- ✅ Screenshots ou vidéo si applicable
- ✅ Environnement (OS, navigateur, versions)
- ✅ Logs d'erreur (console navigateur et backend)

### Demande de Fonctionnalité

Ouvrir une discussion avec :
- 💡 Description de la fonctionnalité souhaitée
- 🎯 Cas d'usage et bénéfices
- 🔧 Suggestions d'implémentation
- 📊 Impact estimé

---

<div align="center">

### ⭐ Si ce projet vous aide, donnez-lui une étoile sur GitHub ! ⭐

**Développé avec ❤️ en Algérie 🇩🇿**

*Pour la modernisation de l'administration publique algérienne*

</div>