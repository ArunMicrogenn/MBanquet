#!/bin/bash
# ==============================================================================
# Automated VPS Deployment Script for Banquet Hall Management ERP
# Target VPS IP: 72.61.240.34
# ==============================================================================

set -e

echo "======================================================================"
echo " Starting Automated Deployment on VPS 72.61.240.34"
echo "======================================================================"

# 1. Update system packages
echo "[1/7] Updating system package index..."
sudo apt-get update -y
sudo apt-get install -y curl git build-essential ufw nginx

# 2. Install Node.js 20 LTS (if not present or older)
echo "[2/7] Checking Node.js environment..."
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 20 ]]; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# 3. Install Global PM2 Process Manager
echo "[3/7] Ensuring PM2 is installed globally..."
sudo npm install -g pm2

# 4. Set Application Directory
APP_DIR="/var/www/banquet-hall"
echo "[4/7] Setting up application in ${APP_DIR}..."
sudo mkdir -p "${APP_DIR}"

# If current directory is the project, sync files to APP_DIR
if [ -f "./package.json" ]; then
    echo "Copying source files to ${APP_DIR}..."
    sudo cp -r ./* "${APP_DIR}/" 2>/dev/null || true
    sudo cp -r ./.env* "${APP_DIR}/" 2>/dev/null || true
fi

cd "${APP_DIR}"

# 5. Install Dependencies and Build Application
echo "[5/7] Installing npm packages & compiling production build..."
npm ci || npm install
npm run build

# 6. Configure Nginx Reverse Proxy for 72.61.240.34
echo "[6/7] Configuring Nginx Reverse Proxy..."
if [ -f "./nginx.vps.conf" ]; then
    sudo cp ./nginx.vps.conf /etc/nginx/sites-available/banquet-hall
else
    sudo cat << 'EOF' > /etc/nginx/sites-available/banquet-hall
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
EOF
fi

sudo ln -sf /etc/nginx/sites-available/banquet-hall /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 7. Configure Firewall (UFW)
echo "[7/7] Configuring Firewall..."
sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw allow 3000/tcp || true
sudo ufw --force enable || true

# 8. Start/Restart Application via PM2
echo "Starting Application with PM2..."
pm2 stop banquet-management-suite 2>/dev/null || true
pm2 delete banquet-management-suite 2>/dev/null || true
pm2 start ./ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "======================================================================"
echo " Deployment Successfully Completed!"
echo " Access URL: http://72.61.240.34"
echo " Health Status: http://72.61.240.34/api/health"
echo " PM2 Dashboard: Run 'pm2 status' or 'pm2 logs'"
echo "======================================================================"
