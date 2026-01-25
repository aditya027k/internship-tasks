# Employee Management System

A full CRUD application for managing employee records securely, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure login and registration flows.
- **Dashboard**: View list of employees.
- **Employee Management**: Add, edit, and delete employee records.
- **Security**: Password hashing and JWT-based session management.

## Project Structure

```
task-02-employee-management/
├── client/            # Frontend (HTML, CSS, JS)
├── server/            # Backend (Node.js/Express)
│   ├── models/        # Mongoose Models
│   ├── routes/        # API Routes
│   ├── middleware/    # Auth Middleware
│   └── server.js      # Entry point
└── package.json
```

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB instance running (local or cloud).

### Installation

1. Navigate to the project directory:
   ```bash
   cd task-02-employee-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Database Configuration**:
   - Ensure you have a running MongoDB instance.
   - Verify the connection settings in `server/server.js` or the relevant config file (refer to source code for exact connection string location).

### Running the App

```bash
# Start in production mode
npm start

# Start in development mode (with nodemon)
npm run dev
```

The server will typically start on `http://localhost:3000` (or the port defined in `process.env.PORT`).
