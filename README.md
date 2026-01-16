# arzum.ai — AI trip planner & Europe flight-deals map

Production-ready Next.js 14 app with Mapbox, Prisma, Stripe subscriptions, Resend email alerts, and a Gemini-powered itinerary planner.

## Stack
- **Next.js 14 (App Router)** + TypeScript
- **Tailwind CSS** + shadcn/ui-style components
- **Mapbox GL JS** (Europe deals map)
- **PostgreSQL** + **Prisma**
- **Auth:** NextAuth Credentials (email + password)
- **Payments:** Stripe subscriptions + webhook
- **Email:** Resend
- **AI planning:** Gemini (strict JSON + Zod validation)

---

## Local development

### 1) Install dependencies
```bash
npm install
```

### 2) Create `.env`
```bash
cp .env.example .env
```
Fill in values. Minimum to run locally:
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` (optional; map shows placeholder without it)

### 3) Start Postgres (Docker optional)
```bash
docker compose up -d db
```

### 4) Migrate + seed
```bash
npm run prisma:generate
./scripts/migrate.sh
```

### 5) Run the app
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Production deploy on Google Cloud (Ubuntu 24.04)

### 1) Create VM + open ports
- Create a Google Compute Engine VM (Ubuntu 24.04).
- Allow inbound **TCP 80/443** (HTTP/HTTPS).

### 2) Install Docker + Compose
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### 3) Clone repo
```bash
sudo mkdir -p /var/www/arzum-ai
sudo chown $USER:$USER /var/www/arzum-ai
cd /var/www/arzum-ai

git clone https://github.com/YOUR_ORG/arzum-ai.git .
```

### 4) Add `.env`
```bash
cp .env.example .env
nano .env
```
Fill in production values (Stripe, Resend, Gemini, Mapbox, etc.).

### 5) Configure DNS
Add A records for:
- `arzum.ai` → VM external IP
- `www.arzum.ai` → VM external IP

### 6) Start services
```bash
docker compose up -d --build
```

### 7) Run migrations + seed
```bash
./scripts/migrate.sh
```

### 8) Set Stripe webhook endpoint
Add a webhook in Stripe:
```
https://arzum.ai/api/stripe/webhook
```
Listen for:
- `checkout.session.completed`
- `customer.subscription.deleted`

### 9) Verify HTTPS
Caddy will automatically obtain SSL certs. Visit:
```
https://arzum.ai
```

If you are validating via public IP before DNS is ready, you can visit:
```
http://<SERVER_PUBLIC_IP>
```
The Caddyfile includes an HTTP catch-all on port 80 so you do not need `:3000` for this check.

---

## Stripe webhook setup

1. Go to **Stripe Dashboard → Developers → Webhooks**.
2. Add endpoint: `https://arzum.ai/api/stripe/webhook`.
3. Copy the webhook secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## GitHub Actions auto-deploy

### 1) Server deploy script
Use `server/deploy.sh` on the VM (or the root `deploy.sh` wrapper). It will:
- pull latest code
- run `docker compose up -d --build` when a compose file is present
- otherwise run `npm ci` + `npm run build` (and expects you to wire a restart command)

### 2) Add repo secrets
In GitHub → **Settings → Secrets and variables → Actions**, add:
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

### 3) Workflow
The workflow is in `.github/workflows/deploy.yml` and runs on every push to `main`.

---

## Auto-deploy from GitHub to Google Cloud (A→Z)

Follow these exact steps to set up SSH-based deployments from GitHub Actions.

### 1) On your laptop: create a deploy key
```bash
ssh-keygen -t ed25519 -f ~/.ssh/arzum_actions
```

### 2) On the VM (as `deploy`): create SSH directory and authorized_keys
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
Then paste the public key from your laptop into `~/.ssh/authorized_keys`:
```bash
nano ~/.ssh/authorized_keys
```

### 3) Add GitHub secrets
In GitHub → **Settings → Secrets and variables → Actions**, add:
- `SERVER_HOST=35.246.230.74`
- `SERVER_USER=deploy`
- `SERVER_SSH_KEY=PASTE_YOUR_PRIVATE_KEY_HERE`

### 4) Prepare the VM repo and deploy script
```bash
mkdir -p ~/apps
git clone https://github.com/mustafanetl/t-agent.git ~/apps/t-agent
ln -s ~/apps/t-agent/server/deploy.sh ~/apps/t-agent/deploy.sh
```

### 5) Commit and push the workflow
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deploy workflow"
git push origin main
```

### 6) Trigger a test deploy
Push any commit to `main`, then watch **GitHub Actions → Deploy**. The workflow will run:
```bash
bash ~/apps/t-agent/deploy.sh
```

### 7) Troubleshooting
- **Permission denied (publickey):** confirm the public key is in `~/.ssh/authorized_keys` on the VM and the GitHub secret uses the matching private key.
- **Host key verification failed:** SSH into the VM once from your laptop to accept the host key.
- **Docker permission denied:** run `newgrp docker` or log out/in after `usermod -aG docker deploy`.

---

## Useful commands

```bash
# Start locally
npm run dev

# Run migrations in prod
./scripts/migrate.sh

# Start worker only
npm run worker
```

---

## Notes
- The app runs without live flight provider keys (mock provider fallback).
- Mapbox token is optional for UI; map placeholder appears without it.
- Gemini responses are validated with Zod. Invalid outputs fall back to a safe plan.
