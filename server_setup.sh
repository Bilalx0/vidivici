#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

# ─── CONFIG ───────────────────────────────────────────────────────────────────
SERVER_IP="66.29.143.99"
DB_PASS="FalconPr0d2026X9"
APP_DIR="/var/www/falcon-car-rental"
REPO_URL="https://github.com/Asad-noob69/vidivici.git"
# ──────────────────────────────────────────────────────────────────────────────

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
step() { echo -e "\n${GREEN}━━━ $1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

step "[1/16] System update"
apt-get update -y 2>&1 | tail -3
apt-get upgrade -y \
  -o Dpkg::Options::="--force-confdef" \
  -o Dpkg::Options::="--force-confold" 2>&1 | tail -3
log "System updated"

step "[2/16] Create 2GB swap (prevents OOM on small VPS)"
if [ ! -f /swapfile ]; then
  if fallocate -l 2G /swapfile 2>/dev/null; then
    chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "Swap created"
  else
    warn "fallocate failed, trying dd (slower)..."
    dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "Swap created via dd"
  fi
else
  warn "Swap already exists, skipping"
fi

step "[3/16] Install Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>&1 | tail -5
apt-get install -y nodejs 2>&1 | tail -5
log "Node $(node -v) | npm $(npm -v)"

step "[4/16] Install system packages"
apt-get install -y git nginx unzip curl 2>&1 | tail -5
log "git, nginx, unzip, curl installed"

step "[5/16] Install PM2"
npm install -g pm2 2>&1 | tail -5
log "PM2 $(pm2 -v) installed"

step "[6/16] Install & start PostgreSQL"
apt-get install -y postgresql postgresql-contrib 2>&1 | tail -5
systemctl start postgresql
systemctl enable postgresql
sleep 3
log "PostgreSQL started"

step "[7/16] Create DB user & database"
sudo -u postgres psql -c "CREATE USER falcon_user WITH PASSWORD '${DB_PASS}';" 2>/dev/null \
  && log "DB user falcon_user created" \
  || warn "User may already exist — continuing"

sudo -u postgres psql -c "CREATE DATABASE falcon_car_rental OWNER falcon_user;" 2>/dev/null \
  && log "Database falcon_car_rental created" \
  || warn "DB may already exist — continuing"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE falcon_car_rental TO falcon_user;" 2>/dev/null
log "PostgreSQL ready: falcon_car_rental @ localhost:5432"

step "[8/16] Clone repository"
mkdir -p /var/www
rm -rf "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"
log "Cloned to $APP_DIR"

step "[9/16] Install npm packages"
cd "$APP_DIR"
npm install 2>&1 | tail -10
log "npm packages installed"

step "[10/16] Write .env"
AUTH_SECRET=$(openssl rand -base64 32)
cat > "$APP_DIR/.env" << ENVEOF
DATABASE_URL="postgresql://falcon_user:${DB_PASS}@localhost:5432/falcon_car_rental"
AUTH_SECRET="${AUTH_SECRET}"
NEXTAUTH_URL="http://${SERVER_IP}"
NEXT_PUBLIC_APP_URL="http://${SERVER_IP}"
UPLOAD_DIR="./public/uploads"
ENVEOF
log ".env written (AUTH_SECRET generated via openssl)"

step "[11/16] Create uploads directory"
mkdir -p "$APP_DIR/public/uploads"
chmod 755 "$APP_DIR/public/uploads"
log "Uploads directory ready"

step "[12/16] Prisma — migrate & generate"
cd "$APP_DIR"
npx prisma migrate deploy
npx prisma generate
log "Prisma migrations applied & client generated"

step "[13/16] Build Next.js"
cd "$APP_DIR"
export NODE_OPTIONS="--max-old-space-size=1500"
npm run build
log "Next.js build complete"

step "[14/16] Start with PM2"
cd "$APP_DIR"
pm2 delete "falcon-car-rental" 2>/dev/null || true
NODE_ENV=production pm2 start npm --name "falcon-car-rental" -- start
pm2 save
# Set up PM2 to auto-start on server reboot
pm2 startup systemd -u root --hp /root 2>&1 | tail -5
pm2 save
systemctl enable pm2-root 2>/dev/null || true
log "PM2 process started and registered for auto-start"

step "[15/16] Configure Nginx reverse proxy"
cat > /etc/nginx/sites-available/falcon-car-rental << 'NGINXEOF'
server {
    listen 80 default_server;
    server_name _;

    # Allow large image uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/falcon-car-rental /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx
log "Nginx configured and running"

step "[16/16] Install ngrok"
if which ngrok > /dev/null 2>&1; then
  warn "ngrok already installed"
else
  # Try official apt repo first
  if curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
       | tee /etc/apt/trusted.gpg.d/ngrok.asc > /dev/null 2>&1 \
     && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
       | tee /etc/apt/sources.list.d/ngrok.list \
     && apt-get update -y 2>&1 | tail -3 \
     && apt-get install -y ngrok 2>&1 | tail -5; then
    log "ngrok installed via apt"
  else
    warn "apt method failed — trying snap..."
    apt-get install -y snapd 2>/dev/null | tail -3
    snap install ngrok 2>/dev/null && log "ngrok installed via snap" \
      || warn "ngrok could not be installed automatically — run 'snap install ngrok' manually later"
  fi
fi

# ────────────────────────────────────────────────────────────────
log "Waiting 20s for Next.js to fully boot before seeding..."
sleep 20

SEED_CODE=$(curl -s -o /tmp/seed_response.txt -w "%{http_code}" \
  -X POST http://localhost:3000/api/admin/seed 2>/dev/null || echo "000")

if [[ "$SEED_CODE" == "200" || "$SEED_CODE" == "201" ]]; then
  log "Database seeded! Admin account created."
else
  warn "Seed HTTP $SEED_CODE — try manually: curl -X POST http://${SERVER_IP}/api/admin/seed"
  cat /tmp/seed_response.txt 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗"
echo "║         ✅  FALCON CAR RENTAL — LIVE!               ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║                                                      ║"
echo "║  🌐 Site:    http://${SERVER_IP}               ║"
echo "║  🔒 Admin:   http://${SERVER_IP}/admin/dashboard    ║"
echo "║  📧 Email:   admin@falconcarrental.com               ║"
echo "║  🔑 Pass:    admin123  ← CHANGE THIS FIRST!          ║"
echo "║                                                      ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  🗄  DB User:  falcon_user                           ║"
echo "║  🗄  DB Pass:  ${DB_PASS}               ║"
echo "║  🗄  DB Name:  falcon_car_rental                     ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  USEFUL COMMANDS                                     ║"
echo "║  pm2 status               # check app               ║"
echo "║  pm2 logs falcon-car-rental  # live logs            ║"
echo "║  pm2 restart falcon-car-rental  # restart           ║"
echo "║  systemctl status nginx   # nginx status            ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  NGROK (free HTTPS tunnel):                          ║"
echo "║  1. Sign up at https://ngrok.com (free)             ║"
echo "║  2. ngrok config add-authtoken <your_token>         ║"
echo "║  3. ngrok http 80                                   ║"
echo "║  4. Update .env NEXTAUTH_URL + restart PM2          ║"
echo "╚══════════════════════════════════════════════════════╝${NC}"
