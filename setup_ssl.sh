#!/bin/bash
set -e

echo "=== Updating Nginx site config ==="
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name 18.60.40.74.sslip.io;

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

echo "=== Testing and restarting Nginx ==="
sudo nginx -t
sudo systemctl restart nginx

echo "=== Installing Certbot if not installed ==="
sudo apt-get update -y
sudo apt-get install -y certbot python3-certbot-nginx

echo "=== Requesting SSL Certificate from Let's Encrypt ==="
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email -d 18.60.40.74.sslip.io

echo "=== SSL setup complete! ==="
