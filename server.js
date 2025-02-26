// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize (or create) SQLite database
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the blog database.');
  }
});

// Create the posts table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.error('Error creating table:', err.message);
  }
);

// API Endpoints

// Get all posts
app.get('/api/posts', (req, res) => {
  const sql = 'SELECT * FROM posts ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ posts: rows });
  });
});

// Get a single post
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM posts WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ post: row });
  });
});

// Create a new post
app.post('/api/posts', (req, res) => {
    console.log('Received POST request:', req.body);
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required.' });
    return;
  }
  const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';
  db.run(sql, [title, content], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, title, content });
  });
});

// Update a post
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required.' });
    return;
  }
  const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
  db.run(sql, [title, content, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ message: 'Post updated' });
  });
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM posts WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
