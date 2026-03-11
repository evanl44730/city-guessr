"use client";

import { useState, useCallback, useEffect } from 'react';
import { CityData, calculateDistance, calculateDirection, getRandomCity, getDailyCity, getDifficultyFromPopulation, generateHintString } from '@/utils/gameUtils';
import { STORY_LEVELS, StoryLevel, generateStoryLevelsForDepartment } from '@/data/storyLevels';
import { socket } from '@/lib/socket';
import { supabase } from '@/lib/supabaseClient';

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

    const [gameMode, setGameMode] = useState<'france' | 'capital' | 'story' | 'online' | 'time_attack' | 'department' | 'europe' | 'daily'>('france');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('31'); // Default to Haute-Garonne
    const [selectedCountry, setSelectedCountry] = useState<string>('FR'); // Default to France
    const [currentLevelId, setCurrentLevelId] = useState<number>(1);
    const [storyProgress, setStoryProgress] = useState<Record<number, number>>({}); // Level ID -> Best Score (attempts)
    const [dynamicStoryLevels, setDynamicStoryLevels] = useState<StoryLevel[]>([]); // Levels for currently selected department

    // Daily Challenge State
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [dailyProgress, setDailyProgress] = useState<Record<string, { attempts: number, win: boolean, city: string }>>({});

    // Time Attack State
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes start
    const [timeAttackBest, setTimeAttackBest] = useState(0);

    // Online State
    const [roomId, setRoomId] = useState<string>('');
    const [players, setPlayers] = useState<any[]>([]);
    const [isHost, setIsHost] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(10);
    const [onlinePhase, setOnlinePhase] = useState<'menu' | 'lobby' | 'game'>('menu');

    // Multiplayer Game Settings
    const [gameSettings, setGameSettings] = useState<{ categories: string[]; rounds: number }>({
        categories: ['france_metropole', 'france_dom'],
        rounds: 10
    });

    // Supabase Cities State
    const [citiesData, setCitiesData] = useState<CityData[]>([]);
    const [isCitiesLoaded, setIsCitiesLoaded] = useState(false);

    // Fetch cities from Supabase (handling > 1000 rows pagination)
    useEffect(() => {
        async function fetchAllCities() {
            setGameState('waiting');
            let allCities: any[] = [];
            let hasMore = true;
            let page = 0;
            const pageSize = 1000;

            while (hasMore) {
                const { data, error } = await supabase
                    .from('cities')
                    .select('*')
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) {
                    console.error('Error fetching cities:', error);
                    break;
                }

                if (data && data.length > 0) {
                    allCities = [...allCities, ...data];
                    page++;
                    // If we get exactly 1000, there MIGHT be more. If less, we're definitely at the end.
                    if (data.length < pageSize) {
                        hasMore = false;
                    }
                } else {
                    hasMore = false;
                }
            }

            if (allCities.length > 0) {
                console.log(`[useGame] Loaded ${allCities.length} cities from Supabase.`);
                const formattedCities: CityData[] = allCities.map((row: any) => ({
                    name: row.name,
                    zip: row.zip || '',
                    population: row.population || 0,
                    coords: { lat: row.lat, lng: row.lng },
                    category: row.category || []
                }));
                setCitiesData(formattedCities);
                setIsCitiesLoaded(true);
            }
        }
        fetchAllCities();
    }, []);

    // Load progress on mount
    useEffect(() => {
        const savedStory = localStorage.getItem('city_guessr_story_progress');
        if (savedStory) {
            try {
                setStoryProgress(JSON.parse(savedStory));
            } catch (e) {
                console.error("Failed to load story save", e);
            }
        }

        const savedDaily = localStorage.getItem('city_guessr_daily_progress');
        if (savedDaily) {
            try {
                setDailyProgress(JSON.parse(savedDaily));
            } catch (e) {
                console.error("Failed to load daily save", e);
            }
        }

        const savedTA = localStorage.getItem('timeAttackBestScore');
        if (savedTA) {
            setTimeAttackBest(parseInt(savedTA, 10) || 0);
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
                    // Save best score
                    setScore(currentScore => {
                        const savedBest = parseInt(localStorage.getItem('timeAttackBestScore') || '0', 10);
                        if (currentScore > savedBest) {
                            localStorage.setItem('timeAttackBestScore', currentScore.toString());
                            setTimeAttackBest(currentScore);
                        }
                        return currentScore;
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameMode, gameState]);

    // Leaderboard State
    const [leaderboard, setLeaderboard] = useState<Array<{ username: string, score: number, date: number }>>([]);

    // ... existing code ...

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

        function onLeaderboardUpdate(data: any[]) {
            setLeaderboard(data);
        }

        socket.on('room_created', onRoomCreated);
        socket.on('room_joined', onRoomJoined);
        socket.on('update_players', onUpdatePlayers);
        socket.on('game_started', onGameStarted);
        socket.on('next_round', onNextRound);
        socket.on('game_over', onGameOver);
        socket.on('leaderboard_update', onLeaderboardUpdate);
        socket.on('settings_updated', (settings: { categories: string[]; rounds: number }) => {
            setGameSettings(settings);
        });
        socket.on('host_changed', ({ newHostId }: { newHostId: string }) => {
            if (socket.id === newHostId) setIsHost(true);
        });
        socket.on('error', onError);

        // Request initial leaderboard
        if (socket.connected) {
            socket.emit('get_leaderboard');
        } else {
            socket.connect();
            socket.once('connect', () => {
                socket.emit('get_leaderboard');
            });
        }

        return () => {
            socket.off('room_created', onRoomCreated);
            socket.off('room_joined', onRoomJoined);
            socket.off('update_players', onUpdatePlayers);
            socket.off('game_started', onGameStarted);
            socket.off('next_round', onNextRound);
            socket.off('game_over', onGameOver);
            socket.off('leaderboard_update', onLeaderboardUpdate);
            socket.off('settings_updated');
            socket.off('host_changed');
            socket.off('error', onError);
        };
    }, []);

    const saveStoryProgress = (levelId: number, attemptsCount: number) => {
        setStoryProgress(prev => {
            const currentBest = prev[levelId];
            // Update if:
            // 1. First time playing this level (!currentBest && currentBest !== -1 && currentBest !== 0)
            // 2. Played and failed previously, but now passing (currentBest === -1 && attemptsCount > 0)
            // 3. Played and passing, but improved score (currentBest > 0 && attemptsCount > 0 && attemptsCount < currentBest)
            // Note: If they passing, and attemptsCount is -1, we DONT overwrite.
            const isFirstTime = currentBest === undefined;
            const isPassingNow = attemptsCount > 0;
            const wasFailing = currentBest === -1;
            const isImprovement = currentBest > 0 && isPassingNow && attemptsCount < currentBest;

            if (isFirstTime || (wasFailing && isPassingNow) || isImprovement) {
                const newProgress = { ...prev, [levelId]: attemptsCount };
                localStorage.setItem('city_guessr_story_progress', JSON.stringify(newProgress));
                return newProgress;
            }
            return prev;
        });
    };

    const saveDailyProgress = (dateStr: string, attemptsCount: number, isWin: boolean, cityName: string) => {
        setDailyProgress(prev => {
            const newProgress = { ...prev, [dateStr]: { attempts: attemptsCount, win: isWin, city: cityName } };
            localStorage.setItem('city_guessr_daily_progress', JSON.stringify(newProgress));
            return newProgress;
        });
    };

    const restartGame = useCallback((mode: 'france' | 'capital' | 'story' | 'online' | 'time_attack' | 'department' | 'europe' | 'daily' = 'france', levelId?: number, departmentId?: string, countryId?: string, dateStr?: string) => {
        setGameMode(mode);
        if (departmentId) setSelectedDepartment(departmentId);
        if (countryId) setSelectedCountry(countryId);
        if (dateStr) setSelectedDate(dateStr);

        if (mode === 'online') {
            socket.connect();
            setOnlinePhase('menu');
            return;
        }

        // Reset state
        setGuesses([]);
        setAttempts(0); // number of attempts made (0 at start)
        setGameState('playing');

        // Initial Zoom Logic
        if (mode === 'department') {
            setCurrentZoom(13); // Fixed zoom for town level
        } else {
            setCurrentZoom(ZOOM_LEVELS[6]); // 6 attempts remaining
        }

        if (mode === 'time_attack') {
            setScore(0);
            setTimeLeft(120);
        }

        if (citiesData.length === 0) return; // Prevent crash if cities aren't loaded

        let pool = [...citiesData];

        if (mode === 'story' && levelId) {
            setCurrentLevelId(levelId);
            // Search in static or dynamic levels
            const level = STORY_LEVELS.find(l => l.id === levelId) || dynamicStoryLevels.find(l => l.id === levelId);
            if (level) {
                // Fix name collisions (e.g. "Paris" in France vs "Paris" in USA/Europe)
                // by matching the level's specific category if it's a dynamic mode.
                const city = pool.find(c => {
                    if (c.name !== level.cityName) return false;

                    // For dynamic categories (departments and countries), enforce exact category match
                    if (level.category.startsWith('dept_')) {
                        const depId = level.category.replace('dept_', '');
                        return c.zip && c.zip.startsWith(depId);
                    } else if (level.category.startsWith('country_')) {
                        return c.category.includes(level.category);
                    }

                    return true; // Fallback for classic 'france' / 'capital'
                });

                if (city) {
                    setTargetCity(city);
                    return;
                }
            }
        }

        if (mode === 'france' || mode === 'time_attack' || mode === 'daily') {
            // Force only French cities for Time Attack and Daily Challenge
            pool = pool.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
        } else if (mode === 'capital') {
            pool = pool.filter(c => c.category.includes('world_capital'));
        } else if (mode === 'department') {
            const dep = departmentId || selectedDepartment;
            pool = pool.filter(c => c.zip && c.zip.startsWith(dep));
        } else if (mode === 'europe') {
            const country = countryId || selectedCountry;
            pool = pool.filter(c => c.category && c.category.includes(`country_${country}`));
        }

        if (mode === 'daily') {
            const newTarget = getDailyCity(pool, dateStr || selectedDate);
            setTargetCity(newTarget);
        } else {
            const newTarget = getRandomCity(pool);
            setTargetCity(newTarget);
        }
    }, [selectedDepartment, selectedCountry, selectedDate, citiesData, dynamicStoryLevels]);

    const nextCityTimeAttack = useCallback(() => {
        if (citiesData.length === 0) return;
        setGuesses([]);
        setAttempts(0);
        setCurrentZoom(ZOOM_LEVELS[6]);

        // Pick new city
        const pool = citiesData.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
        const newTarget = getRandomCity(pool);
        setTargetCity(newTarget);
    }, [citiesData]);

    const submitGuess = useCallback((cityName: string) => {
        if ((gameState !== 'playing' && gameMode !== 'time_attack') || !targetCity || citiesData.length === 0) return;
        if (gameState === 'ended') return;

        const city = citiesData.find(c => c.name.toLowerCase() === cityName.toLowerCase());

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
            // Exact name match required for ALL modes based on user feedback to prevent false positives with nearby cities
            const isWin = city.name === targetCity.name;
            const isLoss = newAttempts >= 6;

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
                        saveStoryProgress(currentLevelId, newAttempts);
                        // Store it just by level ID (progress tracking handles unlock)
                        // If we need the storyLevel to confirm it exists:
                        const storyLevel = STORY_LEVELS.find(l => l.id === currentLevelId) || dynamicStoryLevels.find(l => l.id === currentLevelId);
                        if (storyLevel) {
                            setStoryProgress(prev => {
                                const newProgress = { ...prev, [storyLevel.id]: newAttempts };
                                localStorage.setItem('city_guessr_story_progress', JSON.stringify(newProgress));
                                return newProgress;
                            });
                        }
                    } else if (gameMode === 'daily') {
                        saveDailyProgress(selectedDate, newAttempts, true, targetCity.name);
                    }
                    if (gameMode === 'online') {
                        socket.emit('submit_round', { roomId, attempts: newAttempts });
                    }
                }
            } else if (isLoss) {
                if (gameMode === 'time_attack') {
                    // Penalty: -20 seconds for failing to find the city
                    setTimeLeft(prev => {
                        const newTime = prev - 20;
                        if (newTime <= 0) {
                            setGameState('ended');
                            return 0;
                        }
                        return newTime;
                    });
                    nextCityTimeAttack();
                } else {
                    setGameState(gameMode === 'online' ? 'waiting' : 'lost');
                    if (gameMode !== 'department') { // Changed from 'haute_garonne'
                        setCurrentZoom(4);
                    }
                    if (gameMode === 'online') {
                        socket.emit('submit_round', { roomId, attempts: 6 }); // Max penalty
                    }
                    if (gameMode === 'daily') {
                        saveDailyProgress(selectedDate, 6, false, targetCity.name);
                    }
                    if (gameMode === 'story') {
                        saveStoryProgress(currentLevelId, -1);
                    }
                }
            } else {
                // Update zoom based on remaining attempts
                if (gameMode !== 'department') { // Changed from 'haute_garonne'
                    const remaining = 6 - newAttempts;
                    setCurrentZoom(ZOOM_LEVELS[remaining] || 4);
                }
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

    const leaveRoom = useCallback(() => {
        if (roomId) {
            socket.emit('leave_room', { roomId });
            setRoomId('');
            setPlayers([]);
            setIsHost(false);
            setOnlinePhase('menu');
        }
    }, [roomId]);

    const updateGameSettings = (newSettings: { categories: string[]; rounds: number }) => {
        if (isHost && roomId) {
            socket.emit('update_settings', { roomId, settings: newSettings });
        }
    };

    const submitTimeAttackScore = useCallback((username: string) => {
        if (!socket.connected) socket.connect();
        socket.emit('submit_score', { username, score });
    }, [score]);

    return {
        targetCity,
        guesses,
        attempts,
        gameState,
        currentZoom,
        gameMode,
        selectedDepartment,
        selectedCountry,
        storyProgress,
        dynamicStoryLevels,
        setDynamicStoryLevels,
        score,
        timeLeft,
        leaderboard,
        submitGuess,
        restartGame,
        submitTimeAttackScore,
        selectedDate,
        dailyProgress,
        currentLevelId,
        // Online Exports
        onlinePhase,
        roomId,
        players,
        isHost,
        currentRound,
        totalRounds,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        gameSettings,
        updateGameSettings,
        citiesData,
        isCitiesLoaded
    };
}
