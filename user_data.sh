#!/bin/bash
yum update -y

# Install Node.js 18 (LTS)
dnf install -y nodejs npm git

# Create strapi user
useradd -m strapi
usermod -aG wheel strapi

# Create Strapi project directory
sudo -u strapi mkdir -p /home/strapi/my-strapi-project
cd /home/strapi/my-strapi-project

# Create Strapi project as strapi user
sudo -u strapi bash -c "
cd /home/strapi/my-strapi-project
npm init -y
npm install @strapi/strapi@latest sqlite3
npx create-strapi-app@latest . --quickstart --no-run --skip-cloud
"

# Create systemd service
cat > /etc/systemd/system/strapi.service << EOF
[Unit]
Description=Strapi CMS
After=network.target

[Service]
Type=simple
User=strapi
WorkingDirectory=/home/strapi/my-strapi-project
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl enable strapi
systemctl start strapi
