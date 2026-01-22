const socket = io();

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');

let user = "";
let room = "";

// Join Chat
document.getElementById('join-btn').onclick = () => {
    user = document.getElementById('username').value;
    room = document.getElementById('room').value;

    if (user.trim()) {
        loginScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        document.getElementById('room-display').innerText = `Room: ${room}`;
        
        socket.emit('join-room', { username: user, room: room });
    }
};

// Send Message
document.getElementById('send-btn').onclick = sendMessage;
messageInput.onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };

function sendMessage() {
    const text = messageInput.value;
    if (text.trim()) {
        socket.emit('chat-message', { username: user, room: room, message: text });
        messageInput.value = '';
    }
}

// Receive Message
socket.on('message', (data) => {
    const div = document.createElement('div');
    div.classList.add('msg');
    
    if (data.user === 'System') {
        div.classList.add('system');
    } else {
        div.classList.add(data.user === user ? 'outgoing' : 'incoming');
    }

    div.innerHTML = `<strong>${data.user}:</strong> ${data.text} <br> <small>${data.time || ''}</small>`;
    messageContainer.appendChild(div);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

// Leave Chat
document.getElementById('leave-btn').onclick = () => {
    window.location.reload();
};