const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// In-memory data (Resets when server restarts)
let posts = [];
let users = [];

// --- AUTHENTICATION ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) res.json(user);
    else res.status(401).json({ error: "Invalid credentials" });
});

// --- POSTS ---
app.get('/api/posts', (req, res) => res.json(posts));

app.post('/api/posts', (req, res) => {
    const newPost = {
        id: Date.now(),
        username: req.body.username,
        content: req.body.content,
        likes: 0,
        timestamp: new Date().toLocaleTimeString()
    };
    posts.unshift(newPost);
    res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        post.likes++;
        res.json(post);
    } else res.status(404).send("Not found");
});

app.listen(3000, () => console.log('🚀 Server: http://localhost:3000'));