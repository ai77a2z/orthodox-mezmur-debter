const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key_here'; // Change this to a secure value in production

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Get all hymns
app.get('/api/hymns', (req, res) => {
  db.all('SELECT * FROM hymns ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get a single hymn by ID
app.get('/api/hymns/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM hymns WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Hymn not found.' });
    res.json(row);
  });
});

// Submit new lyrics
app.post('/api/submit-lyrics', (req, res) => {
  const { title, author, lyrics } = req.body;
  if (!title || !lyrics) {
    return res.status(400).json({ error: 'Title and lyrics are required.' });
  }
  db.run(
    'INSERT INTO submissions (type, title, author, lyrics) VALUES (?, ?, ?, ?)',
    ['lyrics', title, author || '', lyrics],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Submit new song title
app.post('/api/submit-title', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  db.run(
    'INSERT INTO submissions (type, title) VALUES (?, ?)',
    ['title', title],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// List all unapproved submissions
app.get('/api/submissions', (req, res) => {
  db.all('SELECT * FROM submissions WHERE approved = 0 ORDER BY created_at ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Approve a submission
app.post('/api/submissions/:id/approve', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM submissions WHERE id = ?', [id], (err, submission) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!submission) return res.status(404).json({ error: 'Submission not found.' });
    if (submission.type === 'lyrics') {
      // Insert into hymns table
      db.run(
        'INSERT INTO hymns (title, author, lyrics) VALUES (?, ?, ?)',
        [submission.title, submission.author, submission.lyrics],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          // Mark submission as approved
          db.run('UPDATE submissions SET approved = 1 WHERE id = ?', [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, hymnId: this.lastID });
          });
        }
      );
    } else {
      // Just mark as approved for title submissions
      db.run('UPDATE submissions SET approved = 1 WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    }
  });
});

// Delete a submission
app.delete('/api/submissions/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM submissions WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user) return res.status(409).json({ error: 'Username already exists.' });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err.message });
      db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hash],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          const userId = this.lastID;
          const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
          res.json({ token, username });
        }
      );
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });
    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(401).json({ error: 'Invalid username or password.' });
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, username: user.username });
    });
  });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT username, email, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
