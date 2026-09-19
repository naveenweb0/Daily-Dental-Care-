# Deployment Guide - Dental Clinic Website & CRM

This guide covers deploying the Dental Clinic Website & CRM to **Vercel**, **Railway**, **Render**, **Docker/VPS**, or any cloud hosting provider.

---

## 📋 Required Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@ep-xyz.neon.tech/dental_clinic?sslmode=require` |
| `NODE_ENV` | Application environment | `production` |
| `DB_SSL` | Enable/disable SSL for Postgres | `true` (use `false` only for local docker) |
| `SEED_ADMIN_PASSWORD` | Initial Super Admin password | `Admin@YourSecurePass123` |
| `SEED_STAFF_PASSWORD` | Initial Receptionist password | `Reception@YourSecurePass123` |

---

## 🚀 Option 1: Deploy to Vercel + Neon / Supabase (Recommended)

### 1. Set Up PostgreSQL Database
- Create a free database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
- Copy the PostgreSQL connection string (`DATABASE_URL`).

### 2. Deploy to Vercel
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: *(Your Neon/Supabase PostgreSQL URL)*
   - `NODE_ENV`: `production`
4. Click **Deploy**.

### 3. Initialize Database & Seed Admin
From your local terminal (or CI/CD):
```bash
# Point to your production database temporarily to push tables and seed
DATABASE_URL="postgresql://user:pass@host/db" npm run db:setup
```

---

## 🚂 Option 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app) and create a **New Project**.
2. Add a **PostgreSQL** service.
3. Add a **GitHub Repo** service connected to this repository.
4. In the app settings, Railway will automatically link `DATABASE_URL` from Postgres.
5. In **Build & Deploy** settings:
   - Build Command: `npm run db:push && npm run build`
   - Start Command: `npm run start`
6. (Optional) Run seed once via Railway CLI or locally:
   ```bash
   DATABASE_URL="<railway_postgres_url>" npm run db:seed
   ```

---

## 🐳 Option 3: Deploy with Docker / Self-Hosted VPS

### Using Docker Compose (App + Database included)
Run in the root directory:
```bash
docker compose up -d --build
```
This starts:
- Next.js application on `http://localhost:3000`
- PostgreSQL 16 on `localhost:5432`

### Run Migrations & Seed inside Docker:
```bash
docker compose exec app npm run db:setup
```

---

## 🔐 Default Admin Credentials

After running `npm run db:seed` or `npm run db:setup`:

- **Super Admin Login:**
  - **URL:** `/login`
  - **Email:** `admin@dailydentalcare.in`
  - **Password:** `Admin@12345` (or whatever set in `SEED_ADMIN_PASSWORD`)
- **Receptionist Login:**
  - **Email:** `reception@dailydentalcare.in`
  - **Password:** `Reception@12345` (or whatever set in `SEED_STAFF_PASSWORD`)

> **Note:** After logging in, you can change passwords or add new staff from the **Admin > Settings** page.
