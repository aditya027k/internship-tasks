# Real-time Chat Application

A real-time messaging application using WebSockets to enable instant communication between users.

## Features

- **Real-time Messaging**: Instant delivery of messages.
- **Room Support**: Users can join specific chat rooms.
- **System Notifications**: Alerts for user join/leave events.
- **Timestamps**: Messages show the time they were sent.

## Tech Stack

- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.io
- **Frontend**: HTML, CSS, JavaScript (served via Express)

## Project Structure

```
task-04-realtime-chat/
├── public/            # Static frontend files
├── server.js          # Main server entry point (Socket.io setup)
└── package.json
```

## Getting Started

### Installation

1. Navigate to the folder:
   ```bash
   cd task-04-realtime-chat
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

Access the chat app at `http://localhost:3000`. Open multiple tabs to test the real-time functionality.
