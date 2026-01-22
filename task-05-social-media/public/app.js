let isLoginMode = true;
let currentUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

window.onload = () => {
    if (currentUser) {
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('user-display').innerText = currentUser.username;
        fetchPosts();
    }
};

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Connect" : "Create Account";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Login" : "Sign Up";
    document.getElementById('auth-toggle').innerText = isLoginMode ? "New here? Create account" : "Have an account? Login";
}

async function handleAuth() {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const endpoint = isLoginMode ? '/api/login' : '/api/register';

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        currentUser = data;
        localStorage.setItem('loggedInUser', JSON.stringify(data));
        location.reload();
    } else alert(data.error);
}

function logout() {
    localStorage.removeItem('loggedInUser');
    location.reload();
}

async function fetchPosts() {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    const feed = document.getElementById('feed');
    feed.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-header"><div style="width:30px;height:30px;background:#ddd;border-radius:50%"></div> ${post.username} <small style="color:gray;margin-left:auto">${post.timestamp}</small></div>
            <div class="post-content">${post.content}</div>
            <div class="post-footer">
                <span onclick="likePost(${post.id})"><i class="far fa-thumbs-up"></i> ${post.likes} Likes</span>
                <span><i class="far fa-comment"></i> Comment</span>
            </div>
        </div>
    `).join('');
}

async function createPost() {
    const content = document.getElementById('postContent').value;
    if(!content || !currentUser) return;

    await fetch('/api/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ content, username: currentUser.username })
    });

    document.getElementById('postContent').value = '';
    document.getElementById('post-modal').style.display = 'none';
    fetchPosts();
}

async function likePost(id) {
    await fetch(`/api/posts/${id}/like`, { method: 'POST' });
    fetchPosts();
}