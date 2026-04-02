#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_PROCESS="CAMERA_API"
FRONT_PROCESS="CAMERA_FRONT"
LEGACY_PROCESS="CAMERA_SHOP"
BACKEND_PORT="${BACKEND_PORT:-9091}"
FRONTEND_PORT="${FRONTEND_PORT:-3010}"

cd "$ROOT_DIR"

git reset --hard
git checkout master
git pull origin master

if ! command -v yarn >/dev/null 2>&1; then
  npm i yarn -g
fi

if ! command -v serve >/dev/null 2>&1; then
  yarn global add serve
fi

yarn
yarn run build

# Old wrapper process spawned both frontend and backend under one PM2 app.
# Delete it first so it cannot keep a stale backend child on 9091.
pm2 delete "$LEGACY_PROCESS" >/dev/null 2>&1 || true

if pm2 describe "$API_PROCESS" >/dev/null 2>&1; then
  PORT="$BACKEND_PORT" pm2 restart "$API_PROCESS" --update-env
else
  PORT="$BACKEND_PORT" pm2 start server/index.js --name "$API_PROCESS" --cwd "$ROOT_DIR"
fi

if pm2 describe "$FRONT_PROCESS" >/dev/null 2>&1; then
  pm2 restart "$FRONT_PROCESS" --update-env
else
  pm2 start "$(command -v serve)" --name "$FRONT_PROCESS" --cwd "$ROOT_DIR" -- -s build -l "$FRONTEND_PORT"
fi

pm2 save
