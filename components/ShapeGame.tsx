import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Home, Trophy, RefreshCcw } from 'lucide-react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEPARTMENTS } from '@/data/departments';
import { EUROPEAN_COUNTRIES } from '@/data/europe';
import { checkAndNotifyAchievements } from '@/utils/achievements';

interface ShapeGameProps {
    onBack: () => void;
}

// Utility to shuffle an array
const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Dynamic bounds fitter for shape map
const MapFitter = ({ data }: { data: any }) => {
    const map = useMap();
    useEffect(() => {
        if (data && data.features && data.features.length > 0) {
            const layer = L.geoJSON(data);
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [10, 10], animate: false });
            }
        }
    }, [map, data]);
    return null;
};

export default function ShapeGame({ onBack }: ShapeGameProps) {
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'revealed' | 'lost'>('loading');
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    // GeoJSON Data
    const [deptGeoData, setDeptGeoData] = useState<any>(null);
    const [europeGeoData, setEuropeGeoData] = useState<any>(null);

    // Current Round Data
    const [currentShape, setCurrentShape] = useState<any>(null);
    const [targetName, setTargetName] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        // Load best score
        const savedBestStr = localStorage.getItem('shapeGameBestScore');
        if (savedBestStr) {
            setBestScore(parseInt(savedBestStr, 10) || 0);
        }

        // Fetch GeoJSONs
        Promise.all([
            fetch('/data/france-departments-dom.geojson').then(res => res.json()),
            fetch('/data/europe.geojson').then(res => res.json())
        ])
            .then(([deptData, europeData]) => {
                setDeptGeoData(deptData);
                setEuropeGeoData(europeData);
                setGameState('playing'); // start game after loading
            })
            .catch(err => {
                console.error("Error loading GeoJSON data for Shape Game:", err);
                // Fallback error handling could go here
            });
    }, []);

    const generateRound = useCallback(() => {
        if (!deptGeoData || !europeGeoData) return;

        // 50% chance for a department, 50% chance for a country
        const isFrance = Math.random() > 0.5;

        // Prepare pools based on what is available in the respective dataset
        let pool: { id: string, name: string }[] = [];
        let targetFeature: any = null;
        let tName = "";

        if (isFrance) {
            // Filter supported departments only
            const supportedDepts = DEPARTMENTS.map(d => d.id);
            const availableFeatures = deptGeoData.features.filter((f: any) => supportedDepts.includes(f.properties.code));
            if (availableFeatures.length === 0) return; // guard

            targetFeature = availableFeatures[Math.floor(Math.random() * availableFeatures.length)];

            const deptId = targetFeature.properties.code;
            const deptObj = DEPARTMENTS.find(d => d.id === deptId);
            tName = deptObj ? `${deptObj.name} (${deptId})` : targetFeature.properties.nom;

            pool = DEPARTMENTS.map(d => ({ id: d.id, name: `${d.name} (${d.id})` }));
        } else {
            // Filter supported countries
            const supportedCountries = EUROPEAN_COUNTRIES.map(c => c.id);
            const availableFeatures = europeGeoData.features.filter((f: any) => {
                const code = f.properties.iso_a2 || f.properties.ISO2;
                return supportedCountries.includes(code);
            });
            if (availableFeatures.length === 0) return; // guard

            targetFeature = availableFeatures[Math.floor(Math.random() * availableFeatures.length)];

            const countryId = targetFeature.properties.iso_a2 || targetFeature.properties.ISO2;
            const countryObj = EUROPEAN_COUNTRIES.find(c => c.id === countryId);
            tName = countryObj ? countryObj.name : targetFeature.properties.name;

            pool = EUROPEAN_COUNTRIES.map(c => ({ id: c.id, name: c.name }));
        }

        // Get 3 random distractors from the SAME pool
        const distractors = shuffleArray(pool.filter(item => item.name !== tName)).slice(0, 3).map(item => item.name);

        const finalOptions = shuffleArray([tName, ...distractors]);

        const singleGeoData = {
            type: "FeatureCollection" as const,
            features: [targetFeature]
        };

        setCurrentShape(singleGeoData);
        setTargetName(tName);
        setOptions(finalOptions);
        setSelectedOption(null);
        setGameState('playing');

    }, [deptGeoData, europeGeoData]);

    // Initial round once data is loaded
    useEffect(() => {
        if (gameState === 'playing' && !currentShape) {
            generateRound();
        }
    }, [gameState, currentShape, generateRound]);

    const handleOptionSelect = (option: string) => {
        if (gameState !== 'playing') return;

        setSelectedOption(option);

        if (option === targetName) {
            // Correct
            setGameState('revealed');
            const newScore = score + 1;
            setScore(newScore);
            if (newScore > bestScore) {
                setBestScore(newScore);
                localStorage.setItem('shapeGameBestScore', newScore.toString());
                checkAndNotifyAchievements();
            }

            // Wait 1.5s then next round
            setTimeout(() => {
                generateRound();
            }, 1500);
        } else {
            // Wrong
            setGameState('lost');
        }
    };

    const restartGame = () => {
        setScore(0);
        generateRound();
    };

    const mapStyle = {
        fillColor: '#ffffff', // Pure white silhouette
        weight: 0,            // No borders so it's a solid block
        fillOpacity: 1,
    };

    if (gameState === 'loading') {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 animate-in fade-in duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Analyse des formes...</h2>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-slate-900 animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-4 md:p-6 pb-2 safe-top z-10">
                <button
                    onClick={onBack}
                    className="p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors backdrop-blur-sm"
                >
                    <Home className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex gap-4 md:gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider uppercase">Score</span>
                        <div className="text-2xl md:text-3xl font-black text-white">{score}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] md:text-xs font-bold text-amber-500/50 tracking-wider uppercase">Record</span>
                        <div className="flex items-center gap-1.5 text-xl md:text-2xl font-black text-amber-400">
                            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                            {bestScore}
                        </div>
                    </div>
                </div>

                <div className="w-10"></div> {/* Spacer for balance */}
            </header>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-between p-2 md:p-4 pb-6 md:pb-8 relative min-h-0 w-full max-w-4xl mx-auto">

                {/* Visual Title */}
                <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-purple-400 mb-2 md:mb-4 tracking-tight drop-shadow-md text-center shrink-0">
                    L'Ombre Mystère
                </h1>

                {/* Status message placeholder to keep layout stable */}
                <div className="h-6 md:h-8 mb-2 flex items-center justify-center shrink-0">
                    {gameState === 'revealed' && (
                        <p className="text-green-400 font-bold text-base md:text-xl animate-bounce">Bien joué !</p>
                    )}
                    {gameState === 'lost' && (
                        <p className="text-red-400 font-bold text-base md:text-xl animate-pulse">Raté ! C'était {targetName}</p>
                    )}
                </div>

                {/* Silhouette Container - Flexes to take available space */}
                <div className="flex-1 w-full max-h-[40vh] md:max-h-[50vh] relative flex items-center justify-center bg-transparent min-h-[150px] mb-4 md:mb-6 transition-transform duration-500">
                    {currentShape && (
                        <MapContainer
                            zoomControl={false}
                            scrollWheelZoom={false}
                            dragging={false}
                            doubleClickZoom={false}
                            attributionControl={false}
                            className={`w-full h-full bg-transparent overflow-hidden filter transition-all duration-300 ${gameState === 'lost' ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]' : gameState === 'revealed' ? 'drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                            style={{ background: 'transparent' }}
                        >
                            <MapFitter data={currentShape} />
                            <GeoJSON
                                key={`shape-${targetName}`} // Force remount on new shape to ensure fitBounds works smoothly
                                data={currentShape}
                                style={mapStyle}
                            />
                        </MapContainer>
                    )}
                </div>

                {/* Options Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 shrink-0 mt-auto">
                    {options.map((option, idx) => {
                        let btnStyle = "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-blue-500";

                        if (gameState !== 'playing') {
                            if (option === targetName) {
                                btnStyle = "bg-green-500/20 border-green-500 text-green-400"; // Correct answer highlights green
                            } else if (option === selectedOption) {
                                btnStyle = "bg-red-500/20 border-red-500 text-red-400"; // Wrong answer selected highlights red
                            } else {
                                btnStyle = "bg-slate-800/40 border-slate-800 text-slate-600 opacity-50"; // Others fade out
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                disabled={gameState !== 'playing'}
                                className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 font-bold text-sm md:text-lg transition-all duration-200 ${btnStyle} flex items-center justify-center text-center`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {/* Try Again Button */}
                {gameState === 'lost' && (
                    <button
                        onClick={restartGame}
                        className="absolute bottom-1/2 translate-y-24 px-6 md:px-8 py-3 md:py-4 bg-white text-slate-900 font-bold rounded-full shadow-2xl hover:bg-slate-200 transition-all flex items-center gap-2 animate-in slide-in-from-bottom z-50 text-sm md:text-base"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Rejouer
                    </button>
                )}
            </div>
        </div>
    );
}
