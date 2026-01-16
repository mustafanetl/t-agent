#!/usr/bin/env bash
set -euo pipefail

git pull origin main

docker compose down
docker compose up -d --build

./scripts/migrate.sh
