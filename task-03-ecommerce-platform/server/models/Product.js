// In-memory storage (replace with database in production)
let products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 6639.00,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Premium wireless headphones with noise cancellation",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 16599.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Fitness tracking smartwatch with heart rate monitor",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    price: 1659.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "100% cotton t-shirt, available in multiple colors",
    category: "Clothing"
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 4979.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    description: "Lightweight running shoes with excellent grip",
    category: "Footwear"
  },
  {
    id: 5,
    name: "Coffee Maker",
    price: 8299.00,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    description: "Automatic coffee maker with 12-cup capacity",
    category: "Home & Kitchen"
  },
  {
    id: 6,
    name: "Backpack",
    price: 3319.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Durable laptop backpack with multiple compartments",
    category: "Accessories"
  }
];

module.exports = {
  findAll: () => products,
  findById: (id) => products.find(p => p.id === parseInt(id)),
  create: (product) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    return newProduct;
  }
};