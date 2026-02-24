# 🏥 Kamukira PRMS — Patient Records Management System

A complete, production-ready, hybrid (online + offline capable) Patient Records Management System for **Kamukira Health Centre IV (HCIV)**, Uganda.

Built with **Django + React + PostgreSQL** and deployable via Docker.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Setup (without Docker)](#manual-setup-without-docker)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Deployment](#deployment)
- [Default Credentials](#default-credentials)

---

## ✨ Features

- **Patient Registration** — Auto-generated patient IDs (`KAM-YYYY-NNNNN`)
- **Visit Management** — Outpatient, inpatient, emergency, antenatal, immunization, follow-up
- **Clinical Module** — Triage vitals, diagnoses (ICD-10), prescriptions
- **Laboratory** — Lab requests, result entry, abnormal flagging
- **Pharmacy** — Prescription dispensing, inventory tracking
- **Reports** — OPD attendance, disease frequency, demographics, lab stats
- **Audit Logs** — Complete audit trail for all operations
- **Offline Support** — PWA with service workers + IndexedDB sync
- **Role-Based Access** — 6 staff roles with granular permissions
- **JWT Authentication** — Secure API with auto-refresh tokens
- **API Documentation** — Interactive Swagger/OpenAPI docs

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2 + Django REST Framework |
| Frontend | React 18 + Tailwind CSS + Redux Toolkit |
| Database | PostgreSQL 15 |
| Authentication | JWT (djangorestframework-simplejwt) |
| Offline Sync | PWA service workers + IndexedDB |
| Task Queue | Celery + Redis |
| Reverse Proxy | Nginx |
| Containerization | Docker + docker-compose |
| API Docs | drf-spectacular (Swagger/OpenAPI) |

---

## 📁 Repository Structure

```
kamukira-prms/
├── backend/
│   ├── config/              # Django project config
│   │   ├── settings/
│   │   │   ├── base.py      # Shared settings
│   │   │   ├── local.py     # Development settings
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── staff/           # Custom user model + auth
│   │   ├── patients/        # Patient registration
│   │   ├── visits/          # Visit & diagnosis management
│   │   ├── prescriptions/   # Medications & dispensing
│   │   ├── lab/             # Lab tests & results
│   │   ├── reports/         # Dashboard & reports
│   │   ├── audit/           # Audit logging
│   │   └── sync/            # Offline sync endpoints
│   ├── fixtures/
│   │   └── initial_data.json  # Sample data (staff, meds, lab tests)
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── service-worker.js   # PWA offline support
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Full page views
│   │   ├── store/           # Redux state management
│   │   ├── services/        # API service layer
│   │   └── utils/           # Helpers, constants, sync manager
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── nginx.conf
├── docker-compose.yml       # Development
├── docker-compose.prod.yml  # Production
├── .env.example
└── README.md
```

---

## ✅ Prerequisites

- **Docker** ≥ 24.0 and **docker-compose** ≥ 2.0  
  — OR —
- **Python** ≥ 3.11, **Node.js** ≥ 18, **PostgreSQL** ≥ 15

---

## 🚀 Quick Start with Docker

```bash
# 1. Clone the repository
git clone https://github.com/umarkhemis/kamukira-prms.git
cd kamukira-prms

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start all services
docker-compose up -d --build

# 4. Run initial setup (migrations + fixtures + admin user)
docker-compose exec backend python manage.py setup_prms

# 5. Open the app
# Frontend: http://localhost:3000
# API:      http://localhost:8000/api/
# API Docs: http://localhost:8000/api/docs/
# Admin:    http://localhost:8000/admin/
```

---

## 🔧 Manual Setup (without Docker)

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variable
export DJANGO_SETTINGS_MODULE=config.settings.local
# (or create a .env file in backend/ with DATABASE_URL etc.)

# Run setup command (migrations + fixtures + admin)
python manage.py setup_prms

# Start development server
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | (required in production) |
| `DEBUG` | Debug mode | `True` |
| `DATABASE_URL` | PostgreSQL connection URL | SQLite fallback |
| `POSTGRES_DB` | Database name | `kamukira_prms` |
| `POSTGRES_USER` | Database user | `prms_user` |
| `POSTGRES_PASSWORD` | Database password | — |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## 📖 API Documentation

Interactive Swagger UI: `http://localhost:8000/api/docs/`  
ReDoc: `http://localhost:8000/api/redoc/`

### Key Endpoints

```
POST   /api/auth/login/                     Login
POST   /api/auth/refresh/                   Refresh token
POST   /api/auth/logout/                    Logout

GET    /api/patients/                       List patients
POST   /api/patients/                       Register patient
GET    /api/patients/{id}/history/          Full medical history

GET    /api/visits/                         List visits
POST   /api/visits/                         Create visit
POST   /api/visits/{id}/diagnoses/          Add diagnosis

GET    /api/prescriptions/                  List prescriptions
POST   /api/prescriptions/                  Create prescription
PUT    /api/prescriptions/{id}/dispense/    Dispense medication

GET    /api/lab/requests/                   Lab requests
POST   /api/lab/requests/                   Create request
PUT    /api/lab/requests/{id}/result/       Submit result

GET    /api/reports/dashboard/              Dashboard stats
GET    /api/reports/visits/                 Visit reports
GET    /api/reports/diseases/               Disease frequency

POST   /api/sync/push/                      Offline sync push
GET    /api/sync/pull/                      Offline sync pull

GET    /api/staff/me/                       Current user profile
GET    /api/audit/logs/                     Audit logs (admin)
```

---

## 👥 User Roles & Permissions

| Role | Patients | Visits | Prescriptions | Lab | Reports | Staff | Audit |
|------|----------|--------|---------------|-----|---------|-------|-------|
| **admin** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **doctor** | ✅ Read | ✅ Full | ✅ Create | ✅ Request | ✅ Read | ❌ | ❌ |
| **nurse** | ✅ Read | ✅ Triage | ✅ Read | ✅ Read | ✅ Read | ❌ | ❌ |
| **receptionist** | ✅ Create | ✅ Create | ✅ Read | ✅ Read | ✅ Read | ❌ | ❌ |
| **lab_technician** | ✅ Read | ✅ Read | ❌ | ✅ Full | ✅ Read | ❌ | ❌ |
| **pharmacist** | ✅ Read | ✅ Read | ✅ Dispense | ❌ | ✅ Read | ❌ | ❌ |

---

## 🚢 Deployment

### Production with Docker

```bash
# 1. Set production environment variables
cp .env.example .env
# Edit .env: set SECRET_KEY, POSTGRES_PASSWORD, ALLOWED_HOSTS, etc.
# Set DEBUG=False

# 2. Build and start production stack
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Run migrations and collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py setup_prms
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

### SSL/HTTPS

Update `nginx/nginx.conf` to add SSL certificates and redirect HTTP to HTTPS. Consider using [Certbot](https://certbot.eff.org/) with Let's Encrypt.

---

## 🔐 Default Credentials

After running `python manage.py setup_prms`:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `Admin@1234` | Administrator |

> ⚠️ **Change the admin password immediately in production!**

---

## 🧪 Running Tests

```bash
cd backend
python manage.py test apps.staff apps.patients apps.visits apps.prescriptions apps.lab
```

---

## 📸 Screenshots

> Screenshots section — to be added after first deployment.

---

## 📄 License

This project is developed for Kamukira Health Centre IV, Kasese District, Uganda.
