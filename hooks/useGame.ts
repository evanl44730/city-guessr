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

    // Initialize game on mount
    useEffect(() => {
        restartGame();
    }, []);

    const restartGame = useCallback(() => {
        const newTarget = getRandomCity(citiesData as CityData[]);
        setTargetCity(newTarget);
        setGuesses([]);
        setAttempts(6);
        setGameState('playing');
        setCurrentZoom(ZOOM_LEVELS[6]);
    }, []);

    const submitGuess = useCallback((cityName: string) => {
        if (gameState !== 'playing' || !targetCity) return;

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
            // Keep zoom or maybe zoom out to show context? 
            // For now, let's keep it close to celebrate or maybe zoom out slightly.
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);
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
        submitGuess,
        restartGame
    };
}
