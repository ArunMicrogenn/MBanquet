# VPS Deployment Guide for 72.61.240.34
**Banquet Hall & Convention Management Suite (Full Stack + Database)**

This guide provides step-by-step instructions to configure, deploy, and run the complete frontend, backend, and database on your VPS (`72.61.240.34`).

---

## 🏗 System Architecture on VPS

- **Frontend**: React 19 SPA + Vite + Tailwind CSS (compiled into static assets in `/dist`)
- **Backend**: Express.js REST API + Vite SSR/Production Middleware (bundled into `/dist/server.cjs`)
  - Endpoints: `/api/health`, `/api/suggest-hall`, `/api/energy-efficiency`, `/api/parse-booking`, `/api/send-email`, `/api/chat`
- **Database**: Cloud Firestore (`ai-studio-banquethallmanag-8d039d7d-24dc-47b7-8f43-0aba69050410`) & Local Storage Fallback polyfill
- **Web Server / Reverse Proxy**: Nginx (port 80 / 443 proxying to internal Node.js port 3000)
- **Process Manager**: PM2 (auto-start on boot, zero-downtime clustering, log management) or Docker

---

## 🚀 Option 1: Quick Automated Deployment (Recommended)

### Step 1: SSH into your VPS
```bash
ssh root@72.61.240.34
```

### Step 2: Clone or Copy the Repository
```bash
# Create application directory
sudo mkdir -p /var/www/banquet-hall
cd /var/www/banquet-hall

# Copy or git clone your project files here
# (e.g. git clone <your-git-repo-url> .)
```

### Step 3: Run the Automated Deployment Script
```bash
chmod +x deploy-vps.sh
sudo ./deploy-vps.sh
```

The script will automatically:
1. Update system packages
2. Install Node.js 20 LTS, npm, and PM2
3. Install dependencies and compile production builds (`npm run build`)
4. Configure Nginx reverse proxy with gzip and caching
5. Open firewall ports (80, 443, 3000, 22)
6. Launch and persist the application with PM2

### Step 4: Verify Deployment
Open your browser and navigate to:
```
http://72.61.240.34
```
Health Check endpoint:
```
http://72.61.240.34/api/health
```

---

## 🐳 Option 2: Docker & Docker Compose Deployment

If your VPS has Docker installed:

```bash
# 1. SSH into the VPS
ssh root@72.61.240.34

# 2. Navigate to project root
cd /var/www/banquet-hall

# 3. Create .env file with your Gemini API key (optional for AI features)
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
echo "APP_URL=http://72.61.240.34" >> .env

# 4. Build and start containers
docker compose up -d --build

# 5. Check container status
docker compose ps
docker compose logs -f
```

---

## ⚙️ Option 3: Manual Step-by-Step Configuration

If you prefer manual setup without scripts:

### 1. Install Node.js 20 & Nginx
```bash
sudo apt-get update -y
sudo apt-get install -y curl git ufw nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### 2. Build the Application
```bash
cd /var/www/banquet-hall
npm ci
npm run build
```

### 3. Configure Nginx
Create `/etc/nginx/sites-available/banquet-hall`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 72.61.240.34;

    client_max_body_size 25M;
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

Enable the configuration:
```bash
sudo ln -sf /etc/nginx/sites-available/banquet-hall /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Start with PM2
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## 🗄 Database Configuration

The application uses **Cloud Firestore** for structured multi-tenant persistence and client synchronization:
- Database ID: `ai-studio-banquethallmanag-8d039d7d-24dc-47b7-8f43-0aba69050410`
- Config file: `firebase-applet-config.json` (already pre-bundled and packaged in `/dist`)
- Rules file: `firestore.rules`

When deployed on your VPS, the web client communicates directly with Firestore securely through Firebase Authentication and client SDK.

---

## 🔒 Enabling SSL (HTTPS) with Let's Encrypt (Optional)

When you point a domain name (e.g. `banquet.yourcompany.com`) to `72.61.240.34`:

```bash
# 1. Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 2. Obtain and install SSL certificate automatically
sudo certbot --nginx -d banquet.yourcompany.com

# 3. Certbot will automatically renew certificates via systemd timer
sudo systemctl status certbot.timer
```

---

## 🛠 Useful Management Commands on VPS

| Action | Command |
|---|---|
| View application logs | `pm2 logs banquet-management-suite` |
| Monitor CPU & Memory | `pm2 monit` |
| Restart backend & frontend | `pm2 restart banquet-management-suite` |
| Reload Nginx configuration | `sudo nginx -s reload` |
| Test health endpoint | `curl http://localhost:3000/api/health` |
