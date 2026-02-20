# Spotimusic 🎧

A lightweight Spotify-inspired music app built with **React + Vite** on the frontend and a simple **Express API** on the backend.  
Includes JWT authentication (access token + refresh token via HTTP-only cookies), protected routes, and a clean developer setup for local + production deployment.

## ✨ Features

- ⚡ Fast frontend: React + Vite
- 🔐 Auth system:
  - Access token (JWT)
  - Refresh token stored in **HTTP-only cookie**
  - Token refresh endpoint
- 👤 Protected endpoint: `/me`
- 🍪 Cookies + CORS configured for GitHub Pages ↔ Railway
- 🚀 Deployment:
  - Frontend on **GitHub Pages**
  - Backend on **Railway**

## 🧱 Tech Stack

**Frontend**
- React
- Redux Toolkit
- React Router
- Vite

**Backend**
- Node.js
- Express
- JWT (jsonwebtoken)
- bcrypt
- cookie-parser
- cors

## 📁 Project Structure

```text
/
├─ src/                # React app
├─ server.ts           # Express API
├─ dist/               # Build output (generated)
├─ vite.config.ts
└─ tsconfig.server.json
```
## ✅ Requirements

- Node.js 18+ (recommended 20+)
- npm

## 🛠️ Local Development

### 1) Install dependencies
```bash
npm install
```

### 2) Create .env for local usage (DO NOT COMMIT)

Create a file named .env in the project root:
```
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
VITE_API_URL=http://localhost:3000
```
### 3) Run backend (API)
```
npm run server
```
API will be available at:
```
http://localhost:3000
```

### 4) Run frontend (Vite)

In a second terminal:
```
npm run dev
```

Frontend will be available at:
```
http://localhost:5173
```

🔌 API Endpoints
```
Base URL (local): http://localhost:3000
```
Method	Endpoint	Description
```
POST	/auth/register	Register new user
POST	/auth/login	Login, returns access token, sets refresh cookie
POST	/auth/refresh	Refresh access token using cookie
POST	/auth/logout	Logout + clear cookie
GET	/me	Protected user endpoint (requires Authorization: Bearer <token>)
```
## 🌐 Production Setup
Frontend (GitHub Pages)

Create .env.production (safe to commit, contains no secrets):
```
VITE_API_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app
```
Build + deploy:
```
npm run build
npm run deploy
```

Backend (Railway)

Set variables in Railway → Variables:
```
NODE_ENV=production

JWT_ACCESS_SECRET=...

JWT_REFRESH_SECRET=...
```
Railway commands:

Build Command: npm run build:server

Start Command: npm start

## ⚠️ Notes on Cookies + CORS

This project uses credentials: 'include' on the client and HTTP-only cookies for refresh tokens.
For GitHub Pages ↔ Railway, cookies must be set with:
```
SameSite=None

Secure=true (HTTPS required)
```
CORS must allow:
https://stepbohdan.github.io
and set credentials: true.

## 📌 Roadmap (optional)

Persist users in a database (PostgreSQL / MongoDB)

Improve UI/UX and responsiveness


# Made with ❤️ by StepBohdan
