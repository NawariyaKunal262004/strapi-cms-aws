const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 1337;

app.use(express.json());
app.use(express.static('public'));

// File-based database
const dbPath = path.join(__dirname, 'data.json');
let db = { 
  content: [], 
  users: [{ id: 1, username: 'admin', password: 'admin123' }],
  sessions: []
};

// Load/Save database
if (fs.existsSync(dbPath)) {
  try { db = JSON.parse(fs.readFileSync(dbPath, 'utf8')); } catch (e) {}
}
const saveDB = () => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !db.sessions.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Auth routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = 'token_' + Date.now();
  db.sessions.push(token);
  saveDB();
  res.json({ token, user: { id: user.id, username: user.username } });
});

// Content API
app.get('/api/content', (req, res) => {
  res.json({ data: db.content });
});

app.post('/api/content', auth, (req, res) => {
  const newContent = { 
    id: Date.now(), 
    ...req.body, 
    createdAt: new Date().toISOString(),
    status: 'published'
  };
  db.content.push(newContent);
  saveDB();
  res.json({ data: newContent });
});

app.put('/api/content/:id', auth, (req, res) => {
  const index = db.content.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  db.content[index] = { ...db.content[index], ...req.body, updatedAt: new Date().toISOString() };
  saveDB();
  res.json({ data: db.content[index] });
});

app.delete('/api/content/:id', auth, (req, res) => {
  const index = db.content.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  db.content.splice(index, 1);
  saveDB();
  res.json({ message: 'Deleted' });
});

// Admin Panel
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Strapi CMS Admin</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .login-form, .content-form { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .content-item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        button { background: #007cba; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #005a87; }
        input, textarea { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
        .hidden { display: none; }
        .header { display: flex; justify-content: space-between; align-items: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Strapi CMS Admin</h1>
          <div id="userInfo" class="hidden">
            <span id="username"></span> | <button onclick="logout()">Logout</button>
          </div>
        </div>

        <div id="loginSection">
          <div class="login-form">
            <h2>Login</h2>
            <input type="text" id="loginUsername" placeholder="Username" value="admin">
            <input type="password" id="loginPassword" placeholder="Password" value="admin123">
            <button onclick="login()">Login</button>
          </div>
        </div>

        <div id="adminSection" class="hidden">
          <div class="content-form">
            <h2>Add Content</h2>
            <input type="text" id="title" placeholder="Title" required>
            <textarea id="description" placeholder="Description" rows="4"></textarea>
            <input type="text" id="category" placeholder="Category">
            <button onclick="addContent()">Add Content</button>
          </div>

          <div>
            <h2>Content Management</h2>
            <div id="contentList"></div>
          </div>
        </div>
      </div>

      <script>
        let token = localStorage.getItem('token');
        
        if (token) {
          showAdmin();
          loadContent();
        }

        async function login() {
          const username = document.getElementById('loginUsername').value;
          const password = document.getElementById('loginPassword').value;
          
          try {
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({username, password})
            });
            
            if (res.ok) {
              const data = await res.json();
              token = data.token;
              localStorage.setItem('token', token);
              document.getElementById('username').textContent = data.user.username;
              showAdmin();
              loadContent();
            } else {
              alert('Invalid credentials');
            }
          } catch (e) {
            alert('Login failed');
          }
        }

        function logout() {
          token = null;
          localStorage.removeItem('token');
          document.getElementById('loginSection').classList.remove('hidden');
          document.getElementById('adminSection').classList.add('hidden');
          document.getElementById('userInfo').classList.add('hidden');
        }

        function showAdmin() {
          document.getElementById('loginSection').classList.add('hidden');
          document.getElementById('adminSection').classList.remove('hidden');
          document.getElementById('userInfo').classList.remove('hidden');
        }

        async function addContent() {
          const title = document.getElementById('title').value;
          const description = document.getElementById('description').value;
          const category = document.getElementById('category').value;
          
          if (!title) return alert('Title required');
          
          try {
            await fetch('/api/content', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify({title, description, category})
            });
            
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            document.getElementById('category').value = '';
            loadContent();
          } catch (e) {
            alert('Failed to add content');
          }
        }

        async function deleteContent(id) {
          if (!confirm('Delete this content?')) return;
          
          try {
            await fetch(\`/api/content/\${id}\`, {
              method: 'DELETE',
              headers: {'Authorization': token}
            });
            loadContent();
          } catch (e) {
            alert('Failed to delete');
          }
        }

        async function loadContent() {
          try {
            const res = await fetch('/api/content');
            const data = await res.json();
            
            document.getElementById('contentList').innerHTML = data.data.map(item => \`
              <div class="content-item">
                <h3>\${item.title}</h3>
                <p>\${item.description || 'No description'}</p>
                <small>Category: \${item.category || 'None'} | Created: \${new Date(item.createdAt).toLocaleDateString()}</small>
                <br><button onclick="deleteContent(\${item.id})" style="background: #dc3545; margin-top: 10px;">Delete</button>
              </div>
            \`).join('');
          } catch (e) {
            console.error('Failed to load content');
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Public API
app.get('/', (req, res) => {
  res.json({
    message: 'Strapi CMS API',
    version: '2.0.0',
    endpoints: {
      admin: '/admin',
      content: '/api/content',
      login: '/api/login'
    },
    stats: {
      totalContent: db.content.length,
      categories: [...new Set(db.content.map(c => c.category).filter(Boolean))]
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.listen(port, 'localhost', () => {
  console.log(`🚀 Enhanced Strapi CMS running at http://localhost:${port}`);
  console.log(`📊 Admin Panel: http://localhost:${port}/admin`);
  console.log(`🔑 Default login: admin / admin123`);
});
