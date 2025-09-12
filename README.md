# Strapi CMS Complete Project

## Project Structure
```
strapi-complete-project/
├── README.md              # This file
├── main.tf               # Terraform infrastructure
├── user_data.sh          # Server setup script
├── app/                  # Strapi application
│   ├── index.js         # Main app file
│   ├── package.json     # Dependencies
│   └── node_modules/    # Installed packages
└── .terraform/          # Terraform state
```

## Quick Commands

### Deploy Infrastructure
```bash
terraform init
terraform plan
terraform apply
```

### Deploy Application
```bash
# Upload app to server
scp -i ~/.ssh/strapi-key -r app/* ec2-user@<SERVER_IP>:/tmp/
ssh -i ~/.ssh/strapi-key ec2-user@<SERVER_IP> "sudo cp -r /tmp/* /home/strapi/my-strapi-project/ && sudo systemctl restart strapi"
```

### Development
```bash
cd app
code .
npm start  # Run locally for testing
```

## Current Status
- ✅ Server: 3.237.92.147
- ✅ Live Site: http://3.237.92.147:1337/admin
- ✅ API: http://3.237.92.147:1337/api/content

## Next Steps
1. Edit app/index.js to add features
2. Test locally: `cd app && npm start`
3. Deploy changes to server
4. Access admin panel to manage content
