# Site Vitrine Portfolio

Site Vitrine est un portfolio personnel construit avec React qui présente mes compétences et mes projets dans différents domaines de l'informatique. L'application est conçue pour être responsive, progressive (PWA) et offre une expérience interactive avec des animations, des modales pour les galeries de projets, et un chatbot intégré.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation et Lancement](#installation-et-lancement)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Structure du Projet](#structure-du-projet)
- [PWA & Installation sur Mobile/Desktop](#pwa--installation-sur-mobiledesktop)
- [Contributing](#contributing)
- [License](#license)

## Fonctionnalités

Ce projet comprend plusieurs fonctionnalités clés :
- **Multi-page** : Il comporte des pages dédiées à l'accueil, aux projets, à l'à-propos, au contact ainsi qu'aux démos interactives (jeux).
- **Responsive Design** : L'interface s'adapte à tous les types d'écrans, que ce soit sur mobile, tablette ou desktop.
- **Animations et Interactions** : Le site propose des transitions douces, des modales pour visualiser les projets en détail et un carousel pour les galeries.
- **Progressive Web App (PWA)** : L'application peut être installée sur mobile et desktop pour une expérience utilisateur enrichie.
- **Tests Unitaires** : La stabilité du code est assurée grâce à Jest et React Testing Library.

## Technologies Utilisées

Les technologies et outils utilisés dans ce projet incluent :
- **React** (avec Create React App)
- **React Router Dom** pour gérer la navigation
- **React Slick** pour les carrousels
- **React Icons** pour l’iconographie
- **Framer Motion** pour des animations avancées
- **Jest** et **React Testing Library** pour réaliser des tests unitaires
- **PWA** avec le service worker intégré à Create React App

## Installation et Lancement

Pour démarrer le projet, suivez ces étapes :

1. **Clonage du dépôt**  
   Ouvrez votre terminal et tapez la commande pour cloner le dépôt :  
   "git clone https://github.com/StevenZenadi/SiteVitrine.git"  
   Ensuite, déplacez-vous dans le répertoire cloné en tapant :  
   "cd SiteVitrine"

2. **Installation des dépendances**  
   Installez toutes les dépendances nécessaires en tapant dans le terminal :  
   "npm install"

3. **Lancement du serveur de développement**  
   Pour lancer l'application en mode développement, tapez :  
   "npm start"  
   L'application sera alors accessible à l'adresse suivante : [http://localhost:3000]

## Tests

Pour vérifier que tout fonctionne correctement, exécutez les tests unitaires en tapant dans votre terminal :  
"npm test"  
Cette commande lancera Jest en mode interactif et affichera les résultats des tests.

## Déploiement

Pour déployer l’application sur GitHub Pages, procédez comme suit :

1. **Construction de l’application**  
   Générez une version optimisée de l’application en tapant :  
   "npm run build"

2. **Déploiement sur GitHub Pages**  
   Pour déployer la version construite, tapez :  
   "npm run deploy"  
   Veillez à ce que le champ "homepage" dans votre fichier package.json soit correctement configuré, par exemple :  
   "homepage": "https://stevenzenadi.github.io/SiteVitrine/"

## Structure du Projet

L'organisation du projet est la suivante :

- **public/**  
  Ce dossier contient le fichier HTML principal (index.html), le manifeste (manifest.json)

- **src/**  
  Ce dossier comprend les composants et les pages du site :  
  - **components/**  
    Contient des fichiers tels que Header.jsx, Footer.jsx, Chatbot.jsx, LogoAnimated.jsx, ProjectGallery.jsx, ProjectModal.jsx, et d'autres composants.
  - **pages/**  
    Contient les pages principales du site : Home.jsx, Projects.jsx, About.jsx, Contact.jsx, Games.jsx.
  - Les autres fichiers comme index.js et serviceWorkerRegistration.js se trouvent également dans ce 
    dossier.
  - **context/**  
    Contient les fichiers de contexte (exemple : ProjectCategoryContext.jsx) pour la gestion des états globaux.
  - **hooks/**  
    Contient les hooks personnalisés (exemple : useParallax.js).
  - **images/**  
    Contient toutes les images utilisées dans le projet.
  - **videos/**  
    Contient les vidéos intégrées dans le site.
  - **ressources/**  
    Contient d'autres ressources utiles (par exemple, des PDF, documents, etc.).

- **Fichiers racine**  
  Le fichier package.json et ce README.md se trouvent à la racine du projet.

## PWA & Installation sur Mobile/Desktop

L'application est configurée pour fonctionner comme une Progressive Web App (PWA) :

- **Sur Android/Chrome** : Les utilisateurs verront une invite pour "Ajouter à l'écran d'accueil" ou pourront installer l'application via le menu du navigateur.
- **Sur iOS/Safari** : L'utilisateur peut ajouter l'application à l'écran d'accueil en utilisant le menu de partage.
- **Sur Desktop** : Certains navigateurs permettent l'installation des PWA pour une expérience quasi-native.

## License

Ce projet est sous licence **MIT**.
