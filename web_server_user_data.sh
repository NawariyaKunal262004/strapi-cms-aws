#!/bin/bash
yum update -y
yum install -y httpd

systemctl start httpd
systemctl enable httpd

cat > /var/www/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Automated Web Server</title>
</head>
<body>
    <h1>🚀 Automated Web Server Deployment</h1>
    <p>Deployed using EC2 User Data & Launch Templates</p>
    <p>Server Time: $(date)</p>
</body>
</html>
EOF
