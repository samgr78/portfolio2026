# Portfolio — Samuel Galliani-Royer

Portfolio personnel, pensé pour être mis à jour **sans toucher au code** une fois en place.

## Architecture

Monorepo avec deux parties indépendantes :

```
portfolio-samuel/
├── backend/     → Strapi (CMS headless) : back-office admin + API REST
└── frontend/    → React + Vite : le site public, consomme l'API Strapi
```

- **Strapi** te donne une interface d'admin (`/admin`) générée automatiquement à partir des
  "content-types" définis dans `backend/src/api/`. Ajouter un projet = remplir un formulaire,
  pas écrire une ligne de code.
- **React** affiche les données de Strapi via son API REST (`/api/projects`, `/api/profil`, ...).

## Content-types déjà créés

| Content-type | Type | Rôle |
|---|---|---|
| **Projet** (`project`) | Collection | Un projet du portfolio (titre, description, images, technos, liens...) |
| **Technologie** (`technologie`) | Collection | Un langage/outil avec son logo, réutilisable sur plusieurs projets |
| **Expérience** (`experience`) | Collection | Stage, alternance, formation... pour la timeline du parcours |
| **Profil** (`profil`) | Type unique | Tes infos perso (nom, bio, photo, contact, CV...) — une seule fiche |

Tu peux modifier/ajouter des champs à tout moment depuis **Content-Type Builder** dans l'admin
Strapi, sans mettre les mains dans le code (sauf si tu veux versionner le changement proprement,
voir plus bas).

## Installation

Prérequis : Node.js 20+ (tu es déjà en v22, c'est bon).

### 1. Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

Au premier lancement, Strapi va te demander de créer ton compte admin sur
`http://localhost:1337/admin`. C'est TON compte perso pour gérer le contenu — pas un compte
pour les visiteurs du site.

Les permissions publiques (lecture seule) sur Projet/Technologie/Expérience/Profil sont
déjà configurées automatiquement au démarrage (voir `backend/src/index.ts`), donc l'API est
tout de suite consultable par le frontend sans authentification.

### 2. Frontend (React)

Dans un **second terminal** :

```bash
cd frontend
npm install
npm run dev
```

Le site est visible sur `http://localhost:5173`.

## Ajouter un nouveau projet (le workflow du quotidien)

1. Va sur `http://localhost:1337/admin`
2. **Content Manager → Technologie** : vérifie que les technos utilisées existent déjà (sinon,
   crée-les une fois avec leur logo — tu les réutiliseras pour tous les projets suivants).
3. **Content Manager → Projet → Créer une entrée**
   - Titre, description courte/longue, image de couverture, galerie
   - Sélectionne les technologies utilisées (relation)
   - Liens (site, GitHub), durée, année
   - Coche **Featured** si tu veux qu'il apparaisse en avant sur la page d'accueil
4. Clique sur **Publier** (important : Strapi distingue brouillon / publié — le site ne montre
   que ce qui est publié)
5. Le projet apparaît immédiatement sur `/projets` et `/projets/<slug>` — aucun redéploiement
   du frontend n'est nécessaire, c'est de l'API en temps réel.

Même logique pour une nouvelle **Expérience** ou pour mettre à jour ton **Profil**.

## Déploiement (Hostinger)

⚠️ Point important à anticiper : Strapi est une application Node.js qui doit tourner en
continu (ce n'est pas un simple hébergement mutualisé PHP). Chez Hostinger, ça veut dire :

- **Backend Strapi** → nécessite un plan **VPS** (Node.js + process manager type PM2), avec
  une vraie base de données en prod (PostgreSQL recommandé, SQLite ne convient qu'en dev).
- **Frontend React** → une fois buildé (`npm run build` dans `frontend/`), ça donne des
  fichiers statiques (`frontend/dist/`) qui peuvent être hébergés n'importe où, y compris en
  mutualisé classique ou sur le même VPS.

On affinera cette partie le moment venu — pas bloquant pour développer en local.

## Stack technique

- **Backend** : Strapi 5 (TypeScript), SQLite en dev
- **Frontend** : React 19 + Vite, React Router, Axios
- **Style** : CSS pur (pas de framework CSS, garde ça simple et léger)
