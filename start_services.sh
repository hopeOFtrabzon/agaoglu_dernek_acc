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

PYTHON_BIN=""
if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python3)"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python)"
else
  echo "Python 3.11+ is required but neither python3 nor python is available." >&2
  exit 1
fi

BACKEND_DIR="$ROOT_DIR/backend"
BACKEND_VENV="$BACKEND_DIR/.venv"
BACKEND_PYTHON="$BACKEND_VENV/bin/python"
BACKEND_PIP="$BACKEND_VENV/bin/pip"

if [[ ! -x "$BACKEND_PYTHON" ]]; then
  echo "Creating backend virtual environment..."
  "$PYTHON_BIN" -m venv "$BACKEND_VENV"
fi

echo "Installing backend dependencies..."
"$BACKEND_PIP" install -r "$BACKEND_DIR/requirements.txt" >/dev/null

CONTAINER_RUNTIME=""
if command -v docker >/dev/null 2>&1; then
  CONTAINER_RUNTIME="$(command -v docker)"
elif command -v podman >/dev/null 2>&1; then
  CONTAINER_RUNTIME="$(command -v podman)"
else
  echo "Docker or Podman is required but neither is installed." >&2
  exit 1
fi

echo "Using container runtime: $CONTAINER_RUNTIME"

echo "Starting PostgreSQL via container runtime compose..."
"$CONTAINER_RUNTIME" compose up -d

echo "Starting FastAPI backend..."
(
  cd "$BACKEND_DIR"
  if [[ ! -f ".env" ]]; then
    echo "Warning: backend/.env not found; using defaults." >&2
  fi
  "$BACKEND_PYTHON" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
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
