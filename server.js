const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// SQLite setup
const db = new sqlite3.Database('./blog.db');
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT, content TEXT, author TEXT)');
});

// Register
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
        if (err) {
            return res.json({ success: false, message: 'Username already exists.' });
        }
        res.json({ success: true, message: 'Registered successfully!' });
    });
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid credentials.' });
        }
    });
});

// Get posts
app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
        res.json(rows);
    });
});

// Create post
app.post('/posts', (req, res) => {
    const { title, content, author } = req.body;
    db.run('INSERT INTO posts (title, content, author) VALUES (?, ?, ?)', [title, content, author], function(err) {
        if (err) {
            return res.json({ success: false, message: 'Error creating post.' });
        }
        res.json({ success: true, message: 'Post created!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
