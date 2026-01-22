// Base API URL
const API_URL = 'http://localhost:3000/api';
const STORAGE_KEY = 'employees_data';

// Initialize employees data from localStorage
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

// Get all employees from localStorage
function getAllEmployees() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Save employees to localStorage
function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== 📄 DOMContentLoaded fired ===');
  initializeData();
  updateUserDisplay();
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  console.log('✅ loginForm found:', !!loginForm);
  console.log('✅ registerForm found:', !!registerForm);
  
  if (loginForm) {
    console.log('🔗 Attaching login form submit listener');
    loginForm.addEventListener('submit', (e) => {
      console.log('📤 Login form submit event triggered');
      handleLogin(e);
    });
  }
  
  if (registerForm) {
    console.log('🔗 Attaching register form submit listener');
    registerForm.addEventListener('submit', (e) => {
      console.log('📤 Register form submit event triggered');
      handleRegister(e);
    });
  }
  
  // Load employees if on dashboard
  if (document.querySelector('#employeeTable')) {
    console.log('📊 Dashboard detected - loading employees');
    loadEmployees();
  }
  
  console.log('=== ✅ Initialization complete ===');
});

// Direct handler for inline onsubmit
function handleLoginClick(e) {
  console.log('✋ handleLoginClick called via inline onsubmit');
  return handleLogin(e);
}

// Login Handler
async function handleLogin(e) {
  e.preventDefault();
  console.log('🔐 === LOGIN FUNCTION STARTED ===');
  
  try {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput || !passwordInput) {
      console.error('❌ ERROR: Input elements not found');
      console.error('  emailInput:', emailInput);
      console.error('  passwordInput:', passwordInput);
      alert('❌ Error: Form elements not found');
      return false;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('📧 Email:', email);
    console.log('🔐 Password length:', password.length);
    
    if (!email || !password) {
      alert('❌ Please fill in all fields');
      return false;
    }
    
    // Determine user role based on email
    let userRole = 'employee';
    if (email === 'admin@admin.com' || email === 'admin' || email.toLowerCase().includes('admin')) {
      userRole = 'admin';
    }
    
    console.log('👤 User role: ' + userRole);
    
    // Store login info in localStorage
    const token = 'token_' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', userRole);
    
    console.log('💾 Data stored to localStorage');
    console.log('  - token:', token);
    console.log('  - userEmail:', email);
    console.log('  - userRole:', userRole);
    
    // Redirect to dashboard
    console.log('🚀 Redirecting to dashboard.html...');
    window.location.href = 'dashboard.html';
    
    return false;
  } catch (error) {
    console.error('❌ CATCH ERROR:', error.message);
    console.error('Stack:', error.stack);
    alert('❌ Login error: ' + error.message);
    return false;
  }
}

// Register Handler
async function handleRegister(e) {
  e.preventDefault();
  console.log('=== REGISTER FUNCTION STARTED ===');
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('role').value;

  if (!email || !password || !confirmPassword || !role) {
    alert('❌ Please fill in all fields');
    return false;
  }

  if (password !== confirmPassword) {
    alert('❌ Passwords do not match!');
    return false;
  }

  if (password.length < 6) {
    alert('❌ Password must be at least 6 characters long');
    return false;
  }

  try {
    // Try to register via API (will fail in demo mode)
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    if (response.ok) {
      let users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      users.push({ email, password, role });
      localStorage.setItem('registered_users', JSON.stringify(users));
      
      alert('✅ Registration successful! Please login.');
      window.location.href = 'login.html';
    } else {
      alert('❌ Registration failed: ' + data.message);
    }
  } catch (err) {
    console.error('Registration error (using demo mode):', err);
    // Demo mode: store locally
    let users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    users.push({ email, password, role });
    localStorage.setItem('registered_users', JSON.stringify(users));
    
    alert('✅ Registration successful! Please login.');
    window.location.href = 'login.html';
  }
  
  return false;
}

// Load Employees from localStorage
function loadEmployees() {
  updateUserDisplay();
  const employees = getAllEmployees();
  displayEmployees(employees);
}

// Update user display with logged-in username
function updateUserDisplay() {
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const userRole = localStorage.getItem('userRole') || 'employee';
  const userName = userEmail.split('@')[0];
  const userGreeting = document.getElementById('userGreeting');
  if (userGreeting) {
    userGreeting.textContent = `Welcome, ${userName}`;
  }
  
  // Show/hide add button based on admin role
  const btnAdd = document.querySelector('.btn-add');
  if (btnAdd) {
    if (userRole === 'admin') {
      btnAdd.style.display = 'inline-block';
    } else {
      btnAdd.style.display = 'none';
    }
  }
}

// Display Employees in Table
function displayEmployees(employees) {
  const tbody = document.querySelector('#employeeTable tbody');
  const userRole = localStorage.getItem('userRole') || 'employee';
  if (tbody) {
    tbody.innerHTML = '';
    if (employees.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#999; padding:30px;">No employees found. Click "Add New Employee" to get started.</td></tr>';
      return;
    }
    employees.forEach((emp, index) => {
      let actionButtons = '';
      if (userRole === 'admin') {
        actionButtons = `
          <div class="action-buttons">
            <button class="btn-small btn-edit" onclick="editEmployee(${index})">✏️ Edit</button>
            <button class="btn-small btn-delete" onclick="deleteEmployee(${index})">🗑️ Delete</button>
          </div>
        `;
      } else {
        actionButtons = '<span style="color:#999; font-size:12px;">View Only</span>';
      }
      
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${emp.firstName} ${emp.lastName}</td>
          <td>${emp.email}</td>
          <td>${emp.department}</td>
          <td>${emp.position}</td>
          <td>$${emp.salary}</td>
          <td>${actionButtons}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }
}

// Add Employee with Form
function showAddEmployeeForm() {
  const userRole = localStorage.getItem('userRole') || 'employee';
  if (userRole !== 'admin') {
    alert('⛔ Only Admins can add employees!');
    return;
  }
  
  const formHTML = `
    <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.3); max-width:500px; margin:50px auto; z-index:1000; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%;">
      <h3 style="margin-bottom:20px; color:#333;">Add New Employee</h3>
      <form id="addEmployeeForm" style="display:flex; flex-direction:column; gap:15px;">
        <input type="text" id="firstName" placeholder="First Name" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="text" id="lastName" placeholder="Last Name" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="email" id="email" placeholder="Email Address" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="text" id="department" placeholder="Department" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="text" id="position" placeholder="Position" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="number" id="salary" placeholder="Salary" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button type="submit" style="flex:1; padding:10px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Save Employee</button>
          <button type="button" onclick="closeModal()" style="flex:1; padding:10px; background:#ccc; color:black; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  let modal = document.getElementById('modalOverlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalOverlay';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;';
    document.body.appendChild(modal);
  }
  
  let formContainer = document.getElementById('formContainer');
  if (!formContainer) {
    formContainer = document.createElement('div');
    formContainer.id = 'formContainer';
    document.body.appendChild(formContainer);
  }
  
  modal.style.display = 'block';
  formContainer.innerHTML = formHTML;
  
  document.getElementById('addEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const employee = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      department: document.getElementById('department').value,
      position: document.getElementById('position').value,
      salary: document.getElementById('salary').value,
      createdAt: new Date().toISOString()
    };
    
    const employees = getAllEmployees();
    employees.push(employee);
    saveEmployees(employees);
    
    closeModal();
    loadEmployees();
    alert('✅ Employee added successfully!');
  });
}

// Edit Employee
function editEmployee(index) {
  const userRole = localStorage.getItem('userRole') || 'employee';
  if (userRole !== 'admin') {
    alert('⛔ Only Admins can edit employees!');
    return;
  }
  
  const employees = getAllEmployees();
  const emp = employees[index];
  
  const formHTML = `
    <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.3); max-width:500px; margin:50px auto; z-index:1000; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%;">
      <h3 style="margin-bottom:20px; color:#333;">Edit Employee</h3>
      <form id="editEmployeeForm" style="display:flex; flex-direction:column; gap:15px;">
        <input type="text" id="firstName" placeholder="First Name" value="${emp.firstName}" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="text" id="lastName" placeholder="Last Name" value="${emp.lastName}" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="email" id="email" placeholder="Email Address" value="${emp.email}" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="text" id="department" placeholder="Department" value="${emp.department}" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="text" id="position" placeholder="Position" value="${emp.position}" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <input type="number" id="salary" placeholder="Salary" value="${emp.salary}" required style="padding:10px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px;">
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button type="submit" style="flex:1; padding:10px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Update Employee</button>
          <button type="button" onclick="closeModal()" style="flex:1; padding:10px; background:#ccc; color:black; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  let modal = document.getElementById('modalOverlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalOverlay';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;';
    document.body.appendChild(modal);
  }
  
  let formContainer = document.getElementById('formContainer');
  if (!formContainer) {
    formContainer = document.createElement('div');
    formContainer.id = 'formContainer';
    document.body.appendChild(formContainer);
  }
  
  modal.style.display = 'block';
  formContainer.innerHTML = formHTML;
  
  document.getElementById('editEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    employees[index] = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      department: document.getElementById('department').value,
      position: document.getElementById('position').value,
      salary: document.getElementById('salary').value,
      createdAt: emp.createdAt
    };
    
    saveEmployees(employees);
    closeModal();
    loadEmployees();
    alert('✅ Employee updated successfully!');
  });
}

// Delete Employee
function deleteEmployee(index) {
  const userRole = localStorage.getItem('userRole') || 'employee';
  if (userRole !== 'admin') {
    alert('⛔ Only Admins can delete employees!');
    return;
  }
  
  if (confirm('⚠️ Are you sure you want to delete this employee?')) {
    const employees = getAllEmployees();
    const deletedEmp = employees[index];
    employees.splice(index, 1);
    saveEmployees(employees);
    loadEmployees();
    alert(`✅ ${deletedEmp.firstName} ${deletedEmp.lastName} deleted!`);
  }
}

// Close Modal
function closeModal() {
  const modal = document.getElementById('modalOverlay');
  const formContainer = document.getElementById('formContainer');
  if (modal) modal.style.display = 'none';
  if (formContainer) formContainer.innerHTML = '';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('modalOverlay');
  if (event.target === modal) {
    closeModal();
  }
});

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  window.location.href = 'login.html';
}
