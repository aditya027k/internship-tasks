// API base URL
const API_URL = 'http://localhost:3000/api';

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  setupEventListeners();
  loadProfileIfOnDashboard();
});

// Check authentication status
function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const navMenu = document.getElementById('navMenu');
  const loginLink = document.getElementById('loginLink');
  const dashboardLink = document.getElementById('dashboardLink');
  const logoutBtn = document.getElementById('logoutBtn');

  if (token) {
    if (loginLink) loginLink.parentElement.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'block';
    if (logoutBtn) {
      logoutBtn.style.display = 'block';
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    if (loginLink) loginLink.parentElement.style.display = 'block';
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// Setup event listeners for forms
function setupEventListeners() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toggleToRegister = document.getElementById('toggleToRegister');
  const toggleToLogin = document.getElementById('toggleToLogin');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (toggleToRegister) {
    toggleToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'block';
      document.querySelector('.toggle-text').style.display = 'none';
      document.getElementById('toggleToLoginText').style.display = 'block';
    });
  }

  if (toggleToLogin) {
    toggleToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
      document.querySelector('.toggle-text').style.display = 'block';
      document.getElementById('toggleToLoginText').style.display = 'none';
    });
  }
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('message');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showMessage('Login successful! Redirecting...', 'success', messageDiv);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      showMessage(data.message || 'Login failed', 'error', messageDiv);
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error', messageDiv);
  }
}

// Handle registration
async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const messageDiv = document.getElementById('message');

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'error', messageDiv);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showMessage('Registration successful! Redirecting...', 'success', messageDiv);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      showMessage(data.message || 'Registration failed', 'error', messageDiv);
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error', messageDiv);
  }
}

// Load profile on dashboard
async function loadProfileIfOnDashboard() {
  if (window.location.pathname !== '/dashboard') return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user;

      document.getElementById('userId').textContent = user.id;
      document.getElementById('username').textContent = user.username;
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('joinDate').textContent = new Date(user.createdAt).toLocaleDateString();
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Error loading profile', 'error', document.getElementById('message'));
  }
}

// Logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Show message
function showMessage(message, type, messageDiv) {
  if (!messageDiv) return;

  messageDiv.textContent = message;
  messageDiv.className = `message show ${type}`;

  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 5000);
}
