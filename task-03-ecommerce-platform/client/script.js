// Base API URL
const API_BASE = 'http://localhost:3000/api';

// Cart storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Load products
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">₹${product.price.toFixed(2)}</div>
          <button class="btn btn-primary add-to-cart" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', addToCart);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsGrid').innerHTML = 
      '<div class="loading">Error loading products. Please try again.</div>';
  }
}

// Add to cart
function addToCart(e) {
  const productId = parseInt(e.target.dataset.id);
  
  // Get product details
  fetch(`${API_BASE}/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      
      // Show feedback
      const btn = e.target;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      btn.style.background = '#28a745';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 1500);
    });
}

// Load cart page
async function loadCart() {
  const cartContainer = document.getElementById('cartContainer');
  const cartContent = document.getElementById('cartContent');
  const emptyCart = document.getElementById('emptyCart');
  const cartItems = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartContent.style.display = 'none';
    emptyCart.style.display = 'block';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartContent.style.display = 'block';
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h3 class="cart-item-title">${item.name}</h3>
        <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
            <i class="fas fa-plus"></i>
          </button>
          <button class="btn btn-danger" style="margin-left: auto;" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `₹${(subtotal * 1.08).toFixed(2)}`; // 8% tax
  
  // Checkout button
  document.getElementById('checkoutBtn').onclick = checkout;
}

// Update quantity
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    if (item.quantity === 0) {
      removeFromCart(id);
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
  }
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

// Checkout
async function checkout() {
  if (cart.length === 0) return;
  
  const orderData = {
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };
  
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (response.ok) {
      localStorage.removeItem('cart');
      cart = [];
      updateCartCount();
      
      // Show success
      document.getElementById('cartItems').innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          Order placed successfully! Thank you for your purchase.
        </div>
      `;
      document.querySelector('.cart-summary').style.display = 'none';
    }
  } catch (error) {
    alert('Error placing order. Please try again.');
  }
}

// Initialize
updateCartCount();