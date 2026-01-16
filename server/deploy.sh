#!/usr/bin/env bash
set -euo pipefail

# Deployment script for the VM. Customize as needed.
REPO_DIR="$HOME/apps/t-agent"

cd "$REPO_DIR"
git pull

# If docker-compose.yml or compose.yml exists, rebuild via Docker.
if [[ -f docker-compose.yml || -f compose.yml ]]; then
  docker compose up -d --build
  exit 0
fi

# If this is not a Docker deployment, fall back to Node build.
if [[ -f package.json ]]; then
  npm ci
  npm run build

  # Restart options (choose ONE and uncomment):
  # 1) systemd service:
  # sudo systemctl restart t-agent
  #
  # 2) PM2:
  # pm2 restart t-agent
  #
  # 3) Node process manager you already use:
  # supervisorctl restart t-agent

  exit 0
fi

echo "No docker-compose.yml/compose.yml or package.json found. Nothing to deploy."
