# Strapi CMS Complete Project

A lightweight CMS built with Express.js - **No AWS charges, completely free to deploy!**

## 🚀 Quick Deploy (Free)

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select this repository
5. ✅ Your app will be live in 2 minutes!

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Select this repo
4. Build Command: `cd app && npm install`
5. Start Command: `cd app && npm start`

### Option 3: Vercel
```bash
npx vercel --cwd app
```

## 💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/NawariyaKunal262004/strapi-cms-aws.git
cd strapi-cms-aws

# Install dependencies
cd app
npm install

# Start the server
npm start
```

Visit: http://localhost:1337

## 📁 Project Structure
```
strapi-complete-project/
├── README.md              # This file
├── DEPLOY.md             # Deployment guide
├── railway.json          # Railway config
├── app/                  # Main application
│   ├── enhanced-cms.js   # Server code
│   ├── package.json      # Dependencies
│   └── data.json         # Database file
```

## 🎯 Features
- ✅ Content Management System
- ✅ REST API endpoints
- ✅ Admin authentication
- ✅ File-based database (no setup needed)
- ✅ Responsive admin panel

## 🔗 API Endpoints
- `GET /` - Admin panel
- `GET /api/content` - Get all content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

## 🛠️ Development
```bash
cd app
npm start    # Start server
# Edit enhanced-cms.js to add features
```

**No AWS, no charges, just deploy and use!** 🎉
