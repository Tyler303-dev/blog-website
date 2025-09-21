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
// ...existing code...



// WebSocket server for live notifications
const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let notificationCount = 1;
wss.on('connection', ws => {
    ws.send('Welcome to 5 Star Space Learning District!');
    // Example: send a notification every 10 seconds
    const interval = setInterval(() => {
        ws.send(`Live Notification #${notificationCount++}`);
    }, 10000);
    ws.on('close', () => clearInterval(interval));
});

server.listen(PORT, () => {
    console.log(`Server and WebSocket running on http://localhost:${PORT}`);
});
