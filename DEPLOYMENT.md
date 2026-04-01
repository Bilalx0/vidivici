# Falcon Car Rental — Deployment Guide

## Part 1 — Local Development (Fix for 500 Errors)

### Root Cause
The API routes were returning 500 because:
1. No `.env` file with a valid `DATABASE_URL`
2. The existing `.env` pointed to PostgreSQL on port `5433` with user `postgres` — both wrong

### What Was Fixed
- Updated `.env` with `DATABASE_URL` pointing to local PostgreSQL on port **5432** using `falcon_user`
- Set a real `AUTH_SECRET` for NextAuth v5
- Created the `falcon_user` PostgreSQL role and `falcon_car_rental` database
- Applied the Prisma migration to create all tables

### Local Quick-Start (after a fresh clone)

```bash
# 1. Install dependencies
npm install

# 2. Set up PostgreSQL database (run once)
sudo -u postgres psql -c "CREATE USER falcon_user WITH PASSWORD 'falcon_local_dev_2026';"
sudo -u postgres psql -c "CREATE DATABASE falcon_car_rental OWNER falcon_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE falcon_car_rental TO falcon_user;"

# 3. Apply migrations
npx prisma migrate deploy

# 4. Generate Prisma client
npx prisma generate

# 5. Seed initial data (admin user + categories + brands)
curl -X POST http://localhost:3000/api/admin/seed

# 6. Start dev server
npm run dev
```

### Local .env (already configured)
```env
DATABASE_URL="postgresql://falcon_user:falcon_local_dev_2026@localhost:5432/falcon_car_rental"
AUTH_SECRET="<your-secret>"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
```

### Admin Login (after seeding)
- URL: `http://localhost:3000/admin/dashboard`
- Email: `admin@falconcarrental.com`
- Password: `admin123`

> **Change the admin password immediately after first login.**

---

## Part 2 — Production Deployment on Namecheap VPS

### Recommended VPS Specs
| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM      | 1 GB    | 2 GB        |
| CPU      | 1 vCPU  | 2 vCPU      |
| Storage  | 20 GB SSD | 40 GB SSD |
| OS       | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

---

### Step 1 — Purchase & Initial VPS Setup

1. Buy a VPS at [namecheap.com/hosting/vps](https://namecheap.com/hosting/vps)
2. Choose **Ubuntu 22.04 LTS**
3. Note the IP address from your Namecheap dashboard
4. SSH into the server:
   ```bash
   ssh root@YOUR_VPS_IP
   ```

5. Create a non-root user:
   ```bash
   adduser deploy
   usermod -aG sudo deploy
   # Copy SSH keys to new user
   rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
   ```

6. Switch to deploy user from now on:
   ```bash
   su - deploy
   ```

---

### Step 2 — Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v   # should be v20.x
npm -v

# Install PM2 (process manager keeps app running)
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Certbot for free HTTPS (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx

# Install Git
sudo apt install -y git
```

---

### Step 3 — Set Up PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside psql — run these commands:
CREATE USER falcon_user WITH PASSWORD 'CHOOSE_A_STRONG_PASSWORD_HERE';
CREATE DATABASE falcon_car_rental OWNER falcon_user;
GRANT ALL PRIVILEGES ON DATABASE falcon_car_rental TO falcon_user;
\q
```

> **Important:** Replace `CHOOSE_A_STRONG_PASSWORD_HERE` with a random strong password. Save it — you'll need it for the `.env` file.

---

### Step 4 — Deploy the Application

```bash
# Clone your repository
cd /home/deploy
git clone https://github.com/Asad-noob69/vidivici.git falcon-car-rental
cd falcon-car-rental

# Install dependencies
npm install

# Create production .env file
nano .env
```

Paste this into the `.env` file (replace ALL placeholder values):

```env
# Database
DATABASE_URL="postgresql://falcon_user:STRONG_PASSWORD@localhost:5432/falcon_car_rental"

# NextAuth — generate secret with: openssl rand -base64 32
AUTH_SECRET="GENERATE_WITH_OPENSSL_RAND_BASE64_32"
NEXTAUTH_URL="https://yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
UPLOAD_DIR="./public/uploads"
```

```bash
# Apply database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Build the Next.js app
npm run build

# Test it starts correctly
npm start
# Press Ctrl+C once you see "Ready" to stop the test
```

---

### Step 5 — Configure PM2 (Process Manager)

```bash
# Start the app with PM2
pm2 start npm --name "falcon-car-rental" -- start

# Save PM2 config so it restarts after server reboots
pm2 save
pm2 startup
# PM2 will print a command — copy and run it (it will look like "sudo env PATH=... pm2 startup...")
```

Useful PM2 commands:
```bash
pm2 status                          # check if app is running
pm2 logs falcon-car-rental          # view live logs
pm2 restart falcon-car-rental       # restart app
pm2 stop falcon-car-rental          # stop app
```

---

### Step 6 — Configure Nginx (Reverse Proxy)

```bash
# Create Nginx config for your site
sudo nano /etc/nginx/sites-available/falcon-car-rental
```

Paste this config (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Max upload size for car images
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
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/falcon-car-rental /etc/nginx/sites-enabled/

# Remove default Nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test the config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### Step 7 — Point Your Domain to the VPS

In your **Namecheap domain DNS settings** (or wherever your domain is registered):

| Type | Host | Value                | TTL  |
|------|------|----------------------|------|
| A    | @    | YOUR_VPS_IP_ADDRESS  | Auto |
| A    | www  | YOUR_VPS_IP_ADDRESS  | Auto |

Wait 5–30 minutes for DNS to propagate before proceeding.

---

### Step 8 — Enable HTTPS (Free SSL via Let's Encrypt)

```bash
# Get SSL certificate (replace yourdomain.com)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts — it will automatically update your Nginx config
# Test auto-renewal
sudo certbot renew --dry-run
```

Your site is now live at `https://yourdomain.com`.

---

### Step 9 — Seed Production Database

Once the site is live, run this once to create the admin user and default data:

```bash
curl -X POST https://yourdomain.com/api/admin/seed
```

Then log in at `https://yourdomain.com/admin/dashboard` with:
- Email: `admin@falconcarrental.com`
- Password: `admin123`

**Change the password immediately from the Settings page.**

---

### Step 10 — Set Up Uploads Directory

```bash
# Create uploads directory for car images
mkdir -p /home/deploy/falcon-car-rental/public/uploads
chmod 755 /home/deploy/falcon-car-rental/public/uploads
```

---

## Updating the App (Future Deployments)

Whenever you push new code to GitHub:

```bash
# SSH into VPS
ssh deploy@YOUR_VPS_IP

cd ~/falcon-car-rental

# Pull latest code
git pull

# Install any new dependencies
npm install

# Apply any new migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart the app (zero downtime)
pm2 restart falcon-car-rental
```

---

## Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| 500 errors on API routes | `pm2 logs falcon-car-rental` — usually a missing env var or DB connection |
| Site not loading | `sudo nginx -t` and `sudo systemctl status nginx` |
| App crashed | `pm2 status` then `pm2 restart falcon-car-rental` |
| DB migrations failed | Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials |
| Images not uploading | Check `public/uploads` directory exists and is writable |

---

## Security Checklist Before Going Live

- [ ] Change `AUTH_SECRET` to a freshly generated value (`openssl rand -base64 32`)
- [ ] Change admin password from `admin123`
- [ ] Set a strong PostgreSQL password (not `falcon_local_dev_2026`)
- [ ] Enable UFW firewall
- [ ] Enable HTTPS with Certbot
- [ ] Ensure `.env` is in `.gitignore` (it is already)
- [ ] Remove or protect the `/api/admin/seed` endpoint after first use
