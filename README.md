# AI trip planner & Europe flight-deals map

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
sudo mkdir -p /var/www/t-agent
sudo chown $USER:$USER /var/www/t-agent
cd /var/www/t-agent

git clone https://github.com/mustafanetl/t-agent.git .
```

### 4) Add `.env`
```bash
cp .env.example .env
nano .env
```
Fill in production values (Stripe, Resend, Gemini, Mapbox, etc.).

### 5) Start services
```bash
docker compose up -d --build
```

### 6) Run migrations + seed
```bash
./scripts/migrate.sh
```

### 7) Verify HTTP on the VM IP (port 80)
Visit the app via the VM public IP:
```
http://35.246.230.74
```
The Caddyfile listens on port 80 so you do not need `:3000`.

---

## Stripe webhook setup

1. Go to **Stripe Dashboard → Developers → Webhooks**.
2. This requires a domain + HTTPS. If you are running on IP only, skip webhook setup for now.
3. When ready, add endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`.
4. Copy the webhook secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## Install & run on a fresh Ubuntu 24.04 VM (Google Cloud) — A→Z

This section shows how to install the app manually on a new Ubuntu 24.04 VM and run it on the
server public IP using port 80 (no `:3000`).

### 1) Create the VM + open ports
- Create a Google Compute Engine VM (Ubuntu 24.04).
- Allow inbound **TCP 80/443** in the VM firewall rules.

### 2) SSH into the VM and bootstrap
```bash
ssh deploy@YOUR_SERVER_IP
```
Then run:
```bash
cd ~
curl -fsSL https://raw.githubusercontent.com/mustafanetl/t-agent/main/server/bootstrap_ubuntu.sh -o bootstrap_ubuntu.sh
chmod +x bootstrap_ubuntu.sh
./bootstrap_ubuntu.sh
```
The script installs required packages, Docker (if needed), and clones the repo into `~/apps/t-agent`.

### 3) Configure environment variables
```bash
cd ~/apps/t-agent
cp .env.example .env
nano .env
```
Set production values. Minimum to boot:
- `DATABASE_URL`
- `NEXTAUTH_URL` (set to your VM IP, e.g. `http://35.246.230.74`)
- `AUTH_SECRET`

### 4) Start the stack on port 80
```bash
docker compose up -d --build
```
Caddy listens on ports 80/443 and proxies to the app, so you can open:
```
http://YOUR_SERVER_IP
```

### 5) Run migrations + seed
```bash
./scripts/migrate.sh
```

### Troubleshooting
- **Port 80 not reachable:** ensure GCP firewall allows TCP 80 and your VM has no local firewall blocking it.
- **Docker permission denied:** run `newgrp docker` or log out/in after the bootstrap script.

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
