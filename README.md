# 🏆 BVRIT PlayNet

**A Full Stack Sports Management Platform for BVRIT Hyderabad College of Engineering for Women**

---

## 📋 Project Overview

BVRIT PlayNet is a comprehensive sports management platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables students and sports faculty to manage all sports activities within the college.

---

## 🗂 Project Structure

```
bvrit-playnet/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── config/       ← Database connection
│   ├── middleware/   ← JWT authentication
│   ├── models/       ← MongoDB/Mongoose schemas
│   ├── routes/       ← REST API endpoints
│   ├── server.js     ← Main Express server
│   ├── seed.js       ← Sample data seeder
│   └── .env          ← Environment config
│
└── frontend/         ← React.js SPA
    ├── public/       ← Static HTML
    └── src/
        ├── components/ ← Reusable UI (Sidebar, Layout)
        ├── context/    ← React Auth Context
        ├── pages/      ← All 12 application pages
        ├── api.js      ← Axios API instance
        ├── App.js      ← Router & routes
        └── index.css   ← Global styles
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### Step 1: Clone/Extract the Project
```bash
cd bvrit-playnet
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Edit `.env` file — set your MongoDB URI:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bvrit_playnet
JWT_SECRET=bvrit_playnet_super_secret_key_2024
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Backend runs at: `http://localhost:5000`

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔐 Login Credentials (after seeding)

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@bvrit.ac.in        | admin123    |
| Faculty | faculty@bvrit.ac.in      | faculty123  |
| Student | arjun@bvrit.ac.in        | student123  |

---

## 📱 Features

### For Students
- Register with department, roll number & sports preferences
- Browse and join sports teams
- View live scores in real time (auto-refreshes every 15s)
- Mark attendance for matches
- View match schedule on calendar
- Check leaderboards by sport
- Receive announcements from faculty

### For Sports Faculty / Admin
- Post and pin announcements
- Schedule matches with venue & time
- Set match status: Scheduled → Live → Completed
- Update live scores for any ongoing match
- Create and manage tournaments
- View all registered students

---

## 🗄 Database Models

| Model        | Description                                       |
|--------------|---------------------------------------------------|
| User         | Student/Faculty accounts with JWT auth            |
| Team         | Sports teams with members, stats (W/L/D/Points)   |
| Match        | Scheduled/Live/Completed matches with scores      |
| Tournament   | Events with participating teams & registration    |
| Announcement | Pinnable notices with priority levels             |

---

## 🔌 API Endpoints

```
POST   /api/auth/register        Register user
POST   /api/auth/login           Login
GET    /api/auth/me              Get current user

GET    /api/teams                List all teams
POST   /api/teams                Create team (auth)
POST   /api/teams/:id/join       Join a team (auth)

GET    /api/matches              List matches (filter by status/sport)
GET    /api/matches/live         Get live matches
POST   /api/matches              Schedule match (admin)
PUT    /api/matches/:id/score    Update score (admin)
POST   /api/matches/:id/attend   Mark attendance

GET    /api/tournaments          List tournaments
POST   /api/tournaments          Create tournament (admin)
POST   /api/tournaments/:id/register  Register team

GET    /api/announcements        List announcements
POST   /api/announcements        Post announcement (admin)
DELETE /api/announcements/:id    Delete announcement (admin)

GET    /api/users/leaderboard    Team leaderboard (filter by sport)
GET    /api/users                All students (admin)
```

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js, React Router v6, Axios    |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB with Mongoose ODM           |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Styling   | Custom CSS with CSS Variables       |
| Fonts     | Bebas Neue, Rajdhani, Inter         |

---

## 📚 Curriculum Coverage

This project covers all units from the Full Stack Development syllabus:

- **Unit I**: Full stack architecture — React frontend, Express backend, MongoDB database, Node.js runtime
- **Unit II**: Node.js — Event model, callbacks, HTTP server, JSON handling, File system (via Express), Query strings, Request/Response objects
- **Unit III**: MongoDB — CRUD operations, Mongoose schema/models, MongoDB Node.js driver, connecting from Node.js

---

## 👨‍💻 Developed For

BVRIT Hyderabad College of Engineering for Women  
Department of Computer Science & Engineering  
Full Stack Development Project — 2024
