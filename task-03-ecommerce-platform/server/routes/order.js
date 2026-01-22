const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create new order
router.post('/', (req, res) => {
  try {
    const order = Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id/status', (req, res) => {
  try {
    const order = Order.updateStatus(req.params.id, req.body.status);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;