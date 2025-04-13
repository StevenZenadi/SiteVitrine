# Projet Site Vitrine

Bienvenue dans ce projet « Site Vitrine », qui se compose d’un **backend** Django (Python) et d’un **frontend** React. L’objectif est de proposer une application de présentation (vitrine), avec un système de commentaires, un formulaire de contact (envoi d’e-mails), et une base de données PostgreSQL (hébergée sur Render).

--------------------------------------------------------------------------------
## Table des matières

1. Aperçu de l’architecture
2. Backend (Django)
3. Frontend (React)
4. Base de données (PostgreSQL)
5. Installation et lancement en local
6. Déploiement
7. Contribution
8. Licence

--------------------------------------------------------------------------------
## 1. Aperçu de l’architecture

Le projet est structuré en deux dossiers principaux :

1. **backend/**  
   - Gère la logique côté serveur avec Django.
   - Contient plusieurs applications Django (apps) :
     - comments/ : Gestion des commentaires (CRUD, stockage en base).
     - contact/ : Gestion du formulaire de contact et de l’envoi d’e-mails.
     - myproject/ : Fichiers de configuration Django (settings, urls, wsgi…).

2. **monSiteVitrine/**  
   - Le frontend React.
   - On y trouve un dossier src/ qui contient :
     - components/ : Composants réutilisables (Header, Footer, CommentsSection, etc.).
     - pages/ : Pages principales du site (Home, About, Contact, Projects…).
     - contexts/ et hooks/ : Logique de gestion d’état, custom hooks, etc.
     - ressources/, images/ : Ressources statiques (images, PDFs, vidéos…).

La communication entre le frontend et le backend se fait via des endpoints Django REST (exposés par comments et contact), et la base de données PostgreSQL est hébergée sur Render.

--------------------------------------------------------------------------------
## 2. Backend (Django)

### Structure

- **comments/**  
  - models.py : Modèle Comment (nom, email, message, date de création).
  - serializers.py : Sérialisation des données pour l’API REST.
  - views.py : Vue API pour gérer les requêtes POST/GET sur les commentaires.

- **contact/**  
  - views.py : Vue API pour recevoir les données du formulaire de contact et envoyer un e-mail via SMTP.
  - serializers.py : Validation des données du formulaire (nom, email, message…).

- **myproject/**  
  - settings.py : Configuration Django (DATABASE_URL, ALLOWED_HOSTS, EMAIL_HOST, etc.).
  - urls.py : Définition des routes d’API (/api/comments/, /api/contact/, …).
  - wsgi.py et asgi.py : Points d’entrée pour le déploiement du serveur Django.

- **Fichiers divers**  
  - requirements.txt : Liste des dépendances Python.
  - manage.py : Commande pour exécuter les tâches Django (migrations, runserver, etc.).
  - db.sqlite3 : Base de données SQLite utilisée localement (optionnel si on préfère PostgreSQL en local).

--------------------------------------------------------------------------------
## 3. Frontend (React)

### Structure

- **monSiteVitrine/src/**  
  - components/ : Tous les composants réutilisables (ex. CommentsSection.jsx, Contact.jsx, Header.jsx…).
  - pages/ : Pages principales (ex. Home.jsx, About.jsx, Contact.jsx, Projects.jsx).
  - contexts/ & hooks/ : Gestion d’état global ou custom hooks.
  - ressources/, images/ : Fichiers statiques (PDF, images, 3D…).
  - .env : Variables d’environnement du frontend (par ex. REACT_APP_COMMENTS_ENDPOINT).

- **Fichiers principaux**  
  - package.json : Dépendances JavaScript, scripts de build et de dev.
  - index.js : Point d’entrée de l’application React.
  - App.js : Composant racine.

--------------------------------------------------------------------------------
## 4. Base de données (PostgreSQL)

- Le projet utilise une base de données PostgreSQL hébergée sur Render.
- En local, tu peux soit utiliser la même base (via l’URL fournie par Render) soit utiliser SQLite par défaut.
- Dans settings.py, on utilise dj_database_url.config() pour lire la variable DATABASE_URL.

--------------------------------------------------------------------------------
## 5. Installation et lancement en local

### Prérequis
- Python 3.9+ (ou version plus récente)
- Node.js (version 14+ ou plus récente)
- (Optionnel) PostgreSQL localement, sinon SQLite suffit pour tester

### 1. Cloner le repo
git clone https://github.com/votre-nom/SiteVitrine.git
cd SiteVitrine

### 2. Configurer le backend
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
pip install -r requirements.txt

- Créer un fichier .env (ou configurer vos variables d’environnement) avec :
SECRET_KEY=une_clé_secrète
DATABASE_URL=postgres://...
EMAIL_HOST=smtp.exemple.com
EMAIL_HOST_USER=...
EMAIL_HOST_PASSWORD=...
EMAIL_PORT=587
EMAIL_USE_TLS=True

- Appliquer les migrations et lancer le serveur :
python manage.py migrate
python manage.py runserver

- Le backend écoute par défaut sur http://127.0.0.1:8000

### 3. Configurer le frontend
cd ../monSiteVitrine
npm install

- Créer un fichier .env si besoin :
REACT_APP_COMMENTS_ENDPOINT=http://127.0.0.1:8000/api/comments/
REACT_APP_CONTACT_ENDPOINT=http://127.0.0.1:8000/api/contact/

- Lancer le serveur de développement :
npm start

- Le frontend écoute sur http://localhost:3000

--------------------------------------------------------------------------------
## 6. Déploiement

- **Backend (Django)** : Hébergé sur Render, Railway, ou autre.
  - Ajouter les variables d’environnement (DATABASE_URL, SECRET_KEY, etc.) dans l’interface de l’hébergeur.
  - Configurer la commande de build et la commande pour lancer les migrations (python manage.py migrate).

- **Base PostgreSQL** : Sur Render (ou un autre service).
  - Récupérer l’URL et la mettre dans DATABASE_URL.

- **Frontend (React)** : Peut être déployé sur Vercel, Netlify, ou autre.
  - Définir les variables d’environnement REACT_APP_COMMENTS_ENDPOINT et REACT_APP_CONTACT_ENDPOINT pointant vers l’URL publique du backend.

--------------------------------------------------------------------------------

## 7. Licence

Ce projet est sous licence MIT (ou toute autre licence de votre choix). Libre à toi de l’adapter selon tes besoins.

--------------------------------------------------------------------------------

