# Secure Auth Web

A secure authentication web application built with Node.js and Express.

## Features

- User registration and login
- JWT-based authentication
- Password encryption with bcrypt
- Secure session management

## Project Structure

```
secure-auth-web/
├── server/
│   ├── server.js          # Main server file
│   ├── models/User.js     # User data model
│   ├── middleware/auth.js # Authentication middleware
│   └── routes/auth.js     # Auth routes
├── client/
│   ├── index.html         # Home page
│   ├── login.html         # Login page
│   ├── dashboard.html     # Dashboard page
│   ├── style.css          # Styles
│   └── script.js          # Client-side logic
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
JWT_SECRET=your_secret_key_here
DB_URL=your_database_url
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (requires auth)

## Security Best Practices

- Passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- HTTPS recommended for production
- Input validation and sanitization

## License

MIT
