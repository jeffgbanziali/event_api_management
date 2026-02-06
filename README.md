# My Social Networks API 

# Jeff GBANZIALI

> API REST inspirée de Facebook — groupes, événements, fils de discussion, albums photo, sondages, billetterie, liste de courses et covoiturage.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-blue.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/Licence-MIT-yellow.svg)](LICENSE)

---

## Sommaire

- [Présentation](#présentation)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration (.env)](#configuration-env)
- [Lancer l’API](#lancer-lapi)
- [Authentification](#authentification)
- [Documentation des endpoints](#documentation-des-endpoints)
- [Structure du projet](#structure-du-projet)
- [Rendu attendu](#rendu-attendu)

---

## Présentation

Cette API permet de gérer des **groupes** (public, privé, secret), des **événements** avec participants et organisateurs, des **fils de discussion** (liés à un groupe ou un événement), des **albums photo** avec commentaires, des **sondages** à choix unique, une **billetterie**, ainsi que des bonus **liste de courses** et **covoiturage**.

**Stack technique :**

| Couche        | Technologie                          |
|---------------|--------------------------------------|
| Runtime       | Node.js                              |
| Framework     | Express                              |
| Base de données | MongoDB (Mongoose)                 |
| Authentification | JWT (jsonwebtoken)                |
| Validation des entrées | Joi                    |
| Architecture  | Routes → Contrôleurs → Use-cases → Repositories |

---

## Prérequis

- **Node.js** 18 ou supérieur
- **MongoDB** (instance locale ou cluster [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Un fichier **`.env`** à la racine du projet (voir section suivante)

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd my-social-networks-api

# Installer les dépendances
npm install
```

---

## Configuration (.env)

L’application charge sa configuration depuis le fichier **`.env`** à la racine du projet.  
Les variables lues par le code sont définies dans `src/config/env.js`.

Crée un fichier **`.env`** avec les **mêmes noms de variables** que ceux utilisés dans le projet :

| Variable       | Description                          | Exemple (à adapter) |
|----------------|--------------------------------------|----------------------|
| `PORT`         | Port du serveur HTTP                 | `3000`               |
| `MONGODB_URI`  | Chaîne de connexion MongoDB          | Voir ci‑dessous      |
| `JWT_SECRET`   | Secret pour signer les tokens JWT    | Chaîne longue et secrète |
| `JWT_EXPIRES_IN` | Durée de validité du token         | `15m`                |

**Exemple de `.env` :**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/my-social-networks
JWT_SECRET=votre-secret-jwt-tres-long-et-securise
JWT_EXPIRES_IN=15m
```

- Pour une **base locale** :  
  `MONGODB_URI=mongodb://localhost:27017/my-social-networks`

- Pour **MongoDB Atlas** :  
  Utilisez l’URI fournie par notre cluster (format `mongodb+srv://Jeffflaj:Koukouda16@jeff.0lid4ok.mongodb.net/event_database`).  
  Ne partage pas ce fichier ni ne le commite : `.env` doit rester dans `.gitignore`.

Si une variable manque, l’application utilise les valeurs par défaut définies dans `src/config/env.js`.

---

## Lancer l’API

```bash
# Mode production
npm start

# Mode développement (rechargement automatique avec nodemon)
npm run dev
```

Une fois le serveur démarré :

- **Contrôle de santé :**  
  `GET http://localhost:3000/health`  
  (remplace `3000` par la valeur de `PORT` si besoin)

- **Base des routes métier :**  
  `http://localhost:3000/api`

### Remplir la base avec des données de démo (seed)

Pour obtenir des utilisateurs, groupes, événements, messages, albums, sondages, billets, etc. **prêts à l’emploi**, lance l’API dans un premier terminal (`npm run dev`), puis dans un second :

```bash
npm run seed
```

Le script appelle tes endpoints (inscription, création de groupes/événements, etc.) et affiche en fin d’exécution les **comptes de test** (mot de passe commun : `Password123!`) : `alice@example.com`, `bob@example.com`, `charlie@example.com`, `diana@example.com`. Tu peux ensuite te connecter via `POST /api/auth/login` et utiliser l’API avec ces comptes.

Option : `SEED_BASE_URL=http://localhost:3000 npm run seed` si ton API tourne sur un autre port ou host.

---

## Authentification

Les routes protégées exigent un **token JWT** dans l’en-tête HTTP :

```http
Authorization: Bearer <accessToken>
```

### Obtenir un token

| Étape | Méthode | Route | Body (JSON) |
|--------|--------|--------|-------------|
| 1. Inscription | `POST` | `/api/auth/register` | `email`, `password` (min. 8 caractères), `firstName`, `lastName` |
| 2. Connexion   | `POST` | `/api/auth/login`    | `email`, `password` |

La réponse de **login** contient `accessToken` et `user`. Utilise `accessToken` pour toutes les requêtes suivantes nécessitant une authentification.

---

## Documentation des endpoints

**Documentation interactive (Postman)**  
Une fois l’API lancée (`npm start` ou `npm run dev`), ouvre dans ton navigateur :

- **Doc interactive :** [https://documenter.getpostman.com/view/18766243/2sBXc8pPTG](https://documenter.getpostman.com/view/18766243/2sBXc8pPTG)  
  (remplacez `3000` par la valeur de `PORT` dans votre `.env` si vous as changé le port)

Vous y trouveras tous les endpoints (dont résultats des sondages, PATCH/DELETE albums, photos, commentaires, sondages, types de billets), les paramètres attendus et la possibilité d’exécuter des requêtes de test. La spécification OpenAPI brute est aussi disponible en JSON : `GET http://localhost:3000/api-docs.json`.

---

Les routes sont préfixées par **`/api`**.  
Rappel : sauf mention contraire, les routes listées ci‑dessous nécessitent le header `Authorization: Bearer <accessToken>`.

---

### Utilisateurs

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`  | `/api/users/me`   | Profil de l’utilisateur connecté |
| `PATCH`| `/api/users/me`   | Modifier le profil (`firstName`, `lastName`, `avatarUrl`) |

---

### Groupes

| Méthode | Route | Description |
|--------|--------|-------------|
| `POST`   | `/api/groups` | Créer un groupe |
| `GET`    | `/api/groups` | Lister les groupes visibles (publics + ceux dont on est membre) |
| `GET`    | `/api/groups/:groupId` | Détail d’un groupe |
| `PATCH`  | `/api/groups/:groupId` | Modifier (réservé aux admins du groupe) |
| `DELETE` | `/api/groups/:groupId` | Supprimer (réservé aux admins) |
| `GET`    | `/api/groups/:groupId/members` | Lister les membres |
| `POST`   | `/api/groups/:groupId/members` | Ajouter un membre — body : `userId`, `role` (member \| admin) |
| `DELETE` | `/api/groups/:groupId/members/:userId` | Retirer un membre (admin ou quitter le groupe) |
| `POST`   | `/api/groups/:groupId/admins` | Promouvoir un membre en admin — body : `userId` |
| `DELETE` | `/api/groups/:groupId/admins/:userId` | Retirer le rôle admin |
| `GET`    | `/api/groups/:groupId/threads` | Fils de discussion du groupe (réservé aux membres) |
| `POST`   | `/api/groups/:groupId/threads` | Créer un fil — body : `title` (optionnel) |

**Création d’un groupe** — body type :  
`name`, `description?`, `icon?`, `coverPhotoUrl?`, `type` (public \| private \| secret), `allowMembersToPost`, `allowMembersToCreateEvents`.

---

### Événements

| Méthode | Route | Description |
|--------|--------|-------------|
| `POST`   | `/api/events` | Créer un événement |
| `POST`   | `/api/events/groups/:groupId` | Créer un événement dans un groupe |
| `GET`    | `/api/events` | Lister les événements visibles |
| `GET`    | `/api/events/:eventId` | Détail d’un événement |
| `PATCH`  | `/api/events/:eventId` | Modifier (organisateur) |
| `DELETE` | `/api/events/:eventId` | Supprimer (organisateur) |
| `GET`    | `/api/events/:eventId/participants` | Lister les participants (réservé aux participants) |
| `POST`   | `/api/events/:eventId/participants` | Ajouter un participant — body : `userId`, `role` (participant \| organizer) |
| `DELETE` | `/api/events/:eventId/participants/:userId` | Retirer un participant (organisateur ou quitter) |

**Création d’un événement** — body type :  
`name`, `description?`, `startDate`, `endDate`, `location`, `coverPhotoUrl?`, `visibility` (public \| private), `settings?` (shoppingListEnabled, carpoolingEnabled, ticketingEnabled).

---

### Fils de discussion et messages

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`  | `/api/events/:eventId/threads` | Fils de l’événement (participants) |
| `POST` | `/api/events/:eventId/threads` | Créer un fil — body : `title?` |
| `GET`  | `/api/threads/:threadId/messages` | Messages d’un thread (participant de l’event ou membre du groupe) |
| `POST` | `/api/threads/:threadId/messages` | Poster un message — body : `content`, `parentMessageId?` (réponse) |

---

### Albums, photos et commentaires

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`  | `/api/events/:eventId/albums` | Albums de l’événement |
| `POST` | `/api/events/:eventId/albums` | Créer un album — body : `name`, `description?` |
| `GET`  | `/api/albums/:albumId/photos` | Photos de l’album |
| `POST` | `/api/albums/:albumId/photos` | Ajouter une photo — body : `url`, `caption?` (réservé aux participants) |
| `GET`  | `/api/photos/:photoId/comments` | Commentaires d’une photo |
| `POST` | `/api/photos/:photoId/comments` | Commenter — body : `content` (réservé aux participants) |

---

### Sondages

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`  | `/api/events/:eventId/polls` | Sondages de l’événement (participants) |
| `POST` | `/api/events/:eventId/polls` | Créer un sondage — body : `title` (organisateur) |
| `POST` | `/api/polls/:pollId/questions` | Ajouter une question — body : `text`, `order?` (organisateur) |
| `POST` | `/api/questions/:questionId/options` | Ajouter une option — body : `text`, `order?` (organisateur) |
| `POST` | `/api/questions/:questionId/votes` | Voter — body : `optionId` (participant) |

---

### Billetterie

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`  | `/api/events/:eventId/ticket-types` | Types de billets (accès public) |
| `POST` | `/api/events/:eventId/ticket-types` | Créer un type — body : `name`, `price`, `currency`, `quantity` (organisateur) |
| `POST` | `/api/events/:eventId/tickets/purchase` | Acheter un billet — body : `ticketTypeId`, `buyerEmail`, `buyerFirstName`, `buyerLastName`, `buyerAddress` (sans auth) |
| `GET`  | `/api/events/:eventId/tickets` | Billets vendus (organisateur) |

---

### Liste de courses (bonus)

Disponible si `settings.shoppingListEnabled` est activé sur l’événement.

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`    | `/api/events/:eventId/shopping-items` | Liste des items (participants) |
| `POST`   | `/api/events/:eventId/shopping-items` | Ajouter un item — body : `name`, `quantity`, `arrivalTime` |
| `DELETE` | `/api/shopping-items/:itemId` | Supprimer un item (créateur de l’item ou organisateur) |

---

### Covoiturage (bonus)

Disponible si `settings.carpoolingEnabled` est activé sur l’événement.

| Méthode | Route | Description |
|--------|--------|-------------|
| `GET`    | `/api/events/:eventId/rides` | Trajets proposés (participants) |
| `POST`   | `/api/events/:eventId/rides` | Proposer un trajet — body : `departurePlace`, `departureTime`, `price`, `currency?`, `seatsAvailable`, `maxDetourMinutes` |
| `DELETE` | `/api/rides/:rideId` | Supprimer un trajet (conducteur) |
| `GET`    | `/api/rides/:rideId/bookings` | Réservations du trajet |
| `POST`   | `/api/rides/:rideId/bookings` | Réserver une place (participant) |
| `DELETE` | `/api/bookings/:bookingId` | Annuler une réservation (conducteur ou passager) |

---

## Structure du projet

L’architecture suit une séparation en couches : **routes** → **contrôleurs** → **use-cases** → **repositories** → **modèles Mongoose**.

```
src/
├── config/                 # Configuration (env, connexion DB)
│   ├── env.js              # Lecture PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN
│   └── db.js
├── domain/                 # Entités métier
│   └── entities/
├── infrastructure/
│   └── mongoose/
│       ├── models/         # Schémas Mongoose (User, Group, Event, …)
│       └── repositories/  # Accès aux données (CRUD, requêtes)
├── application/
│   └── use-cases/          # Cas d’usage (auth, groups, events, albums, polls, …)
├── interfaces/http/
│   ├── controllers/       # Contrôleurs Express (réponse HTTP)
│   └── routes/            # Définition des routes et middlewares
├── middlewares/            # Auth JWT, autorisation (rôles), gestion d’erreurs
├── validation/
│   ├── schemas/            # Schémas Joi par ressource
│   └── middlewares/       # Middleware de validation
├── docs/                   # Spec OpenAPI (openapi.json)
├── app.js                  # Application Express
└── server.js               # Démarrage du serveur et connexion DB
```

## Licence

MIT.
