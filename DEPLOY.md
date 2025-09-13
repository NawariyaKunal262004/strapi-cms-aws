# Deploy to Railway (Free)

## Steps:
1. Push to GitHub
2. Go to railway.app
3. Sign up with GitHub
4. Click "Deploy from GitHub repo"
5. Select this repository
6. Railway will auto-deploy

## Alternative: Render (Free)
1. Push to GitHub  
2. Go to render.com
3. Connect GitHub repo
4. Set build command: `cd app && npm install`
5. Set start command: `cd app && npm start`

## Alternative: Vercel (Free)
```bash
npm install -g vercel
vercel --cwd app
```

Your app will be live at the provided URL!
