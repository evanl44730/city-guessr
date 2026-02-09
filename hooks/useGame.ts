"use client";

import { useState, useCallback, useEffect } from 'react';
import citiesData from '@/data/cities.json';
import { CityData, calculateDistance, calculateDirection, getRandomCity } from '@/utils/gameUtils';
import { STORY_LEVELS } from '@/data/storyLevels';

export type GameState = 'playing' | 'won' | 'lost';

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
    const [attempts, setAttempts] = useState(6);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [currentZoom, setCurrentZoom] = useState(16);

    const [gameMode, setGameMode] = useState<'france' | 'capital' | 'story'>('france');
    const [currentLevelId, setCurrentLevelId] = useState<number>(1);
    const [storyProgress, setStoryProgress] = useState<Record<number, number>>({}); // Level ID -> Best Score (attempts)

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

    // Initialize game on mount
    useEffect(() => {
        restartGame('france');
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

    const restartGame = useCallback((mode: 'france' | 'capital' | 'story' = 'france', levelId?: number) => {
        setGameMode(mode);

        // Reset state
        setGuesses([]);
        setAttempts(0); // number of attempts made (0 at start)
        setGameState('playing');
        setCurrentZoom(ZOOM_LEVELS[6]); // 6 attempts remaining

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

        if (mode === 'france') {
            pool = pool.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
        } else if (mode === 'capital') {
            pool = pool.filter(c => c.category.includes('world_capital'));
        }

        const newTarget = getRandomCity(pool);
        setTargetCity(newTarget);
    }, []);

    const submitGuess = useCallback((cityName: string) => {
        if (gameState !== 'playing' || !targetCity) return;

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

            if (distance < 20) { // Win condition < 20km
                setGameState('won');
                if (gameMode === 'story') {
                    saveProgress(currentLevelId, newAttempts); // Save number of attempts
                }
            } else {
                // Update zoom based on remaining attempts
                // Max 6 attempts allowed.
                const remaining = 6 - newAttempts;
                setCurrentZoom(ZOOM_LEVELS[remaining] || 4);

                if (newAttempts >= 6) {
                    setGameState('lost');
                    setCurrentZoom(4);
                }
            }
        }
    }, [gameState, targetCity, guesses, attempts, gameMode, currentLevelId]);

    return {
        targetCity,
        guesses,
        attempts,
        gameState,
        currentZoom,
        gameMode,
        storyProgress,
        submitGuess,
        restartGame
    };
}
