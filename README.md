# Confession App

Send anonymous confessions to other users by email.

---

## Tech Stack

- **Frontend:** React, Redux Toolkit, Firebase Auth, Tailwind CSS, Webpack
- **Backend:** Node.js, Express, MongoDB
- **Hosting:** Firebase Hosting (frontend), Render (backend)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/nsahithi04/react-project
cd confessions_app
```

### 2. Backend

```bash
cd confessions-backend
npm install
```

Create `confessions-backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

```bash
node server.js
```

### 3. Frontend

```bash
cd confession-frontend
npm install
```

Create `confession-frontend/.env`:

```
API_URL=http://localhost:3000
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

```bash
npm start
```

App runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/users`                   | Create user              |
| GET    | `/users/:uid`              | Get user by UID          |
| PUT    | `/users/update-name`       | Update display name      |
| POST   | `/confessions`             | Send a confession        |
| GET    | `/confessions/:email`      | Get received confessions |
| GET    | `/sent-confessions/:email` | Get sent confessions     |

---

## Testing

```bash
# Frontend
cd confession-frontend
npm test

# Backend
cd confessions-backend
npm test
```
