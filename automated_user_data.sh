#!/bin/bash
yum update -y

# Install web server and Node.js
dnf install -y httpd nodejs npm git

# Start and enable Apache
systemctl start httpd
systemctl enable httpd

# Create web content
cat > /var/www/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Automated Web Server</title>
</head>
<body>
    <h1>🚀 Automated Web Server Deployment Success!</h1>
    <p>Server deployed using EC2 User Data & Launch Templates</p>
    <p>Timestamp: $(date)</p>
    <p>Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</p>
</body>
</html>
EOF

# Install and setup Strapi
useradd -m strapi
sudo -u strapi mkdir -p /home/strapi/app
cd /home/strapi/app

sudo -u strapi bash -c "
npm init -y
npm install @strapi/strapi@latest
npx create-strapi-app@latest . --quickstart --no-run
"

# Create Strapi service
cat > /etc/systemd/system/strapi.service << EOF
[Unit]
Description=Strapi CMS
After=network.target

[Service]
Type=simple
User=strapi
WorkingDirectory=/home/strapi/app
ExecStart=/usr/bin/npm run start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl enable strapi
systemctl start strapi

# Log deployment completion
echo "$(date): Automated deployment completed" >> /var/log/deployment.log
