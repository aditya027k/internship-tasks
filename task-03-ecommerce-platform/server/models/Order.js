let orders = [];
let orderIdCounter = 1;

module.exports = {
  findAll: () => orders,
  create: (orderData) => {
    const order = {
      id: orderIdCounter++,
      ...orderData,
      date: new Date().toISOString(),
      status: 'pending'
    };
    orders.unshift(order); // Add to beginning for recent first
    return order;
  },
  updateStatus: (id, status) => {
    const order = orders.find(o => o.id === parseInt(id));
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
};