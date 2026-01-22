const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // Handle user joining a specific room
    socket.on('join-room', ({ username, room }) => {
        socket.join(room);
        
        // Notify others in the room
        socket.to(room).emit('message', {
            user: 'System',
            text: `${username} joined the ${room} room.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });

    // Listen for chat messages
    socket.on('chat-message', (data) => {
        io.to(data.room).emit('message', {
            user: data.username,
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});