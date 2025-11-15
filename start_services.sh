#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd)"
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  if [[ -n "$BACKEND_PID" && -e /proc/$BACKEND_PID ]]; then
    echo "Stopping backend (PID $BACKEND_PID)"
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "$FRONTEND_PID" && -e /proc/$FRONTEND_PID ]]; then
    echo "Stopping frontend (PID $FRONTEND_PID)"
    kill "$FRONTEND_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed." >&2
  exit 1
fi

echo "Starting PostgreSQL via docker compose..."
docker compose up -d

echo "Starting FastAPI backend..."
(
  cd backend
  if [[ ! -f ".env" ]]; then
    echo "Warning: backend/.env not found; using defaults." >&2
  fi
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) &
BACKEND_PID=$!

echo "Starting Vite frontend..."
(
  cd frontend
  npm install >/dev/null
  npm run dev -- --host 0.0.0.0 --port 3000
) &
FRONTEND_PID=$!

wait
