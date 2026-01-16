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

---

## Stripe webhook setup

1. Go to **Stripe Dashboard → Developers → Webhooks**.
2. Add endpoint: `https://arzum.ai/api/stripe/webhook`.
3. Copy the webhook secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## GitHub Actions auto-deploy

### 1) Server deploy script
`./scripts/deploy.sh` will:
- pull latest code
- rebuild containers
- run migrations + seed

### 2) Add repo secrets
In GitHub → **Settings → Secrets and variables → Actions**, add:
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

### 3) Workflow
The workflow is in `.github/workflows/deploy.yml` and runs on every push to `main`.

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
