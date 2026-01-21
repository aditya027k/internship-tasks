const bcrypt = require('bcryptjs');

// Simple in-memory user store (replace with database in production)
const users = [];

class User {
  constructor(username, email, password) {
    this.id = Date.now();
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  // Hash password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Create a new user
  static async create(username, email, password) {
    const hashedPassword = await this.hashPassword(password);
    const user = new User(username, email, hashedPassword);
    users.push(user);
    return user;
  }

  // Find user by email
  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  // Find user by username
  static findByUsername(username) {
    return users.find(user => user.username === username);
  }

  // Find user by id
  static findById(id) {
    return users.find(user => user.id === id);
  }

  // Get all users (without passwords)
  static getAllUsers() {
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }));
  }
}

module.exports = User;
