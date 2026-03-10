import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Home, ArrowUp, ArrowDown, RotateCcw, Trophy, Compass } from 'lucide-react';
import { CityData } from '@/utils/gameUtils';

interface HigherLowerGameProps {
    gameType: 'population' | 'latitude';
    citiesData: CityData[];
    onBack: () => void;
}

export default function HigherLowerGame({ gameType, citiesData, onBack }: HigherLowerGameProps) {
    const [score, setScore] = useState(0);
    const [cityA, setCityA] = useState<CityData | null>(null);
    const [cityB, setCityB] = useState<CityData | null>(null);
    const [nextCity, setNextCity] = useState<CityData | null>(null);
    const [gameState, setGameState] = useState<'playing' | 'revealing' | 'sliding' | 'lost'>('playing');
    const [lastGuess, setLastGuess] = useState<'higher' | 'lower' | null>(null);
    const [colorPhase, setColorPhase] = useState<0 | 1>(0);
    const [bestScore, setBestScore] = useState(0);

    const storageKey = gameType === 'population' ? 'higherLowerBestScore' : 'higherLowerLatitudeBestScore';

    useEffect(() => {
        // Load best score from local storage on mount
        const savedBestStr = localStorage.getItem(storageKey);
        if (savedBestStr) {
            setBestScore(parseInt(savedBestStr, 10) || 0);
        } else {
            setBestScore(0);
        }
    }, [storageKey]);

    // Filter and sort cities for this mode
    const validCities = useMemo(() => {
        return citiesData
            .filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'))
            .filter(c => {
                if (gameType === 'population') return c.population && c.population > 0;
                return c.coords && c.coords.lat !== undefined && c.coords.lat !== null;
            })
            .sort((a, b) => {
                if (gameType === 'population') return b.population! - a.population!;
                return b.coords.lat - a.coords.lat; // Sort lat descending (North to South)
            });
    }, [citiesData, gameType]);

    const getNextCity = useCallback((currentCity: CityData, currentScore: number) => {
        if (validCities.length < 2) return currentCity;
        
        const currentIndex = validCities.findIndex(c => c.name === currentCity.name);
        if (currentIndex === -1) return validCities[0];

        // Difficulty scaling: As score increases, the pool of candidates shrinks around the current city's index
        // Score 0: Can pick from 20% of the entire dataset away
        // Score 20: Can only pick from 1% away
        const percentageSpread = Math.max(0.005, 0.2 - (currentScore * 0.01));
        const absoluteSpread = Math.max(5, Math.floor(validCities.length * percentageSpread));

        const minIndex = Math.max(0, currentIndex - absoluteSpread);
        const maxIndex = Math.min(validCities.length - 1, currentIndex + absoluteSpread);

        // Get candidates within spread, excluding current city and cities with exact same value
        const candidates = validCities.slice(minIndex, maxIndex + 1).filter(c => {
            if (c.name === currentCity.name) return false;
            
            if (gameType === 'population') {
                 return c.population !== currentCity.population;
            } else {
                 return c.coords.lat !== currentCity.coords.lat;
            }
        });

        if (candidates.length === 0) {
            // Fallback to purely random if spread was too tight
            const fallbacks = validCities.filter(c => {
                if (c.name === currentCity.name) return false;
                if (gameType === 'population') return c.population !== currentCity.population;
                return c.coords.lat !== currentCity.coords.lat;
            });
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }, [validCities]);

    const initGame = useCallback(() => {
        if (validCities.length < 2) return;
        
        // Start with a relatively well-known city for City A (top 100)
        let firstCity = validCities[Math.floor(Math.random() * Math.min(100, validCities.length))];
        let secondCity = getNextCity(firstCity, 0);

        setScore(0);
        setCityA(firstCity);
        setCityB(secondCity);
        setNextCity(null);
        setGameState('playing');
        setLastGuess(null);
        setColorPhase(0);
    }, [validCities, getNextCity]);

    useEffect(() => {
        if (!cityA && validCities.length >= 2) {
            initGame();
        }
    }, [cityA, validCities, initGame]);

    const handleGuess = (guess: 'higher' | 'lower') => {
        if (gameState !== 'playing' || !cityA || !cityB) return;
        
        setLastGuess(guess);
        setGameState('revealing');

        let isHigher = false;
        if (gameType === 'population') {
             isHigher = cityB.population! > cityA.population!;
        } else {
             // In latitude mode, "higher" means "further North" -> higher latitude number
             isHigher = cityB.coords.lat > cityA.coords.lat;
        }
        
        const isCorrect = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);

        setTimeout(() => {
            if (isCorrect) {
                // Win round! Start sliding phase
                const newScore = score + 1;
                setScore(newScore);
                
                // Prepare the city that will come from the right
                const upcomingCity = getNextCity(cityB, newScore);
                setNextCity(upcomingCity);
                setGameState('sliding');
                
                // Wait for slide animation to complete, then reset layout
                setTimeout(() => {
                    setCityA(cityB); // City B is now firmly in A's spot
                    setCityB(upcomingCity); // The new city is now in B's spot
                    setNextCity(null);
                    setGameState('playing');
                    setLastGuess(null);
                    setColorPhase(prev => (1 - prev) as 0 | 1);
                }, 800); // 800ms slide duration

            } else {
                // Lose game
                setGameState('lost');
                if (score > bestScore) {
                    setBestScore(score);
                    localStorage.setItem(storageKey, score.toString());
                }
            }
        }, 1500); // 1.5 seconds reveal time before slide
    };

    if (!cityA || !cityB) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const formatDisplayValue = (pop: number | undefined, lat: number | undefined) => {
        if (gameType === 'population') {
            return new Intl.NumberFormat('fr-FR').format(pop || 0);
        } else {
            // Display latitude with N/S symbol
            if (lat === undefined) return '';
            const absLat = Math.abs(lat).toFixed(4);
            return `${absLat}° ${lat >= 0 ? 'N' : 'S'}`;
        }
    };

    const getLabelText = (phase: 'A' | 'B_WAITING' | 'B_REVEAL' | 'NEXT') => {
        if (gameType === 'population') {
            if (phase === 'B_WAITING' || phase === 'NEXT') return 'a une population';
            return 'a une population de';
        } else {
            if (phase === 'B_WAITING' || phase === 'NEXT') return 'est située';
            return 'est située à';
        }
    };

    const higherBtnLabel = gameType === 'population' ? 'Plus élevée' : 'Plus au Nord';
    const lowerBtnLabel = gameType === 'population' ? 'Plus basse' : 'Plus au Sud';

    const HigherIcon = gameType === 'population' ? ArrowUp : Compass;
    const LowerIcon = gameType === 'population' ? ArrowDown : Compass; // Compass can just point down for South if using styling, but maybe Arrow handles it better. I'll stick to ArrowUp/ArrowDown for both to make it simple, or leave Compass for both but let's just use ArrowUp/ArrowDown for North/South too, it makes logical sense. Actually, let's keep ArrowUp for North, ArrowDown for South.


    const getDesign = (type: 'A' | 'B' | 'Next') => {
        // phase 0: A=Light, B=Dark, Next=Light
        // phase 1: A=Dark, B=Light, Next=Dark
        const isLight = colorPhase === 0 ? (type === 'A' || type === 'Next') : (type === 'B');
        
        return {
            bgClass: isLight 
                ? 'bg-slate-800/80 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]' 
                : 'bg-slate-900 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]',
            gradientClass: isLight ? 'from-blue-500' : 'from-purple-500'
        };
    };

    const designA = getDesign('A');
    const designB = getDesign('B');
    const designNext = getDesign('Next');

    return (
        <div className="absolute inset-0 z-50 flex flex-col md:flex-row bg-slate-900 overflow-hidden font-sans">
            {/* Top Bar / HUD */}
            <div className="absolute top-4 left-0 right-0 z-10 flex justify-between items-center px-4 md:px-8 pointer-events-none">
                <button 
                    onClick={onBack}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all pointer-events-auto"
                >
                    <Home className="w-6 h-6" />
                </button>
                <div className="flex gap-4 pointer-events-auto">
                    <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-4 py-1 rounded-2xl border border-white/10">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Score</span>
                        <div className="flex items-center gap-1">
                            <span className="text-white font-black text-xl">{score}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center bg-yellow-500/10 backdrop-blur-md px-4 py-1 rounded-2xl border border-yellow-500/20">
                        <span className="text-xs text-yellow-500/80 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Record
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400 font-black text-xl">{bestScore}</span>
                        </div>
                    </div>
                </div>
                <div className="w-12" /> {/* Spacer to balance flex-between */}
            </div>

            {/* 
                We create a sliding track that holds 3 city-sized panels:
                [Old City A] - [Current City B] - [Next City]
                When 'sliding' is true, we translate this entire track to the left.
             */}
            <div 
                className={`absolute inset-0 flex flex-row transition-transform ease-in-out ${gameState === 'sliding' ? 'duration-[800ms] -translate-x-[100vw] md:-translate-x-[50vw]' : 'duration-0 translate-x-0'}`}
                style={{ width: '150%' }} // 3 panels: 50vw each on desktop
            >

                {/* PANEL 1: CITY A (Top / Left) */}
                <div className={`w-[100vw] md:w-[50vw] h-[50vh] md:h-full flex flex-col items-center justify-center p-8 relative transition-colors duration-1000 ${gameState === 'lost' ? 'opacity-50 grayscale' : designA.bgClass}`}>
                    {/* Background Decor */}
                    <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${designA.gradientClass} to-transparent transition-colors duration-1000`}></div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-2 z-10 drop-shadow-xl tracking-tight">{cityA.name}</h2>
                    <div className="text-white/80 text-lg md:text-xl font-medium tracking-widest uppercase mb-4 z-10">{getLabelText('A')}</div>
                    <div className="text-5xl md:text-7xl font-black text-blue-400 z-10 drop-shadow-2xl">
                        {formatDisplayValue(cityA.population, cityA.coords.lat)}
                    </div>
                </div>

                {/* PANEL 2: CITY B (Bottom / Right) */}
                <div className={`w-[100vw] md:w-[50vw] h-[50vh] md:h-full flex flex-col items-center justify-center p-8 relative transition-colors duration-1000 ${gameState === 'lost' ? 'bg-red-900/40 opacity-90' : designB.bgClass}`}>
                    {/* Background Decor */}
                    <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${designB.gradientClass} to-transparent transition-colors duration-1000`}></div>

                    <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-2 z-10 drop-shadow-xl tracking-tight">{cityB.name}</h2>
                    
                    {gameState !== 'sliding' && (
                       <div className="text-white/80 text-lg md:text-xl font-medium tracking-widest uppercase mb-8 z-10">{getLabelText('B_WAITING')}</div>
                    )}
                    
                    {gameState === 'sliding' && (
                        <>
                            <div className="text-white/80 text-lg md:text-xl font-medium tracking-widest uppercase mb-4 z-10">{getLabelText('B_REVEAL')}</div>
                            <div className="text-5xl md:text-7xl font-black text-blue-400 z-10 drop-shadow-2xl animate-in fade-in zoom-in duration-500">
                                {formatDisplayValue(cityB.population, cityB.coords.lat)}
                            </div>
                        </>
                    )}

                    {(gameState === 'playing' || gameState === 'revealing') && (
                        <div className="flex flex-col gap-4 w-full max-w-xs z-10 relative">
                            {gameState === 'playing' ? (
                                <>
                                    <button
                                        onClick={() => handleGuess('higher')}
                                        className="group relative flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 w-full py-4 rounded-2xl font-black text-xl md:text-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        <HigherIcon className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-y-1 transition-transform" />
                                        {higherBtnLabel}
                                    </button>
                                    <button
                                        onClick={() => handleGuess('lower')}
                                        className="group relative flex items-center justify-center gap-3 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 w-full py-4 rounded-2xl font-black text-xl md:text-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        <LowerIcon className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-y-1 transition-transform" />
                                        {lowerBtnLabel}
                                    </button>
                                </>
                            ) : (() => {
                                const isHigherValid = gameType === 'population' 
                                    ? cityB.population! > cityA.population! 
                                    : cityB.coords.lat > cityA.coords.lat;

                                return (
                                <div className={`flex flex-col items-center justify-center animate-in zoom-in duration-500`}>
                                    <div className={`text-5xl md:text-7xl font-black drop-shadow-2xl mb-4 ${
                                        (lastGuess === 'higher' && isHigherValid) || (lastGuess === 'lower' && !isHigherValid) 
                                            ? 'text-green-400' 
                                            : 'text-red-500'
                                    }`}>
                                        {formatDisplayValue(cityB.population, cityB.coords.lat)}
                                    </div>
                                    <div className={`text-xl font-bold uppercase tracking-widest ${
                                        (lastGuess === 'higher' && isHigherValid) || (lastGuess === 'lower' && !isHigherValid) 
                                            ? 'text-green-400/80' 
                                            : 'text-red-500/80'
                                    }`}>
                                        { (lastGuess === 'higher' && isHigherValid) || (lastGuess === 'lower' && !isHigherValid) ? 'Correct !' : 'Faux !' }
                                    </div>
                                </div>
                            );
                        })()}
                        </div>
                    )}

                </div>
                {/* PANEL 3: NEXT CITY (Off-screen Right) */}
                {nextCity && (
                    <div className={`w-[100vw] md:w-[50vw] h-[50vh] md:h-full flex flex-col items-center justify-center p-8 relative transition-colors duration-1000 ${designNext.bgClass}`}>
                        <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${designNext.gradientClass} to-transparent transition-colors duration-1000`}></div>
                        <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-2 z-10 drop-shadow-xl tracking-tight">{nextCity.name}</h2>
                        <div className="text-white/80 text-lg md:text-xl font-medium tracking-widest uppercase mb-8 z-10">a une population</div>
                    </div>
                )}
            </div>

            {/* VS Badge (Center) - Kept out of the sliding track so it stays centered permanently */}
            <div className="absolute top-[50vh] md:top-1/2 left-[50vw] -translate-x-1/2 -translate-y-1/2 z-20 bg-white text-slate-900 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-black text-xl md:text-2xl shadow-2xl border-4 border-slate-900">
                VS
            </div>

                {/* GAME OVER SCREEN */}
                {gameState === 'lost' && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500 p-4">
                        <div className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full text-center">
                            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                            <h2 className="text-3xl font-black text-white mb-2">Game Over</h2>
                            {score >= bestScore && score > 0 ? (
                                <p className="text-yellow-400 font-bold mb-6">Nouveau Record ! 🎉</p>
                            ) : (
                                <p className="text-slate-400 mb-6">Vous avez fait une erreur !</p>
                            )}
                            
                            <div className="flex gap-4 w-full mb-8">
                                <div className="flex-1 bg-slate-800 py-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Score Actuel</div>
                                    <div className="text-4xl font-black text-white">{score}</div>
                                </div>
                                <div className="flex-1 bg-yellow-500/10 py-4 rounded-2xl border border-yellow-500/20 flex flex-col items-center">
                                    <div className="text-xs text-yellow-500/80 font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Trophy className="w-3 h-3" /> Meilleur
                                    </div>
                                    <div className="text-4xl font-black text-yellow-400">{bestScore}</div>
                                </div>
                            </div>

                            <button
                                onClick={initGame}
                                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-colors mb-3"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Rejouer
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full py-4 rounded-xl font-bold text-lg text-slate-400 hover:bg-white/5 transition-colors"
                            >
                                Retour au menu
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
}
