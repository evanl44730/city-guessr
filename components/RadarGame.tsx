"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Home, RotateCcw, Trophy, Radar, Search, Crosshair, Zap, Target, Shield, Skull } from 'lucide-react';
import { CityData, calculateDistance, calculateDirection } from '@/utils/gameUtils';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GamePhase = 'menu' | 'playing' | 'won' | 'lost';

interface GuessEntry {
    city: CityData;
    distance: number;
    direction: string;
    angle: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; icon: React.ReactNode; minPop: number; maxAttempts: number; color: string; desc: string }> = {
    easy: { label: 'Facile', icon: <Target className="w-7 h-7" />, minPop: 100000, maxAttempts: 8, color: 'green', desc: 'Grandes villes · 8 essais' },
    medium: { label: 'Moyen', icon: <Shield className="w-7 h-7" />, minPop: 30000, maxAttempts: 6, color: 'yellow', desc: 'Villes moyennes · 6 essais' },
    hard: { label: 'Difficile', icon: <Zap className="w-7 h-7" />, minPop: 5000, maxAttempts: 5, color: 'orange', desc: 'Petites villes · 5 essais' },
    expert: { label: 'Expert', icon: <Skull className="w-7 h-7" />, minPop: 0, maxAttempts: 4, color: 'red', desc: 'Toutes les villes · 4 essais' },
};

interface RadarGameProps {
    citiesData: CityData[];
    onBack: () => void;
}

// Calculate angle from one city to another (for radar display)
const calcAngle = (from: { lat: number; lng: number }, to: { lat: number; lng: number }): number => {
    const dLng = to.lng - from.lng;
    const dLat = to.lat - from.lat;
    const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    return (angle + 360) % 360;
};

// Direction label in French
const DIR_LABELS: Record<string, string> = {
    'N': 'Nord', 'NE': 'Nord-Est', 'E': 'Est', 'SE': 'Sud-Est',
    'S': 'Sud', 'SW': 'Sud-Ouest', 'W': 'Ouest', 'NW': 'Nord-Ouest'
};

export default function RadarGame({ citiesData, onBack }: RadarGameProps) {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
    const [targetCity, setTargetCity] = useState<CityData | null>(null);
    const [guesses, setGuesses] = useState<GuessEntry[]>([]);
    const [maxAttempts, setMaxAttempts] = useState(6);

    // Streak / progression state
    const [streak, setStreak] = useState(0);
    const [bestStreaks, setBestStreaks] = useState<Record<string, number>>({});
    const [showWinFlash, setShowWinFlash] = useState(false);

    // Search state
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Radar sweep animation
    const [sweepAngle, setSweepAngle] = useState(0);
    useEffect(() => {
        if (gamePhase !== 'playing') return;
        const interval = setInterval(() => {
            setSweepAngle(prev => (prev + 2) % 360);
        }, 30);
        return () => clearInterval(interval);
    }, [gamePhase]);

    // Load best streaks from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('radarBestStreaks');
        if (saved) {
            try {
                setBestStreaks(JSON.parse(saved));
            } catch { /* ignore */ }
        }
    }, []);

    const saveBestStreak = (diff: Difficulty, currentStreak: number) => {
        setBestStreaks(prev => {
            const prevBest = prev[diff] || 0;
            if (currentStreak > prevBest) {
                const updated = { ...prev, [diff]: currentStreak };
                localStorage.setItem('radarBestStreaks', JSON.stringify(updated));
                return updated;
            }
            return prev;
        });
    };

    // Get valid cities for this difficulty
    const validCities = useMemo(() => {
        if (!difficulty) return [];
        const config = DIFFICULTY_CONFIG[difficulty];
        return citiesData
            .filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'))
            .filter(c => c.population && c.population >= config.minPop);
    }, [citiesData, difficulty]);

    // Search suggestions
    const searchPool = useMemo(() => {
        return citiesData.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
    }, [citiesData]);

    const filteredCities = useMemo(() => {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return searchPool
            .filter(city => city.name.toLowerCase().includes(q))
            .filter(city => !guesses.some(g => g.city.name === city.name))
            .slice(0, 6);
    }, [query, searchPool, guesses]);

    const startGame = useCallback((diff: Difficulty) => {
        setDifficulty(diff);
        const config = DIFFICULTY_CONFIG[diff];
        const pool = citiesData
            .filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'))
            .filter(c => c.population && c.population >= config.minPop);

        if (pool.length === 0) return;
        const target = pool[Math.floor(Math.random() * pool.length)];
        setTargetCity(target);
        setGuesses([]);
        setMaxAttempts(config.maxAttempts);
        setGamePhase('playing');
        setQuery('');
        setSweepAngle(0);
        setStreak(0);
    }, [citiesData]);

    const nextCity = useCallback(() => {
        if (!difficulty) return;
        const config = DIFFICULTY_CONFIG[difficulty];
        const pool = citiesData
            .filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'))
            .filter(c => c.population && c.population >= config.minPop);

        if (pool.length === 0) return;
        const target = pool[Math.floor(Math.random() * pool.length)];
        setTargetCity(target);
        setGuesses([]);
        setQuery('');
        setGamePhase('playing');
        setSweepAngle(0);
    }, [citiesData, difficulty]);

    const handleGuess = useCallback((city: CityData) => {
        if (!targetCity || gamePhase !== 'playing') return;

        const distance = calculateDistance(city.coords, targetCity.coords);
        const direction = calculateDirection(city.coords, targetCity.coords);
        const angle = calcAngle(targetCity.coords, city.coords);

        const entry: GuessEntry = { city, distance, direction, angle };
        const newGuesses = [...guesses, entry];
        setGuesses(newGuesses);
        setQuery('');
        setShowSuggestions(false);

        // Check win
        const isWin = distance < 1 || city.name.toLowerCase() === targetCity.name.toLowerCase();

        if (isWin) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            saveBestStreak(difficulty!, newStreak);
            // Flash win then auto-advance
            setShowWinFlash(true);
            setGamePhase('won');
            setTimeout(() => {
                setShowWinFlash(false);
                nextCity();
            }, 1500);
            return;
        }

        // Check lose
        if (newGuesses.length >= maxAttempts) {
            // Save best streak before resetting
            saveBestStreak(difficulty!, streak);
            setGamePhase('lost');
        }
    }, [targetCity, guesses, maxAttempts, gamePhase, streak, difficulty, nextCity]);

    const handleSelectCity = (cityName: string) => {
        const city = searchPool.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        if (city) handleGuess(city);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const match = searchPool.find(c => c.name.toLowerCase() === query.toLowerCase());
        if (match) handleGuess(match);
    };

    const restart = () => {
        setGamePhase('menu');
        setDifficulty(null);
        setTargetCity(null);
        setGuesses([]);
        setQuery('');
        setStreak(0);
    };

    // ─── DIFFICULTY SELECTION SCREEN ─────────────────────────────────
    if (gamePhase === 'menu') {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
                {/* Animated background radar circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <div className="w-[600px] h-[600px] rounded-full border border-green-500/30 animate-ping" style={{ animationDuration: '4s' }} />
                    <div className="absolute w-[400px] h-[400px] rounded-full border border-green-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-[200px] h-[200px] rounded-full border border-green-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                </div>

                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all z-10"
                >
                    <Home className="w-6 h-6" />
                </button>

                <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-4">
                    <div className="p-4 bg-green-500/20 rounded-2xl mb-6">
                        <Radar className="w-12 h-12 text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Mode Radar</h1>
                    <p className="text-slate-400 text-center mb-10 text-lg">Pas de carte. Juste votre instinct et un radar.</p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG['easy']][]).map(([key, config]) => {
                            const best = bestStreaks[key] || 0;
                            return (
                                <button
                                    key={key}
                                    onClick={() => startGame(key)}
                                    className={`group relative flex flex-col items-center p-5 rounded-2xl bg-slate-800/60 backdrop-blur border border-white/10 
                                        hover:border-${config.color}-500/50 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-${config.color}-500/10
                                        transition-all duration-300`}
                                >
                                    <div className={`p-3 rounded-xl bg-${config.color}-500/20 text-${config.color}-400 mb-3 group-hover:bg-${config.color}-500 group-hover:text-white group-hover:scale-110 transition-all duration-300`}>
                                        {config.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">{config.label}</h3>
                                    <p className="text-xs text-slate-400 text-center">{config.desc}</p>
                                    {best > 0 && (
                                        <div className="mt-2 flex items-center gap-1 text-amber-400 text-xs font-bold">
                                            <Trophy className="w-3 h-3" />
                                            <span>Record : {best}</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ─── RADAR SVG ───────────────────────────────────────────────────
    const maxDist = guesses.length > 0 ? Math.max(...guesses.map(g => g.distance), 100) : 500;
    const radarRadius = 130; // SVG units

    const renderRadar = () => {
        const cx = 160, cy = 160;
        return (
            <svg viewBox="0 0 320 320" className="w-56 h-56 md:w-72 md:h-72">
                {/* Background */}
                <circle cx={cx} cy={cy} r={radarRadius} fill="#0a1a0a" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
                {/* Concentric rings */}
                {[0.25, 0.5, 0.75, 1].map((fraction, i) => (
                    <circle key={i} cx={cx} cy={cy} r={radarRadius * fraction} fill="none" stroke="#22c55e" strokeWidth="0.5" opacity={0.15} />
                ))}
                {/* Cross lines */}
                <line x1={cx} y1={cy - radarRadius} x2={cx} y2={cy + radarRadius} stroke="#22c55e" strokeWidth="0.5" opacity="0.15" />
                <line x1={cx - radarRadius} y1={cy} x2={cx + radarRadius} y2={cy} stroke="#22c55e" strokeWidth="0.5" opacity="0.15" />

                {/* Sweep line */}
                {gamePhase === 'playing' && (
                    <>
                        <defs>
                            <linearGradient id="sweepGrad" gradientUnits="userSpaceOnUse"
                                x1={cx} y1={cy}
                                x2={cx + radarRadius * Math.sin(sweepAngle * Math.PI / 180)}
                                y2={cy - radarRadius * Math.cos(sweepAngle * Math.PI / 180)}
                            >
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <line
                            x1={cx} y1={cy}
                            x2={cx + radarRadius * Math.sin(sweepAngle * Math.PI / 180)}
                            y2={cy - radarRadius * Math.cos(sweepAngle * Math.PI / 180)}
                            stroke="url(#sweepGrad)" strokeWidth="2"
                        />
                    </>
                )}

                {/* Center dot (TARGET) */}
                <circle cx={cx} cy={cy} r="4" fill="#22c55e" opacity="0.8" />

                {/* Guess blips */}
                {guesses.map((g, idx) => {
                    const normalizedDist = Math.min(g.distance / maxDist, 1);
                    const r = normalizedDist * radarRadius;
                    const rad = (g.angle - 90) * Math.PI / 180;
                    const px = cx + r * Math.cos(rad);
                    const py = cy + r * Math.sin(rad);
                    const isLatest = idx === guesses.length - 1;
                    return (
                        <g key={idx}>
                            <circle cx={px} cy={py} r={isLatest ? 5 : 3.5} fill={isLatest ? '#ef4444' : '#22c55e'} opacity={isLatest ? 1 : 0.6} />
                            {/* City name label */}
                            <text
                                x={px + 8} y={py + 4}
                                fill={isLatest ? '#ef4444' : '#86efac'}
                                fontSize="9"
                                fontWeight="bold"
                                opacity={isLatest ? 1 : 0.7}
                            >
                                {g.city.name}
                            </text>
                            {isLatest && (
                                <circle cx={px} cy={py} r="10" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5">
                                    <animate attributeName="r" from="5" to="18" dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    // ─── MAIN GAME SCREEN ────────────────────────────────────────────
    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden font-sans">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 md:px-8 pt-4 pb-2 z-10">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                >
                    <Home className="w-5 h-5" />
                </button>

                <div className="flex gap-3">
                    {/* Streak counter */}
                    <div className="flex flex-col items-center bg-green-500/10 backdrop-blur-md px-4 py-1 rounded-2xl border border-green-500/20">
                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Série</span>
                        <span className="text-green-400 font-black text-lg">{streak} 🔥</span>
                    </div>

                    <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-4 py-1 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Essais</span>
                        <span className="text-white font-black text-lg">{guesses.length} / {maxAttempts}</span>
                    </div>
                    {difficulty && (
                        <div className={`flex flex-col items-center bg-${DIFFICULTY_CONFIG[difficulty].color}-500/10 backdrop-blur-md px-4 py-1 rounded-2xl border border-${DIFFICULTY_CONFIG[difficulty].color}-500/20`}>
                            <span className={`text-[10px] text-${DIFFICULTY_CONFIG[difficulty].color}-400 font-bold uppercase tracking-wider`}>Difficulté</span>
                            <span className={`text-${DIFFICULTY_CONFIG[difficulty].color}-400 font-black text-lg`}>{DIFFICULTY_CONFIG[difficulty].label}</span>
                        </div>
                    )}

                    {/* Best streak badge */}
                    {difficulty && (bestStreaks[difficulty] || 0) > 0 && (
                        <div className="flex flex-col items-center bg-amber-500/10 backdrop-blur-md px-3 py-1 rounded-2xl border border-amber-500/20">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Record</span>
                            <span className="text-amber-400 font-black text-lg">{bestStreaks[difficulty]}</span>
                        </div>
                    )}
                </div>

                <div className="w-12" />
            </div>

            {/* Win flash overlay */}
            {showWinFlash && targetCity && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none">
                    <div className="bg-slate-900/90 border border-green-500/30 px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <Crosshair className="w-10 h-10 text-green-400 mb-2" />
                        <h2 className="text-2xl font-black text-white">{targetCity.name} ✓</h2>
                        <p className="text-green-400 font-bold text-lg">Série : {streak} 🔥</p>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 pb-4 overflow-y-auto">
                {/* Radar */}
                <div className="flex flex-col items-center">
                    <div className="relative">
                        {renderRadar()}
                    </div>

                    {/* Latest hint message */}
                    {guesses.length > 0 && gamePhase === 'playing' && (
                        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <span className="text-green-300 font-bold text-lg">
                                À {Math.round(guesses[guesses.length - 1].distance)} km au {DIR_LABELS[guesses[guesses.length - 1].direction]}
                            </span>
                        </div>
                    )}

                    {guesses.length === 0 && gamePhase === 'playing' && (
                        <div className="mt-4 text-slate-500 text-sm text-center animate-pulse">
                            Tapez un nom de ville pour commencer la triangulation...
                        </div>
                    )}
                </div>

                {/* Right panel: Search + history */}
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    {/* Search input */}
                    {gamePhase === 'playing' && (
                        <div className="relative">
                            <form onSubmit={handleSubmit}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Entrez une ville..."
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-green-500/20 bg-slate-900/80 backdrop-blur-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 font-medium tracking-wide transition-all"
                                    autoFocus
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-500/50 h-5 w-5" />
                            </form>

                            {/* Suggestions */}
                            {showSuggestions && filteredCities.length > 0 && (
                                <div className="absolute z-[100] w-full mt-2 bg-slate-900 border border-green-500/20 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                                    <ul className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                                        {filteredCities.map((city, idx) => (
                                            <li
                                                key={`${city.name}-${city.zip}-${idx}`}
                                                onClick={() => { handleSelectCity(city.name); setShowSuggestions(false); }}
                                                className="px-4 py-2.5 hover:bg-green-500/10 cursor-pointer text-slate-100 flex justify-between items-center rounded-lg transition-colors"
                                            >
                                                <span className="font-medium">{city.name}</span>
                                                <span className="text-xs font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{city.zip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {showSuggestions && (
                                <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setShowSuggestions(false)} aria-hidden="true" />
                            )}
                        </div>
                    )}

                    {/* Guess history */}
                    {guesses.length > 0 && (
                        <div className="bg-slate-800/40 backdrop-blur border border-white/5 rounded-xl overflow-hidden">
                            <div className="px-4 py-2 border-b border-white/5">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Historique</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                {[...guesses].reverse().map((g, idx) => (
                                    <div key={idx} className={`px-4 py-2.5 flex justify-between items-center border-b border-white/5 last:border-0 ${idx === 0 ? 'bg-green-500/5' : ''}`}>
                                        <span className="text-white font-medium text-sm">{g.city.name}</span>
                                        <span className="text-green-400 text-xs font-mono">{Math.round(g.distance)} km · {DIR_LABELS[g.direction]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* LOSE SCREEN (game over — show streak) */}
            {gamePhase === 'lost' && targetCity && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500 p-4">
                    <div className="bg-slate-900 border border-red-500/20 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full text-center">
                        <div className="p-4 bg-red-500/20 rounded-full mb-4">
                            <Radar className="w-12 h-12 text-red-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Signal Perdu</h2>
                        <p className="text-slate-400 mb-1">La ville était</p>
                        <p className="text-2xl font-black text-red-400 mb-2">{targetCity.name}</p>
                        <p className="text-sm text-slate-500 mb-4">{targetCity.population ? new Intl.NumberFormat('fr-FR').format(targetCity.population) + ' habitants' : ''}</p>

                        {/* Streak stats */}
                        <div className="w-full bg-slate-800/60 rounded-2xl p-4 mb-6 flex gap-4 justify-center">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Série</span>
                                <span className="text-2xl font-black text-white">{streak}</span>
                            </div>
                            <div className="w-px bg-slate-700"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><Trophy className="w-3 h-3" /> Record</span>
                                <span className="text-2xl font-black text-amber-400">{difficulty ? (bestStreaks[difficulty] || 0) : 0}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => startGame(difficulty!)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95"
                            >
                                <RotateCcw className="w-5 h-5" /> Réessayer
                            </button>
                            <button
                                onClick={restart}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-lg transition-all"
                            >
                                Difficulté
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
