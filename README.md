# My Social Networks API

API REST type Facebook — Groupes, Événements, Fils de discussion, Albums/Photos, Sondages, Billetterie, Shopping list, Covoiturage.

**Stack :** Node.js, Express, MongoDB, Mongoose, JWT, Joi (validation), architecture en couches (routes → contrôleurs → use-cases → repositories).

---

## Prérequis

- **Node.js** (v18+ recommandé)
- **MongoDB** (local ou Atlas)

---

## Installation

```bash
git clone <url-du-repo>
cd my-social-networks-api
npm install
```

Créer un fichier **`.env`** à la racine :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/my-social-networks
JWT_SECRET=votre-secret-jwt-tres-long-et-securise
JWT_EXPIRES_IN=15m
```

---

## Lancer l’API

```bash
# Production
npm start

# Développement (rechargement auto)
npm run dev
```

L’API écoute sur **http://localhost:3000** (ou le `PORT` défini dans `.env`).

- **Healthcheck :** `GET http://localhost:3000/health`
- **Base des routes métier :** `http://localhost:3000/api`

---

## Authentification

Toutes les routes protégées nécessitent un **JWT** dans le header :

```
Authorization: Bearer <accessToken>
```

### Obtenir un token

1. **Inscription**
   - `POST /api/auth/register`
   - Body (JSON) : `email`, `password` (min 8 caractères), `firstName`, `lastName`
   - Réponse : utilisateur créé (sans mot de passe)

2. **Connexion**
   - `POST /api/auth/login`
   - Body (JSON) : `email`, `password`
   - Réponse : `{ "accessToken": "...", "user": { ... } }`

Utiliser `accessToken` pour les requêtes suivantes.

---

## Endpoints principaux

### Utilisateurs

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/users/me` | Profil de l’utilisateur connecté | Oui |
| PATCH | `/api/users/me` | Modifier profil (`firstName`, `lastName`, `avatarUrl`) | Oui |

---

### Groupes

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| POST | `/api/groups` | Créer un groupe | Oui |
| GET | `/api/groups` | Lister les groupes visibles (publics + ceux dont on est membre) | Oui |
| GET | `/api/groups/:groupId` | Détail d’un groupe | Oui |
| PATCH | `/api/groups/:groupId` | Modifier (admin) | Oui |
| DELETE | `/api/groups/:groupId` | Supprimer (admin) | Oui |
| GET | `/api/groups/:groupId/members` | Lister les membres | Oui |
| POST | `/api/groups/:groupId/members` | Ajouter un membre (admin), body : `userId`, `role` (member/admin) | Oui |
| DELETE | `/api/groups/:groupId/members/:userId` | Retirer un membre (admin ou quitter) | Oui |
| POST | `/api/groups/:groupId/admins` | Promouvoir en admin, body : `userId` | Oui (admin) |
| DELETE | `/api/groups/:groupId/admins/:userId` | Retirer le rôle admin | Oui (admin) |
| GET | `/api/groups/:groupId/threads` | Fils de discussion du groupe | Oui (membre) |
| POST | `/api/groups/:groupId/threads` | Créer un fil, body : `title?` | Oui (membre) |

**Création groupe (POST /api/groups)** — body exemple :  
`name`, `description?`, `icon?`, `coverPhotoUrl?`, `type` (public | private | secret), `allowMembersToPost`, `allowMembersToCreateEvents`.

---

### Événements

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| POST | `/api/events` | Créer un événement | Oui |
| POST | `/api/events/groups/:groupId` | Créer un événement dans un groupe | Oui (membre + droit création) |
| GET | `/api/events` | Lister les événements visibles (publics + ceux où on participe) | Oui |
| GET | `/api/events/:eventId` | Détail d’un événement | Oui |
| PATCH | `/api/events/:eventId` | Modifier (organisateur) | Oui |
| DELETE | `/api/events/:eventId` | Supprimer (organisateur) | Oui |
| GET | `/api/events/:eventId/participants` | Lister les participants | Oui (participant) |
| POST | `/api/events/:eventId/participants` | Ajouter un participant/organisateur, body : `userId`, `role` (participant/organizer) | Oui (organisateur) |
| DELETE | `/api/events/:eventId/participants/:userId` | Retirer un participant (organisateur ou quitter) | Oui |

**Création événement** — body : `name`, `description?`, `startDate`, `endDate`, `location`, `coverPhotoUrl?`, `visibility` (public | private), `settings?` (shoppingListEnabled, carpoolingEnabled, ticketingEnabled).

---

### Fils de discussion & messages

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/events/:eventId/threads` | Fils de l’événement | Oui (participant) |
| POST | `/api/events/:eventId/threads` | Créer un fil pour l’événement, body : `title?` | Oui (participant) |
| GET | `/api/threads/:threadId/messages` | Messages d’un thread | Oui (participant event ou membre groupe) |
| POST | `/api/threads/:threadId/messages` | Poster un message, body : `content`, `parentMessageId?` | Oui |

---

### Albums, photos, commentaires

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/events/:eventId/albums` | Albums de l’événement | Oui (participant) |
| POST | `/api/events/:eventId/albums` | Créer un album, body : `name`, `description?` | Oui (participant) |
| GET | `/api/albums/:albumId/photos` | Photos de l’album | Oui |
| POST | `/api/albums/:albumId/photos` | Ajouter une photo, body : `url`, `caption?` | Oui (participant event) |
| GET | `/api/photos/:photoId/comments` | Commentaires d’une photo | Oui |
| POST | `/api/photos/:photoId/comments` | Commenter, body : `content` | Oui (participant event) |

---

### Sondages

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/events/:eventId/polls` | Sondages de l’événement | Oui (participant) |
| POST | `/api/events/:eventId/polls` | Créer un sondage, body : `title` | Oui (organisateur) |
| POST | `/api/polls/:pollId/questions` | Ajouter une question, body : `text`, `order?` | Oui (organisateur) |
| POST | `/api/questions/:questionId/options` | Ajouter une option, body : `text`, `order?` | Oui (organisateur) |
| POST | `/api/questions/:questionId/votes` | Voter, body : `optionId` | Oui (participant) |

---

### Billetterie

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/events/:eventId/ticket-types` | Types de billets | Non |
| POST | `/api/events/:eventId/ticket-types` | Créer un type, body : `name`, `price`, `currency`, `quantity` | Oui (organisateur) |
| POST | `/api/events/:eventId/tickets/purchase` | Acheter un billet (public), body : `ticketTypeId`, `buyerEmail`, `buyerFirstName`, `buyerLastName`, `buyerAddress` | Non |
| GET | `/api/events/:eventId/tickets` | Billets vendus | Oui (organisateur) |

---

### Shopping list (bonus)

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/events/:eventId/shopping-items` | Liste des items | Oui (participant) |
| POST | `/api/events/:eventId/shopping-items` | Ajouter un item, body : `name`, `quantity`, `arrivalTime` | Oui (participant) |
| DELETE | `/api/shopping-items/:itemId` | Supprimer un item (créateur ou organisateur) | Oui |

À activer sur l’événement : `settings.shoppingListEnabled`.

---

### Covoiturage (bonus)

| Méthode | Route | Description | Auth |
|--------|--------|-------------|------|
| GET | `/api/events/:eventId/rides` | Trajets proposés | Oui (participant) |
| POST | `/api/events/:eventId/rides` | Proposer un trajet, body : `departurePlace`, `departureTime`, `price`, `currency?`, `seatsAvailable`, `maxDetourMinutes` | Oui (participant) |
| DELETE | `/api/rides/:rideId` | Supprimer un trajet (conducteur) | Oui |
| GET | `/api/rides/:rideId/bookings` | Réservations du trajet | Oui |
| POST | `/api/rides/:rideId/bookings` | Réserver une place | Oui (participant) |
| DELETE | `/api/bookings/:bookingId` | Annuler une réservation | Oui |

À activer sur l’événement : `settings.carpoolingEnabled`.

---

## Structure du projet

```
src/
├── config/           # env, db
├── domain/           # entités métier
├── infrastructure/
│   └── mongoose/     # modèles et repositories
├── application/
│   └── use-cases/    # cas d’usage (auth, groups, events, …)
├── interfaces/http/
│   ├── controllers/ # contrôleurs Express
│   └── routes/       # définition des routes
├── middlewares/      # auth JWT, autorisation, validation, erreurs
├── validation/
│   └── schemas/      # schémas Joi par ressource
├── app.js
└── server.js
```

---

## Rendu attendu (rappels)

- Respect des besoins fonctionnels du sujet.
- Validators sur les entrées (Joi).
- Collections MongoDB adaptées aux spécifications.
- Code dans un repo Git ; lien à déposer sur Teams.

---

## Licence

MIT.
