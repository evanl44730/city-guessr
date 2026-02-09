const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Game State
const rooms = new Map(); // RoomID -> RoomState
// RoomState: {
//   id: string,
//   hostId: string,
//   players: Map<socketId, { id: string, username: string, score: number, attempts: number, finishedRound: boolean, totalAttempts: number }>,
//   gameState: 'lobby' | 'playing' | 'ended',
//   currentRound: number,
//   maxRounds: number,
//   cities: Array<City>, // The list of 10 cities for the game
//   startTime: number
// }

// Helper to generate a random 4-letter room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Load Cities Data (Server-side)
const citiesData = require('./data/cities.json');

function getRandomCities(count) {
    const frenchCities = citiesData.filter(city =>
        city.category.includes('france_metropole') || city.category.includes('france_dom')
    );
    const shuffled = [...frenchCities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('create_room', ({ username }) => {
            const roomId = generateRoomCode();
            const players = new Map();
            players.set(socket.id, {
                id: socket.id,
                username,
                score: 0,
                attempts: 0,
                finishedRound: false,
                totalAttempts: 0
            });

            rooms.set(roomId, {
                id: roomId,
                hostId: socket.id,
                players,
                gameState: 'lobby',
                currentRound: 0,
                maxRounds: 10,
                cities: [],
                startTime: Date.now()
            });

            socket.join(roomId);
            socket.emit('room_created', { roomId });
            io.to(roomId).emit('update_players', Array.from(players.values()));
        });

        socket.on('join_room', ({ roomId, username }) => {
            const room = rooms.get(roomId.toUpperCase());
            if (!room) {
                socket.emit('error', 'Room not found');
                return;
            }
            if (room.gameState !== 'lobby') {
                socket.emit('error', 'Game already started');
                return;
            }

            room.players.set(socket.id, {
                id: socket.id,
                username,
                score: 0,
                attempts: 0,
                finishedRound: false,
                totalAttempts: 0
            });

            socket.join(roomId.toUpperCase());
            socket.emit('room_joined', { roomId: roomId.toUpperCase() });
            io.to(roomId.toUpperCase()).emit('update_players', Array.from(room.players.values()));
        });

        socket.on('start_game', ({ roomId }) => {
            const room = rooms.get(roomId);
            if (!room || room.hostId !== socket.id) return;

            room.gameState = 'playing';
            room.cities = getRandomCities(room.maxRounds);
            room.currentRound = 1;

            io.to(roomId).emit('game_started', {
                totalRounds: room.maxRounds,
                firstCity: room.cities[0]
            });
        });

        socket.on('submit_round', ({ roomId, attempts }) => {
            const room = rooms.get(roomId);
            if (!room) return;

            const player = room.players.get(socket.id);
            if (player) {
                player.attempts = attempts;
                player.totalAttempts += attempts;
                // Calculate score: Base 1000 - (attempts * 100). Min 0.
                const roundScore = Math.max(0, 1000 - ((attempts - 1) * 150));
                player.score += roundScore;
                player.finishedRound = true;
            }

            // Check if all players finished
            const allFinished = Array.from(room.players.values()).every(p => p.finishedRound);

            io.to(roomId).emit('update_players', Array.from(room.players.values()));

            if (allFinished) {
                if (room.currentRound >= room.maxRounds) {
                    room.gameState = 'ended';
                    io.to(roomId).emit('game_over', {
                        players: Array.from(room.players.values()).sort((a, b) => b.score - a.score)
                    });
                } else {
                    // Send next round after a delay
                    setTimeout(() => {
                        room.currentRound++;
                        room.players.forEach(p => {
                            p.finishedRound = false;
                            p.attempts = 0;
                        });

                        io.to(roomId).emit('next_round', {
                            round: room.currentRound,
                            city: room.cities[room.currentRound - 1],
                            players: Array.from(room.players.values())
                        });
                    }, 3000);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            // Handle cleanup logic if needed (remove player from room, delete empty room)
            rooms.forEach((room, roomId) => {
                if (room.players.has(socket.id)) {
                    room.players.delete(socket.id);
                    if (room.players.size === 0) {
                        rooms.delete(roomId);
                    } else {
                        io.to(roomId).emit('update_players', Array.from(room.players.values()));
                        // Host migration logic could go here
                    }
                }
            });
        });
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
