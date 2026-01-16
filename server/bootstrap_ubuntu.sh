#!/usr/bin/env bash
set -euo pipefail

# Run this script ON the VM as the deploy user.

sudo apt update
sudo apt -y upgrade
sudo apt -y install git ufw curl ca-certificates

# Install Docker + compose plugin (needed only if you use docker-compose.yml/compose.yml).
if ! command -v docker >/dev/null 2>&1; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update
  sudo apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

# Ensure deploy user can run Docker without sudo.
sudo usermod -aG docker "$USER"

# Create apps dir and clone repo if missing.
mkdir -p "$HOME/apps"
if [[ ! -d "$HOME/apps/t-agent/.git" ]]; then
  git clone https://github.com/mustafanetl/t-agent.git "$HOME/apps/t-agent"
fi

# Prepare SSH directory and permissions.
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"

cat <<'INSTRUCTIONS'

Next steps:
1) Add YOUR public key to ~/.ssh/authorized_keys on this VM:
   - Use: nano ~/.ssh/authorized_keys
   - Paste the public key from your laptop.

2) Create a deploy script on the VM if you want to override defaults:
   - ~/apps/t-agent/server/deploy.sh
   - Or symlink: ln -s ~/apps/t-agent/server/deploy.sh ~/apps/t-agent/deploy.sh

3) For Docker deployments, log out/in (or run: newgrp docker) to apply group changes.

INSTRUCTIONS
