"use client";

import { useState, useCallback, useEffect } from 'react';
import citiesData from '@/data/cities.json';
import { CityData, calculateDistance, calculateDirection, getRandomCity } from '@/utils/gameUtils';
import { STORY_LEVELS } from '@/data/storyLevels';
import { socket } from '@/lib/socket';

export type GameState = 'playing' | 'won' | 'lost' | 'waiting' | 'ended';

export interface Guess {
    city: CityData;
    distance: number;
    direction: string;
}

// Zoom levels based on attempts remaining (6 down to 1)
const ZOOM_LEVELS: Record<number, number> = {
    6: 16,
    5: 13,
    4: 11,
    3: 9,
    2: 7,
    1: 5,
    0: 4,
};

export function useGame() {
    const [targetCity, setTargetCity] = useState<CityData | null>(null);
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [attempts, setAttempts] = useState(6); // For local: attempts remaining. For online: attempts used in current round (?) 
    // Actually used as "attempts made" in original code (0 at start).
    const [gameState, setGameState] = useState<GameState>('playing');
    const [currentZoom, setCurrentZoom] = useState(16);

    const [gameMode, setGameMode] = useState<'france' | 'capital' | 'story' | 'online' | 'time_attack'>('france');
    const [currentLevelId, setCurrentLevelId] = useState<number>(1);
    const [storyProgress, setStoryProgress] = useState<Record<number, number>>({}); // Level ID -> Best Score (attempts)

    // Time Attack State
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes start

    // Online State
    const [roomId, setRoomId] = useState<string>('');
    const [players, setPlayers] = useState<any[]>([]);
    const [isHost, setIsHost] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(10);
    const [onlinePhase, setOnlinePhase] = useState<'menu' | 'lobby' | 'game'>('menu');

    // Load progress on mount
    useEffect(() => {
        const saved = localStorage.getItem('city_guessr_story_progress');
        if (saved) {
            try {
                setStoryProgress(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load save", e);
            }
        }
    }, []);

    // Timer Logic for Time Attack
    useEffect(() => {
        if (gameMode !== 'time_attack' || gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameState('ended');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameMode, gameState]);

    // Socket Events
    useEffect(() => {
        if (!socket) return;

        function onRoomCreated({ roomId }: { roomId: string }) {
            setRoomId(roomId);
            setIsHost(true);
            setOnlinePhase('lobby');
        }

        function onRoomJoined({ roomId }: { roomId: string }) {
            setRoomId(roomId);
            setIsHost(false);
            setOnlinePhase('lobby');
        }

        function onUpdatePlayers(updatedPlayers: any[]) {
            setPlayers(updatedPlayers);
        }

        function onGameStarted({ totalRounds, firstCity }: { totalRounds: number, firstCity: CityData }) {
            setTotalRounds(totalRounds);
            setCurrentRound(1);
            setOnlinePhase('game');
            setGameState('playing');
            setTargetCity(firstCity);
            setGuesses([]);
            setAttempts(0);
            setCurrentZoom(ZOOM_LEVELS[6]);
        }

        function onNextRound({ round, city, players }: { round: number, city: CityData, players: any[] }) {
            setCurrentRound(round);
            setPlayers(players);
            setGameState('playing');
            setTargetCity(city);
            setGuesses([]);
            setAttempts(0);
            setCurrentZoom(ZOOM_LEVELS[6]);
        }

        function onGameOver({ players }: { players: any[] }) {
            setPlayers(players);
            setGameState('ended');
            // Show final leaderboard overlay
        }

        function onError(msg: string) {
            alert(msg);
        }

        socket.on('room_created', onRoomCreated);
        socket.on('room_joined', onRoomJoined);
        socket.on('update_players', onUpdatePlayers);
        socket.on('game_started', onGameStarted);
        socket.on('next_round', onNextRound);
        socket.on('game_over', onGameOver);
        socket.on('error', onError);

        return () => {
            socket.off('room_created', onRoomCreated);
            socket.off('room_joined', onRoomJoined);
            socket.off('update_players', onUpdatePlayers);
            socket.off('game_started', onGameStarted);
            socket.off('next_round', onNextRound);
            socket.off('game_over', onGameOver);
            socket.off('error', onError);
        };
    }, []);

    const saveProgress = (levelId: number, attemptsCount: number) => {
        setStoryProgress(prev => {
            const currentBest = prev[levelId];
            if (!currentBest || attemptsCount < currentBest) {
                const newProgress = { ...prev, [levelId]: attemptsCount };
                localStorage.setItem('city_guessr_story_progress', JSON.stringify(newProgress));
                return newProgress;
            }
            return prev;
        });
    };

    const restartGame = useCallback((mode: 'france' | 'capital' | 'story' | 'online' | 'time_attack' = 'france', levelId?: number) => {
        setGameMode(mode);

        if (mode === 'online') {
            socket.connect();
            setOnlinePhase('menu');
            return;
        }

        // Reset state
        setGuesses([]);
        setAttempts(0); // number of attempts made (0 at start)
        setGameState('playing');
        setCurrentZoom(ZOOM_LEVELS[6]); // 6 attempts remaining

        if (mode === 'time_attack') {
            setScore(0);
            setTimeLeft(120);
        }

        let pool = (citiesData as CityData[]);

        if (mode === 'story' && levelId) {
            setCurrentLevelId(levelId);
            // Find city for this level
            const level = STORY_LEVELS.find(l => l.id === levelId);
            if (level) {
                const city = pool.find(c => c.name === level.cityName);
                if (city) {
                    setTargetCity(city);
                    return;
                }
            }
        }

        if (mode === 'france' || mode === 'time_attack') {
            // Force only French cities for Time Attack
            pool = pool.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
        } else if (mode === 'capital') {
            pool = pool.filter(c => c.category.includes('world_capital'));
        }

        const newTarget = getRandomCity(pool);
        setTargetCity(newTarget);
    }, []);

    const nextCityTimeAttack = useCallback(() => {
        setGuesses([]);
        setAttempts(0);
        setCurrentZoom(ZOOM_LEVELS[6]);

        // Pick new city
        const pool = (citiesData as CityData[]).filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
        const newTarget = getRandomCity(pool);
        setTargetCity(newTarget);
    }, []);

    const submitGuess = useCallback((cityName: string) => {
        if ((gameState !== 'playing' && gameMode !== 'time_attack') || !targetCity) return;
        if (gameState === 'ended') return;

        const city = (citiesData as CityData[]).find(c => c.name.toLowerCase() === cityName.toLowerCase());

        if (city) {
            // Check for duplicate guess
            if (guesses.some(g => g.city.name === city.name)) return;

            const distance = calculateDistance(city.coords, targetCity.coords);
            const direction = calculateDirection(city.coords, targetCity.coords);

            const newGuess: Guess = { city, distance, direction };
            const newGuesses = [...guesses, newGuess];
            setGuesses(newGuesses);

            // Attempts is "number of guesses made"
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            // Win or Loss logic
            let isWin = distance < 20;
            let isLoss = newAttempts >= 6;

            if (isWin) {
                if (gameMode === 'time_attack') {
                    // Score calculation based on attempts
                    // 1 attempt = 1000, 2 = 850, 3 = 700...
                    const points = Math.max(100, 1000 - ((newAttempts - 1) * 150));
                    setScore(prev => prev + points);
                    setTimeLeft(prev => prev + 30); // Bonus time
                    nextCityTimeAttack();
                } else {
                    setGameState(gameMode === 'online' ? 'waiting' : 'won');
                    if (gameMode === 'story') {
                        saveProgress(currentLevelId, newAttempts);
                    }
                    if (gameMode === 'online') {
                        socket.emit('submit_round', { roomId, attempts: newAttempts });
                    }
                }
            } else if (isLoss) {
                if (gameMode === 'time_attack') {
                    nextCityTimeAttack();
                } else {
                    setGameState(gameMode === 'online' ? 'waiting' : 'lost');
                    setCurrentZoom(4);
                    if (gameMode === 'online') {
                        socket.emit('submit_round', { roomId, attempts: 6 }); // Max penalty
                    }
                }
            } else {
                // Update zoom based on remaining attempts
                const remaining = 6 - newAttempts;
                setCurrentZoom(ZOOM_LEVELS[remaining] || 4);
            }
        }
    }, [gameState, targetCity, guesses, attempts, gameMode, currentLevelId, roomId, nextCityTimeAttack]);

    // Online Actions
    const createRoom = (username: string) => {
        socket.connect();
        socket.emit('create_room', { username });
    };

    const joinRoom = (username: string, roomId: string) => {
        socket.connect();
        socket.emit('join_room', { roomId, username });
    };

    const startGame = () => {
        if (isHost && roomId) {
            socket.emit('start_game', { roomId });
        }
    };

    return {
        targetCity,
        guesses,
        attempts,
        gameState,
        currentZoom,
        gameMode,
        storyProgress,
        score,
        timeLeft,
        submitGuess,
        restartGame,
        // Online Exports
        onlinePhase,
        roomId,
        players,
        isHost,
        currentRound,
        totalRounds,
        createRoom,
        joinRoom,
        startGame
    };
}
