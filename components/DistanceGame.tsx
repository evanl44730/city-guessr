import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home, Trophy, RefreshCcw, Ruler, ChevronRight, Target } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CityData, calculateDistance } from '@/utils/gameUtils';
import { checkAndNotifyAchievements } from '@/utils/achievements';

interface DistanceGameProps {
    citiesData: CityData[];
    onBack: () => void;
}

const TOTAL_ROUNDS = 10;
const MAX_SCORE = TOTAL_ROUNDS * 1000;
const MAX_SLIDER_KM = 2000;

// Custom markers
const createCityIcon = (color: string) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

const iconA = createCityIcon('#14b8a6'); // teal
const iconB = createCityIcon('#06b6d4'); // cyan

// Pick two distinct random cities from a pool
const pickTwoCities = (pool: CityData[]): [CityData, CityData] => {
    if (pool.length < 2) throw new Error('Need at least 2 cities');
    let a: CityData, b: CityData;
    let attempts = 0;
    do {
        a = pool[Math.floor(Math.random() * pool.length)];
        b = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
    } while ((a.name === b.name || calculateDistance(a.coords, b.coords) < 30) && attempts < 100);
    return [a, b];
};

// Score: 0–1000 per round
const calculateScore = (guess: number, actual: number): number => {
    const errorPct = Math.abs(guess - actual) / actual;
    if (errorPct <= 0.02) return 1000;
    if (errorPct >= 1.0) return 0;
    return Math.round(1000 * (1 - errorPct));
};

const getAccuracyLabel = (guess: number, actual: number): { text: string; color: string; emoji: string } => {
    const errorPct = Math.abs(guess - actual) / actual;
    if (errorPct <= 0.05) return { text: 'Parfait !', color: 'text-green-400', emoji: '🎯' };
    if (errorPct <= 0.15) return { text: 'Excellent !', color: 'text-emerald-400', emoji: '🔥' };
    if (errorPct <= 0.30) return { text: 'Bien joué !', color: 'text-blue-400', emoji: '👍' };
    if (errorPct <= 0.50) return { text: 'Pas mal', color: 'text-yellow-400', emoji: '🤔' };
    return { text: 'Raté...', color: 'text-red-400', emoji: '😬' };
};

// Auto-fit map to show both cities
const MapFitter = ({ a, b }: { a: [number, number]; b: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        const bounds = L.latLngBounds([a, b]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }, [map, a, b]);
    return null;
};

export default function DistanceGame({ citiesData, onBack }: DistanceGameProps) {
    const [round, setRound] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [gameState, setGameState] = useState<'guessing' | 'result' | 'ended'>('guessing');
    const [sliderValue, setSliderValue] = useState(500);
    const [roundScore, setRoundScore] = useState(0);

    const cityPool = useMemo(() => {
        return citiesData.filter(c => c.coords && c.coords.lat && c.coords.lng && c.population > 10000);
    }, [citiesData]);

    const [pairs, setPairs] = useState<[CityData, CityData][]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('distanceGameBest');
        if (saved) setBestScore(parseInt(saved, 10));
    }, []);

    const startGame = useCallback(() => {
        if (cityPool.length < 2) return;
        const newPairs: [CityData, CityData][] = [];
        for (let i = 0; i < TOTAL_ROUNDS; i++) {
            newPairs.push(pickTwoCities(cityPool));
        }
        setPairs(newPairs);
        setRound(0);
        setTotalScore(0);
        setSliderValue(500);
        setRoundScore(0);
        setGameState('guessing');
    }, [cityPool]);

    useEffect(() => {
        if (cityPool.length >= 2) startGame();
    }, [cityPool, startGame]);

    const currentPair = pairs[round];
    const actualDistance = currentPair ? Math.round(calculateDistance(currentPair[0].coords, currentPair[1].coords)) : 0;

    const handleSubmitGuess = () => {
        const score = calculateScore(sliderValue, actualDistance);
        setRoundScore(score);
        setTotalScore(prev => prev + score);
        setGameState('result');
    };

    const handleNextRound = () => {
        if (round + 1 >= TOTAL_ROUNDS) {
            const finalScore = totalScore;
            if (bestScore === null || finalScore > bestScore) {
                setBestScore(finalScore);
                localStorage.setItem('distanceGameBest', finalScore.toString());
                checkAndNotifyAchievements();
            }
            setGameState('ended');
        } else {
            setRound(prev => prev + 1);
            setSliderValue(500);
            setRoundScore(0);
            setGameState('guessing');
        }
    };

    if (cityPool.length < 2 || (!currentPair && gameState !== 'ended')) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                <h2 className="text-xl font-bold text-white">Chargement...</h2>
            </div>
        );
    }

    const accuracy = currentPair ? getAccuracyLabel(sliderValue, actualDistance) : null;

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-slate-900 animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-3 md:px-8 md:py-4 z-[1000] bg-slate-900/80 backdrop-blur-md border-b border-white/5 shadow-md">
                <button onClick={onBack} className="p-2.5 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                    <Home className="w-5 h-5" />
                </button>

                <div className="flex-1 flex flex-col items-center">
                    <h1 className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 tracking-tight">
                        Le Juste Kilomètre
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 font-bold">
                        <span>Manche {round + 1}/{TOTAL_ROUNDS}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <span>Score : <span className="text-white">{totalScore}</span><span className="text-slate-500">/{MAX_SCORE}</span></span>
                    </div>
                </div>

                <div className="flex flex-col items-end min-w-[60px]">
                    <span className="text-[10px] md:text-xs font-bold text-amber-500/80 tracking-wider uppercase flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Record
                    </span>
                    <span className="text-base md:text-lg font-black text-amber-400 font-mono">{bestScore ?? '—'}</span>
                </div>
            </header>

            {/* Game Content */}
            <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar p-3 md:p-6 gap-4 md:gap-6">

                {gameState !== 'ended' && currentPair && (
                    <>
                        {/* City Names */}
                        <div className="flex flex-row items-center gap-3 md:gap-6 animate-in fade-in slide-in-from-top-4 duration-500 flex-shrink-0">
                            <div className="bg-slate-800/80 border border-teal-500/30 px-4 py-2.5 md:px-8 md:py-4 rounded-2xl shadow-xl shadow-teal-500/5 text-center">
                                <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Ville A</span>
                                <h2 className="text-lg md:text-3xl font-black text-white mt-0.5">{currentPair[0].name}</h2>
                            </div>

                            <div className="flex flex-col items-center gap-0.5">
                                <Ruler className="w-5 h-5 md:w-7 md:h-7 text-teal-400 rotate-45" />
                            </div>

                            <div className="bg-slate-800/80 border border-cyan-500/30 px-4 py-2.5 md:px-8 md:py-4 rounded-2xl shadow-xl shadow-cyan-500/5 text-center">
                                <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Ville B</span>
                                <h2 className="text-lg md:text-3xl font-black text-white mt-0.5">{currentPair[1].name}</h2>
                            </div>
                        </div>

                        {/* Slider + Guess */}
                        <div className="w-full max-w-xl flex flex-col items-center gap-3 flex-shrink-0">
                            <div className="text-center">
                                <div className={`text-4xl md:text-6xl font-black font-mono tracking-tighter transition-colors duration-200 ${gameState === 'result' ? (accuracy?.color || 'text-white') : 'text-white'
                                    }`}>
                                    {sliderValue} <span className="text-xl md:text-2xl text-slate-400 font-bold">km</span>
                                </div>
                            </div>

                            <div className="w-full px-2">
                                <input
                                    type="range"
                                    min={10}
                                    max={MAX_SLIDER_KM}
                                    step={5}
                                    value={sliderValue}
                                    onChange={(e) => setSliderValue(parseInt(e.target.value, 10))}
                                    disabled={gameState === 'result'}
                                    className="w-full h-3 rounded-full appearance-none cursor-pointer bg-slate-700 accent-teal-500 disabled:opacity-50 disabled:cursor-not-allowed
                                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-teal-500/40 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/30
                                               [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-400 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-teal-500/40 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/30"
                                />
                                <div className="flex justify-between text-[10px] md:text-xs text-slate-500 mt-1 font-mono">
                                    <span>10 km</span>
                                    <span>{MAX_SLIDER_KM} km</span>
                                </div>
                            </div>
                        </div>

                        {/* Result: Stats + Map */}
                        {gameState === 'result' && (
                            <div className="w-full max-w-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-400 flex-shrink-0">
                                {/* Stats bar */}
                                <div className="bg-slate-800/80 border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex flex-row items-center gap-3 md:gap-6 w-full text-center">
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase">Réelle</span>
                                        <span className="text-xl md:text-2xl font-black text-teal-400 font-mono">{actualDistance} km</span>
                                    </div>
                                    <div className="w-px h-10 bg-slate-700"></div>
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase">Estimation</span>
                                        <span className="text-xl md:text-2xl font-black text-white font-mono">{sliderValue} km</span>
                                    </div>
                                    <div className="w-px h-10 bg-slate-700"></div>
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase">Erreur</span>
                                        <span className={`text-lg md:text-xl font-black font-mono ${accuracy?.color}`}>
                                            {Math.abs(sliderValue - actualDistance)} km
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl md:text-3xl">{accuracy?.emoji}</span>
                                        <span className={`text-[10px] md:text-xs font-black ${accuracy?.color}`}>{accuracy?.text}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">+{roundScore} pts</span>
                                    </div>
                                </div>

                                {/* Map showing both cities */}
                                <div className="w-full h-[30vh] md:h-[35vh] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                    <MapContainer
                                        center={[
                                            (currentPair[0].coords.lat + currentPair[1].coords.lat) / 2,
                                            (currentPair[0].coords.lng + currentPair[1].coords.lng) / 2
                                        ]}
                                        zoom={5}
                                        zoomControl={true}
                                        scrollWheelZoom={true}
                                        dragging={true}
                                        className="w-full h-full"
                                        style={{ background: '#0f172a' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://carto.com">CARTO</a>'
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        />
                                        <MapFitter
                                            a={[currentPair[0].coords.lat, currentPair[0].coords.lng]}
                                            b={[currentPair[1].coords.lat, currentPair[1].coords.lng]}
                                        />
                                        {/* Markers */}
                                        <Marker
                                            position={[currentPair[0].coords.lat, currentPair[0].coords.lng]}
                                            icon={iconA}
                                        />
                                        <Marker
                                            position={[currentPair[1].coords.lat, currentPair[1].coords.lng]}
                                            icon={iconB}
                                        />
                                        {/* Line between cities */}
                                        <Polyline
                                            positions={[
                                                [currentPair[0].coords.lat, currentPair[0].coords.lng],
                                                [currentPair[1].coords.lat, currentPair[1].coords.lng]
                                            ]}
                                            pathOptions={{
                                                color: '#14b8a6',
                                                weight: 3,
                                                dashArray: '8, 8',
                                                opacity: 0.8
                                            }}
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="flex-shrink-0 pb-4">
                            {gameState === 'guessing' ? (
                                <button
                                    onClick={handleSubmitGuess}
                                    className="px-10 py-4 md:px-14 md:py-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-teal-900/30 transition-all hover:scale-105 flex items-center gap-3"
                                >
                                    <Target className="w-6 h-6" />
                                    Valider
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextRound}
                                    className="px-10 py-4 md:px-14 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-blue-900/30 transition-all hover:scale-105 flex items-center gap-3"
                                >
                                    {round + 1 >= TOTAL_ROUNDS ? 'Voir le score final' : 'Suivant'}
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Game Over */}
                {gameState === 'ended' && (
                    <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
                        <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">Terminé !</h2>

                        <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score Final</span>
                                <div className="text-5xl font-black text-white font-mono mt-1">{totalScore}</div>
                                <div className="text-sm text-slate-400 font-medium mt-1">sur {MAX_SCORE} possible</div>
                            </div>

                            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(totalScore / MAX_SCORE) * 100}%` }}
                                />
                            </div>

                            <div className="w-full h-px bg-slate-700"></div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-amber-500/80 uppercase tracking-widest flex items-center gap-1">
                                    <Trophy className="w-3 h-3" /> Record
                                </span>
                                <div className="text-2xl font-black text-amber-400 font-mono mt-1">{bestScore ?? totalScore}</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onBack} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors">
                                Menu Principal
                            </button>
                            <button onClick={startGame} className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-teal-900/20 transition-all flex items-center gap-2">
                                <RefreshCcw className="w-5 h-5" />
                                Rejouer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
