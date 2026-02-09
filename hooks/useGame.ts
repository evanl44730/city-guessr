import { useState, useCallback, useEffect } from 'react';
import citiesData from '@/data/cities.json';
import { CityData, calculateDistance, calculateDirection, getRandomCity } from '@/utils/gameUtils';

export type GameState = 'playing' | 'won' | 'lost';

export interface Guess {
    city: CityData;
    distance: number;
    direction: string;
}

// Zoom levels based on attempts remaining (6 down to 1)
// 6 attempts left (start) -> Zoom 16
// 5 attempts left -> Zoom 13
// 4 -> Zoom 11
// 3 -> Zoom 9
// 2 -> Zoom 7
// 1 -> Zoom 5
// 0 -> Zoom 4 (Reveal)
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
    const [attempts, setAttempts] = useState(6);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [currentZoom, setCurrentZoom] = useState(16);

    const [gameMode, setGameMode] = useState<'france' | 'capital'>('france');

    // Initialize game on mount
    useEffect(() => {
        restartGame('france');
    }, []);

    const restartGame = useCallback((mode: 'france' | 'capital' = 'france') => {
        setGameMode(mode);

        let pool = (citiesData as CityData[]);
        if (mode === 'france') {
            pool = pool.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
        } else {
            pool = pool.filter(c => c.category.includes('world_capital'));
        }

        const newTarget = getRandomCity(pool);
        setTargetCity(newTarget);
        setGuesses([]);
        setAttempts(6);
        setGameState('playing');
        setCurrentZoom(ZOOM_LEVELS[6]);
    }, []);

    const submitGuess = useCallback((cityName: string) => {
        if (gameState !== 'playing' || !targetCity) return;

        // Find city in the ENTIRE dataset (user might type a french city in capital mode, technically wrong but searchable)
        // Or restrict search? Let's search in whole data but maybe warn if not in mode?
        // Actually, existing SearchInput filters by what is in data. 
        // We should probably filter SearchInput too? 
        // For now, let's allow finding any city in the JSON.
        const city = (citiesData as CityData[]).find(c => c.name.toLowerCase() === cityName.toLowerCase());

        if (!city) {
            console.warn("City not found");
            return;
        }

        // Check for duplicate guess
        if (guesses.some(g => g.city.name === city.name)) return;

        const distance = calculateDistance(city.coords, targetCity.coords);
        const direction = calculateDirection(city.coords, targetCity.coords);

        const newGuess: Guess = { city, distance, direction };
        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);

        if (city.name === targetCity.name) {
            setGameState('won');
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);
            // If capital mode, maybe zoom levels should be different? 
            // World is big. 
            // Level 4 (Reveal) is whole world. 
            // Level 16 (Start) is street level.
            // For capitals, maybe start a bit zoomed out? 
            // Let's keep it consistent for now.
            setCurrentZoom(ZOOM_LEVELS[newAttempts] || 4);

            if (newAttempts <= 0) {
                setGameState('lost');
                setCurrentZoom(4); // Show whole map
            }
        }
    }, [guesses, gameState, targetCity, attempts]);

    return {
        targetCity,
        guesses,
        attempts,
        gameState,
        currentZoom,
        gameMode,
        submitGuess,
        restartGame
    };
}
