#!/usr/bin/env bash
set -euo pipefail

echo "Running first boot tasks..."
./scripts/migrate.sh
