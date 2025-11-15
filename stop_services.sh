#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

stop_service_on_port() {
  local name="$1"
  local port="$2"
  if PIDS="$(lsof -tiTCP:$port -sTCP:LISTEN 2>/dev/null)"; then
    echo "Stopping $name on port $port (PIDs: $PIDS)"
    # shellcheck disable=SC2086
    kill $PIDS >/dev/null 2>&1 || true
  else
    echo "No $name process listening on port $port."
  fi
}

cd "$ROOT_DIR"

echo "Stopping FastAPI backend..."
stop_service_on_port "FastAPI backend" 8000

echo "Stopping Vite frontend..."
stop_service_on_port "Vite frontend" 3000

CONTAINER_RUNTIME=""
if command -v docker >/dev/null 2>&1; then
  CONTAINER_RUNTIME="$(command -v docker)"
elif command -v podman >/dev/null 2>&1; then
  CONTAINER_RUNTIME="$(command -v podman)"
else
  echo "Docker or Podman is required to stop the database containers but neither is installed." >&2
  exit 1
fi

echo "Stopping PostgreSQL via container runtime compose..."
"$CONTAINER_RUNTIME" compose down
