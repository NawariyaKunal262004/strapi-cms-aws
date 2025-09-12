#!/bin/bash

# Get server IP from terraform output
SERVER_IP=$(terraform output -raw new_instance_ip 2>/dev/null || echo "3.237.92.147")

echo "🚀 Deploying Enhanced CMS to server: $SERVER_IP"

# Upload application files
scp -i ~/.ssh/strapi-key -r app/* ec2-user@$SERVER_IP:/tmp/

# Deploy to server
ssh -i ~/.ssh/strapi-key ec2-user@$SERVER_IP "
  sudo cp -r /tmp/* /home/strapi/my-strapi-project/ 2>/dev/null || true
  sudo systemctl restart strapi
  sleep 2
  echo '✅ Deployment complete!'
  echo '🌐 Admin Panel: http://$SERVER_IP:1337/admin'
  echo '🔑 Login: admin / admin123'
  echo '📡 API: http://$SERVER_IP:1337/api/content'
"
