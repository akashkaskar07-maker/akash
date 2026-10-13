# Gym Membership & Personal Trainer Scheduler

A full-stack starter project using React, Node.js, Express, Sequelize ORM, and MySQL.

## Features
- Members, Trainers, Workout Packages, and Bookings
- Trainer has many Workout Packages (one-to-many)
- Members book slots with multiple Trainers (many-to-many through `Bookings`)
- React hooks: `useState`, `useEffect`; reusable props-based components
- Sequelize models, associations, and migrations

## Requirements
- Node.js 18+
- MySQL 8+

## 1. Configure the database
Create a MySQL database:
```sql
CREATE DATABASE gym_scheduler;
```
Copy `backend/.env.example` to `backend/.env` and update your MySQL username/password.

## 2. Install and migrate backend
```bash
cd backend
npm install
npx sequelize-cli db:migrate
npm run dev
```
Backend runs at `http://localhost:5000`.

## 3. Run frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## API routes
- `GET /api/members`
- `POST /api/members`
- `GET /api/trainers`
- `POST /api/trainers`
- `GET /api/packages`
- `POST /api/packages`
- `GET /api/bookings`
- `POST /api/bookings`

Booking body example:
```json
{
  "memberId": 1,
  "trainerId": 1,
  "slotDate": "2026-10-20",
  "slotTime": "10:00",
  "notes": "Strength training"
}
```

## Notes
- The migration creates the tables and foreign keys. Run migrations before starting the app.
- This is a learning/demo project. Add authentication, validation, and production security before deployment.
