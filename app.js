const API_URL = 'http://localhost:3000';

// Register
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    });
});

// Login
const loginForm = document.getElementById('login-form');
let currentUser = null;
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentUser = username;
            alert('Logged in as ' + username);
        } else {
            alert(data.message);
        }
    });
});

// WebSocket for live notifications
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = function(event) {
    const notificationList = document.getElementById('notification-list');
    const div = document.createElement('div');
    div.textContent = event.data;
    notificationList.appendChild(div);
};