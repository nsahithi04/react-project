# Confession App

A full-stack web app where users can sign up or log in with email and password, and send anonymous confessions to other users by email.

---

## Tech Stack

**Frontend:** React, Redux Toolkit, Redux Persist, React Router v7, Tailwind CSS, Webpack, Firebase Auth  
**Backend:** Node.js, Express, MongoDB (Mongoose)  
**Auth:** Firebase Authentication  
**Hosting:** Firebase Hosting (frontend), Render (backend)

---

## Features

- Sign up / login with email and password via Firebase Auth
- Send anonymous confessions to other users by email
- View confessions received in your inbox
- View confessions you have sent
- Edit your display name from your profile
- Persistent login via localStorage (Redux Persist)
- Logout clears all persisted state
- Rate limiting on API routes to prevent abuse
- Protected routes — unauthenticated users redirected to login

---

## Project Structure

```
confessions_app/
├── confession-frontend/        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── firebase.js         # Firebase config
│   │   ├── pages/
│   │   │   ├── form.jsx        # Login / signup form
│   │   │   ├── home.jsx        # Home with tabs
│   │   │   └── Profile.jsx     # Profile page
│   │   ├── components/
│   │   │   └── navBar.jsx      # Nav with logout
│   │   ├── index.jsx           # Entry point
│   │   ├── styles.css          # Tailwind imports
│   │   └── store/
│   │       ├── store.js
│   │       ├── userSlice.js
│   │       └── confessionSlice.js
│   ├── webpack.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── confessions-backend/        # Express backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── userController.js
    │   └── confessionController.js
    ├── models/
    │   ├── User.js
    │   └── Confession.js
    ├── routes/
    │   ├── userRoutes.js
    │   └── confessionRoutes.js
    ├── index.js
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm
- Firebase project with Email/Password authentication enabled

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nsahithi04/react-project
cd confessions_app
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Enable **Email/Password** authentication under Authentication → Sign-in method
4. Copy your Firebase config from Project Settings → Your Apps

### 3. Backend Setup

```bash
cd confessions-backend
npm install
```

Create a `.env` file in `confessions-backend/`:

```
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
node index.js
```

You should see:

```
MongoDB connected
Server running on port 3000
```

### 4. Frontend Setup

```bash
cd confession-frontend
npm install
```

Create a `.env` file in `confession-frontend/`:

```
API_URL=http://localhost:3000
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Start the frontend:

```bash
npm start
```

App runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint                   | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| POST   | `/users`                   | Create user in MongoDB after Firebase signup |
| GET    | `/users/:uid`              | Get user by Firebase UID                     |
| PUT    | `/users/update-name`       | Update display name                          |
| POST   | `/confessions`             | Send a confession                            |
| GET    | `/confessions/:email`      | Get confessions received                     |
| GET    | `/sent-confessions/:email` | Get confessions sent                         |

---

## Usage

1. Open `http://localhost:5173`
2. Sign up with email and password
3. On the home screen:
   - **View Confessions** — see confessions sent to your email
   - **Add Confession** — send a confession to someone else's email
   - **Sent Confessions** — see confessions you have sent
4. Click your profile icon to view/edit your name
5. Click **Logout** to sign out

---

## Deployment

- **Frontend** → Firebase Hosting (`firebase deploy`)
- **Backend** → Render (connect GitHub repo, set root to `confessions-backend`)

---

## Environment Variables

| File                                             | Variable                       | Description                  |
| ------------------------------------------------ | ------------------------------ | ---------------------------- |
| `confessions-backend/.env`                       | `MONGO_URI`                    | MongoDB connection string    |
| `confession-frontend/.env`                       | `API_URL`                      | Backend API base URL         |
| `confession-frontend/.env`                       | `FIREBASE_API_KEY`             | Firebase API key             |
| `confession-frontend/.env`                       | `FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         |
| `confession-frontend/.env` `FIREBASE_PROJECT_ID` | Firebase project ID            |
| `confession-frontend/.env`                       | `FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      |
| `confession-frontend/.env`                       | `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `confession-frontend/.env`                       | `FIREBASE_APP_ID`              | Firebase app ID              |

---

## Notes

- Firebase handles all authentication securely — passwords are never stored in MongoDB
- MongoDB stores user profile data (name, email, Firebase UID)
- Confessions only return `title`, `description`, and `createdAt` — sender identity is not exposed to the receiver
- Rate limiting is applied to POST routes to prevent abuse
- Redux Persist saves login state to localStorage so users stay logged in on reload
