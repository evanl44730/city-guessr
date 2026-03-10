const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Game State
const rooms = new Map();

// Helper to generate a random 4-letter room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Server-side Cities State
let citiesData = [];

// Fetch all cities with pagination (same fix as client-side)
async function loadCities() {
    try {
        let allCities = [];
        let hasMore = true;
        let page = 0;
        const pageSize = 1000;

        while (hasMore) {
            const { data, error } = await supabase
                .from('cities')
                .select('*')
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (error) throw error;

            if (data && data.length > 0) {
                allCities = [...allCities, ...data];
                page++;
                if (data.length < pageSize) hasMore = false;
            } else {
                hasMore = false;
            }
        }

        citiesData = allCities;
        console.log(`[Server] Loaded ${citiesData.length} cities from Supabase.`);
    } catch (err) {
        console.error('[Server] Failed to load cities from Supabase:', err.message);
    }
}

loadCities();

/**
 * Get random cities filtered by categories
 * @param {number} count - Number of cities to return
 * @param {string[]} categories - Category filters (e.g. ['france_metropole', 'country_ES', 'world_capital'])
 */
function getRandomCities(count, categories = []) {
    if (citiesData.length === 0) return [];

    let pool = citiesData;

    // Filter by categories if provided
    if (categories.length > 0) {
        pool = citiesData.filter(city => {
            if (!city.category) return false;
            // A city matches if ANY of its categories appears in the requested categories
            return categories.some(cat => city.category.includes(cat));
        });
    } else {
        // Default: French cities only (backward compat)
        pool = citiesData.filter(city =>
            city.category && (city.category.includes('france_metropole') || city.category.includes('france_dom'))
        );
    }

    if (pool.length === 0) {
        console.warn('[Server] No cities match the requested categories:', categories);
        // Fallback to French cities
        pool = citiesData.filter(city =>
            city.category && (city.category.includes('france_metropole') || city.category.includes('france_dom'))
        );
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());

    // Map to CityData format expected by client
    return shuffled.slice(0, count).map(row => ({
        name: row.name,
        zip: row.zip || '',
        population: row.population || 0,
        coords: { lat: row.lat, lng: row.lng },
        category: row.category || []
    }));
}

// Default game settings
const DEFAULT_SETTINGS = {
    categories: ['france_metropole', 'france_dom'],
    rounds: 10
};

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

    // Time Attack Leaderboard (Global)
    const timeAttackLeaderboard = [];

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
                maxRounds: DEFAULT_SETTINGS.rounds,
                settings: { ...DEFAULT_SETTINGS },
                cities: [],
                startTime: Date.now()
            });

            socket.join(roomId);
            socket.emit('room_created', { roomId });
            io.to(roomId).emit('update_players', Array.from(players.values()));
            // Send initial settings to the host
            socket.emit('settings_updated', { ...DEFAULT_SETTINGS });
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
            // Send current settings to the joining player
            socket.emit('settings_updated', room.settings);
        });

        // Host updates game settings
        socket.on('update_settings', ({ roomId, settings }) => {
            const room = rooms.get(roomId);
            if (!room || room.hostId !== socket.id) return;
            if (room.gameState !== 'lobby') return;

            // Validate and apply settings
            if (settings.categories && Array.isArray(settings.categories) && settings.categories.length > 0) {
                room.settings.categories = settings.categories;
            }
            if (settings.rounds && [5, 10, 15, 20].includes(settings.rounds)) {
                room.settings.rounds = settings.rounds;
                room.maxRounds = settings.rounds;
            }

            // Broadcast updated settings to all players in the room
            io.to(roomId).emit('settings_updated', room.settings);
        });

        socket.on('start_game', ({ roomId }) => {
            const room = rooms.get(roomId);
            if (!room || room.hostId !== socket.id) return;

            room.gameState = 'playing';
            room.cities = getRandomCities(room.maxRounds, room.settings.categories);
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
                const roundScore = Math.max(0, 1000 - ((attempts - 1) * 150));
                player.score += roundScore;
                player.finishedRound = true;
            }

            const allFinished = Array.from(room.players.values()).every(p => p.finishedRound);

            io.to(roomId).emit('update_players', Array.from(room.players.values()));

            if (allFinished) {
                if (room.currentRound >= room.maxRounds) {
                    room.gameState = 'ended';
                    io.to(roomId).emit('game_over', {
                        players: Array.from(room.players.values()).sort((a, b) => b.score - a.score)
                    });
                } else {
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

        // Time Attack Leaderboard Events
        socket.on('submit_score', ({ username, score }) => {
            const cleanUsername = username.slice(0, 15);

            const existingEntryIndex = timeAttackLeaderboard.findIndex(entry => entry.username === cleanUsername);

            if (existingEntryIndex !== -1) {
                if (score > timeAttackLeaderboard[existingEntryIndex].score) {
                    timeAttackLeaderboard[existingEntryIndex].score = score;
                    timeAttackLeaderboard[existingEntryIndex].date = Date.now();
                }
            } else {
                timeAttackLeaderboard.push({
                    username: cleanUsername,
                    score,
                    date: Date.now()
                });
            }

            timeAttackLeaderboard.sort((a, b) => b.score - a.score);
            if (timeAttackLeaderboard.length > 100) {
                timeAttackLeaderboard.length = 100;
            }

            io.emit('leaderboard_update', timeAttackLeaderboard);
        });

        socket.on('get_leaderboard', () => {
            socket.emit('leaderboard_update', timeAttackLeaderboard);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            rooms.forEach((room, roomId) => {
                if (room.players.has(socket.id)) {
                    room.players.delete(socket.id);
                    if (room.players.size === 0) {
                        rooms.delete(roomId);
                    } else {
                        io.to(roomId).emit('update_players', Array.from(room.players.values()));
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
