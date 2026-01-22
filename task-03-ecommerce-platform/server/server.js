const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/cart.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🛒 Cart: http://localhost:${PORT}/cart`);
});