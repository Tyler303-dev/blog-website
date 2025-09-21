const API_URL = 'http://localhost:3000';

// Helper to show posts
function loadPosts() {
    fetch(`${API_URL}/posts`)
        .then(res => res.json())
        .then(posts => {
            const postsList = document.getElementById('posts-list');
            postsList.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `<div class="post-title">${post.title}</div><div class="post-content">${post.content}</div><div>by ${post.author}</div>`;
                postsList.appendChild(div);
            });
        });
}

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

// Create Post
const createPostForm = document.getElementById('create-post-form');
createPostForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!currentUser) {
        alert('You must be logged in to create a post.');
        return;
    }
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content, author: currentUser})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadPosts();
    });
});

// Initial load
loadPosts();