# Social Media Platform

A prototype social media application allowing users to post updates and like content.

## Features

- **User Authentication**: Simple login and registration (in-memory).
- **Create Posts**: Users can publish text updates.
- **News Feed**: View posts from all users in reverse chronological order.
- **Interactions**: Like posts.
- **In-Memory Storage**: Data is reset when the server restarts (good for testing).

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Data Storage**: In-memory variables (Arrays)

## Project Structure

```
task-05-social-media/
├── public/            # Client-side assets
├── server.js          # Backend logic and API routes
└── package.json
```

## Getting Started

### Installation

1. Navigate to the directory:
   ```bash
   cd task-05-social-media
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

```bash
# Start the server
npm start
```

The application runs on `http://localhost:3000`.

> **Note**: This project uses in-memory storage. All users and posts will be lost if you restart the server.
