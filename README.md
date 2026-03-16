# Confession App

A full-stack web app where users can register with their name and phone number, verify via OTP, and send anonymous confessions to other users by phone number.

---

## Tech Stack

**Frontend:** React, Redux Toolkit, Redux Persist, React Router v7, Tailwind CSS, Webpack  
**Backend:** Node.js, Express, MongoDB (Mongoose)

---

## Features

- Register / login with name and phone number
- OTP verification (static OTP for now: `123456`)
- Send confessions to other users by phone number
- View confessions sent to your phone number
- Persistent login via localStorage (Redux Persist)
- Logout clears all persisted state

---

## Project Structure

```
confessions_app/
├── confession-frontend/     # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── form.jsx         # Register/login form
│   │   ├── verifyOtp.jsx    # OTP verification
│   │   ├── home.jsx         # Home with tabs (view/add confessions)
│   │   ├── navBar.jsx       # Nav with logout
│   │   ├── index.jsx        # Entry point
│   │   ├── styles.css       # Tailwind imports
│   │   └── store/
│   │       ├── store.js
│   │       ├── userSlice.js
│   │       └── confessionSlice.js
│   ├── webpack.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── confessions-backend/     # Express backend
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

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nsahithi04/react-project
cd confessions_app
```

### 2. Backend Setup

```bash
cd confessions-backend
npm install
```

Create a `.env` file in `confessions-backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
node index.js
```

You should see:

```
MongoDB connected
Server running on port 5000
```

### 3. Frontend Setup

```bash
cd confession-frontend
npm install
```

Create a `.env` file in `confession-frontend/`:

```
API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

App runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| POST   | `/users`              | Register or login user             |
| POST   | `/verify-otp`         | Verify OTP (static: `123456`)      |
| POST   | `/confessions`        | Send a confession                  |
| GET    | `/confessions/:phone` | Get confessions for a phone number |

---

## Usage

1. Open `http://localhost:5173`
2. Enter your name and phone number → click Submit
3. Enter OTP `123456` → click Verify
4. On the home screen:
   - **View Confessions** — see confessions sent to your number
   - **Add Confession** — send a confession to someone else's number
5. Click **Logout** to sign out

---

## Notes

- OTP is currently static (`123456`). Replace with a real SMS service like Twilio for production.
- User names are stored in lowercase with no spaces.
- Confessions only return `title`, `description`, and `createdAt` — sender identity is hidden.
- Redux Persist saves login state to localStorage so you stay logged in on reload.

---

## Environment Variables

| File                       | Variable    | Description                 |
| -------------------------- | ----------- | --------------------------- |
| `confessions-backend/.env` | `PORT`      | Port for the backend server |
| `confessions-backend/.env` | `MONGO_URI` | MongoDB connection string   |
| `confession-frontend/.env` | `API_URL`   | Backend API base URL        |

> **Never commit `.env` files.** Make sure they are in `.gitignore`.
