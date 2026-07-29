#!/bin/bash
# Bash script to run on the remote EC2 instance
set -e

echo "=== Enabling Swap Memory ==="
if [ ! -f /swapfile ]; then
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap memory enabled successfully."
else
    echo "Swap file already exists."
fi

echo "=== System Updates ==="
sudo apt-get update -y

echo "=== Installing Node.js, MySQL, Nginx, and unzip ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
sudo apt-get install -y mysql-server nginx unzip

echo "=== Configuring MySQL ==="
sudo systemctl start mysql
sudo systemctl enable mysql

# Configure root user with password 'Arut2004@' for both localhost and 127.0.0.1 (Prisma connects via TCP 127.0.0.1)
sudo mysql -u root -p'Arut2004@' -e "CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY 'Arut2004@'; ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY 'Arut2004@'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION; ALTER USER 'root'@'localhost' IDENTIFIED BY 'Arut2004@'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION; FLUSH PRIVILEGES;" || \
sudo mysql -e "CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY 'Arut2004@'; ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY 'Arut2004@'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION; ALTER USER 'root'@'localhost' IDENTIFIED BY 'Arut2004@'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION; FLUSH PRIVILEGES;" || true

# Create database 'medcore'
sudo mysql -u root -p'Arut2004@' -e "CREATE DATABASE IF NOT EXISTS medcore;" || \
sudo mysql -e "CREATE DATABASE IF NOT EXISTS medcore;" || true

echo "=== Setting up project directories ==="
rm -rf /home/ubuntu/medcore-clinic
mkdir -p /home/ubuntu/medcore-clinic
tar -xzf /home/ubuntu/deploy.tar.gz -C /home/ubuntu/medcore-clinic/
rm -f /home/ubuntu/deploy.tar.gz

echo "=== Creating .env file ==="
cat << 'EOF' > /home/ubuntu/medcore-clinic/.env
DATABASE_URL="mysql://root:Arut2004%40@localhost:3306/medcore"
PORT=5000
JWT_SECRET="medcore-secret-jwt-key-2026"
EOF

echo "=== Installing dependencies === "
cd /home/ubuntu/medcore-clinic
# We install all dependencies (including devDependencies) so that tsx is available to run seed/start scripts.
npm install

echo "=== Syncing database schema and seeding data ==="
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts

echo "=== Installing PM2 globally ==="
sudo npm install -g pm2

echo "=== Starting application via PM2 ==="
pm2 stop medcore-clinic || true
pm2 delete medcore-clinic || true
pm2 start npm --name "medcore-clinic" -- run start
pm2 save

echo "=== Configuring Nginx reverse proxy ==="
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name 18.60.40.74.sslip.io _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo "=== Restarting Nginx ==="
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=== Installing Certbot & Configuring SSL (HTTPS) ==="
sudo apt-get update -y
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email -d 18.60.40.74.sslip.io || true

# Clean up remote setup script
rm -f /home/ubuntu/remote_deploy.sh

echo "=== DEPLOYMENT SUCCESSFUL ==="
