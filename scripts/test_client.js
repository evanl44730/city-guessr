const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');
const BASE_DELAY = 5000;

socket.on('connect', () => {
    console.log('Bot connected');
    socket.emit('create_room', { username: 'BotHost' });
});

socket.on('room_created', ({ roomId }) => {
    console.log(`ROOM_CODE: ${roomId}`);
});

socket.on('update_players', (players) => {
    console.log('Players updated:', players.map(p => p.username).join(', '));
    if (players.length >= 2 && !gameStarted) {
        console.log('2 players found, starting game...');
        socket.emit('start_game', { roomId: players[0].roomId || getCurrentRoomId() }); // Client doesn't easily know roomId from player list usually, but let's store it
        gameStarted = true;
    }
});

let currentRoomId = '';
socket.on('room_created', ({ roomId }) => { currentRoomId = roomId; });

let gameStarted = false;

socket.on('game_started', (data) => {
    console.log('Game started!', data);
    playRound();
});

socket.on('next_round', (data) => {
    console.log('Next round!', data);
    playRound();
});

socket.on('game_over', (data) => {
    console.log('Game Over!', data);
    process.exit(0);
});

function playRound() {
    setTimeout(() => {
        console.log('Bot submitting round...');
        // Simulate a good guess (1 attempt)
        if (currentRoomId) {
            socket.emit('submit_round', { roomId: currentRoomId, attempts: 1 });
        }
    }, BASE_DELAY);
}

function getCurrentRoomId() {
    return currentRoomId;
}
