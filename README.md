# Accounting System 2.0

Full-stack accounting dashboard rebuilt with a modern DX-focused stack: FastAPI + SQLModel + fastapi-users on the backend, PostgreSQL for storage, and a React 19 + Vite frontend powered by Tailwind CSS, Chakra UI, and TanStack Query.

## Tech overview
- **Backend:** FastAPI 0.109+, SQLModel ORM, FastAPI Users for auth, JWT (HS256) with 30-minute expiry, async SQLAlchemy engine.
- **Database:** PostgreSQL 15 with docker-compose + schema.sql initializer.
- **Frontend:** React 19, Vite, Tailwind CSS, Chakra UI component kit, TanStack Query for data fetching/caching, Axios for HTTP, lucide-react icons.
- **Tooling:** python-dotenv for env loading, create_test_user helper for sample credentials.

## Prerequisites
- Python 3.11+
- Node.js 18+
- Docker + Docker Compose

## Database (docker-compose)
```bash
# Bring up PostgreSQL 15 with the schema auto-seeded
docker compose up -d
```
The compose file exposes port `5432` and runs `database/schema.sql` to create the `accounting_system` database, tables (users/expenses/profits), indexes, and relationships. Credentials (matching `.env.example`) are:
- `POSTGRES_USER=accounting_admin`
- `POSTGRES_PASSWORD=accounting_password`
- `POSTGRES_DB=accounting_system`

## Backend setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # adjust DATABASE_URL + SECRET_KEY
```
`.env` must define:
```
DATABASE_URL=postgresql://accounting_admin:accounting_password@localhost:5432/accounting_system
SECRET_KEY=your-secret
```
Run the FastAPI app:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
FastAPI Users exposes:
- `POST /auth/jwt/login` and `/auth/jwt/logout`
- `POST /auth/register`
- `POST /auth/forgot-password`, `/auth/reset-password`
- `GET /users/me`, `PATCH /users/{id}`

Domain endpoints (all require authentication):
- `GET/POST/PUT/DELETE /expenses/`
- `GET/POST/PUT/DELETE /profits/`
- `GET /summary/`

Expense/Profit CRUD bind `user_id` to the authenticated user. Update/delete enforce ownership. `/summary/` aggregates totals via SQLModel + SQL `SUM` and returns floats.

### Seed a test user
```bash
cd backend
python create_test_user.py
```
This script creates tables (if needed) and inserts `testuser@example.com / testpass123` only when absent.

## Backend2 (NestJS + Prisma)
A NestJS + Prisma rewrite lives in `backend2/`. It targets the same PostgreSQL schema and mirrors the original FastAPI endpoints so the existing frontend can switch over without code changes.

```bash
cd backend2
cp .env.example .env   # update DATABASE_URL, JWT_SECRET, token lifetime, bcrypt rounds
npm install
npm run prisma:migrate   # or `npm run prisma:deploy` in CI
npm run prisma:seed      # optional helper to recreate the demo user
npm run start:dev        # launches on http://localhost:3000 by default
```

Key modules:
- `auth` exposes `POST /auth/register`, `POST /auth/jwt/login`, `POST /auth/jwt/logout` returning FastAPI-compatible payloads.
- `users` keeps `GET /users/me` + `PATCH /users/:id` (owner/superuser only).
- `expenses` and `profits` provide the CRUD + filtering endpoints used by the React widgets.
- `summary` aggregates totals and returns `{ total_expenses, total_profits, net }`.

`npm run prisma:seed` seeds `testuser@example.com / testpass123` using the values from `.env`.

## Frontend setup
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```
The Vite dev server runs at http://localhost:3000 and talks to the API at http://localhost:8000.

Frontend architecture highlights:
- `src/api.js` centralizes the Axios instance with request/response interceptors. It injects the Bearer token and purges auth state/refetches on 401s.
- `AuthProvider` keeps the user + JWT in localStorage, fetches `/users/me`, and exposes `login/register/logout/loading` across the app.
- TanStack Query drives all server interactions:
  - `TransactionList` uses `useQuery` keyed by resource + filters and `useMutation` for deletes with cache invalidation.
  - `ExpenseForm` & `ProfitForm` rely on `useMutation` to post data, reset local state, show Chakra toasts, and invalidate both the transactions + summary queries.
  - `SummaryCards` uses `useQuery` with manual refresh.
- UI uses Chakra components + Tailwind utility touches, lucide-react icons, responsive tabs, summary cards, and auth/login screens.

## Development URLs
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
