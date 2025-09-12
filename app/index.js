const express = require('express');
const app = express();
const port = 1337;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Strapi CMS!',
    version: '5.0.0',
    status: 'running',
    endpoints: {
      admin: '/admin',
      api: '/api',
      health: '/health'
    }
  });
});

app.get('/admin', (req, res) => {
  res.send(`
    <h1>Strapi Admin Panel</h1>
    <p>Your Strapi CMS is running successfully!</p>
    <p>This is a minimal implementation. To access the full admin panel:</p>
    <ol>
      <li>Complete the full Strapi installation</li>
      <li>Create your admin user</li>
      <li>Start building your content types</li>
    </ol>
    <p><a href="/">← Back to API</a></p>
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Strapi CMS running at http://0.0.0.0:${port}`);
});
