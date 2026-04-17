# Street Dogs Care Network (MERN)

A full-stack MERN project for managing:
- Map-based feeding points
- Daily feeding schedules
- Health alerts and rescue requests
- Volunteer coordination
- Role-based access (admin and volunteer)
- Evidence image upload for alerts
- Email notifications for critical alerts and missed schedules

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Project Structure
- `client/` React frontend
- `server/` Express API

## Setup

### 1) Backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Update `server/.env` with your JWT secret and optional SMTP details if you want real email notifications.

### 2) Frontend
```bash
cd client
npm install
copy .env.example .env
npm run dev
```

### 3) Root (for Netlify build)
```bash
cd ..
npm install
```

## API Endpoints
- `GET/POST /api/feeding-points`
- `PATCH /api/feeding-points/:id`
- `GET/POST /api/schedules`
- `PATCH /api/schedules/:id/status`
- `GET/POST /api/alerts`
- `PATCH /api/alerts/:id/status`
- `GET/POST /api/volunteers`
- `PATCH /api/volunteers/:id/toggle`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Notes
- Open the frontend at `http://localhost:5173`
- Backend runs at `http://localhost:5000`
- Ensure MongoDB is running locally or update `MONGO_URI` in `server/.env`
- Alert images are stored as data URLs in MongoDB for serverless compatibility
- If SMTP is not configured, notifications are logged to server console instead of sent by email

## Deploy Both Frontend + Backend on Netlify

This repository now supports a single Netlify site deployment using:
- Static frontend from `client/dist`
- Serverless backend from `netlify/functions/api.js`

### 1) Push to GitHub
- Push the full repository including `netlify.toml`, root `package.json`, and `netlify/functions/`.

### 2) Create Netlify Site
- Netlify Dashboard -> Add new site -> Import from Git
- Choose this repository

Build settings (usually auto-detected from `netlify.toml`):
- Build command: `npm run build`
- Publish directory: `client/dist`

### 3) Set Environment Variables in Netlify
- `MONGO_URI=your_mongodb_atlas_uri`
- `JWT_SECRET=your_long_random_secret`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=https://your-netlify-site.netlify.app`
- `NOTIFY_FROM=streetdogs@example.com`
- `NOTIFY_TO=team@example.com`

Optional SMTP variables for real emails:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`

Optional frontend override (not required in Netlify same-domain deploy):
- `VITE_API_URL=/api`

### 4) Deploy and Verify
- Open `https://your-netlify-site.netlify.app/api/health`
- Open your Netlify site root URL and test register/login and CRUD flows

### 5) Local and Netlify Routing
- API requests from frontend use `/api` in production
- `netlify.toml` rewrites `/api/*` to the serverless function
