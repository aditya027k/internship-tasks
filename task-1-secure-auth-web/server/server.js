const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Serve client pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
