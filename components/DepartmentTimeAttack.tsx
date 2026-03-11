import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Trophy, RefreshCcw, Clock, AlertCircle } from 'lucide-react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEPARTMENTS } from '@/data/departments';

interface DepartmentTimeAttackProps {
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

// Dynamic bounds fitter for sub-maps (DOMs)
const MapFitter = ({ data }: { data: any }) => {
    const map = useMap();
    useEffect(() => {
        if (data && data.features && data.features.length > 0) {
            const layer = L.geoJSON(data);
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [5, 5] });
            }
        }
    }, [map, data]);
    return null;
};

export default function DepartmentTimeAttack({ onBack }: DepartmentTimeAttackProps) {
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'ended'>('loading');

    const [timeElapsed, setTimeElapsed] = useState(0); // in deciseconds (1/10th of a second)
    const [bestTime, setBestTime] = useState<number | null>(null);

    const [geoData, setGeoData] = useState<any>(null);

    const [targetSequence, setTargetSequence] = useState<typeof DEPARTMENTS>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [foundDepts, setFoundDepts] = useState<string[]>([]);

    // For visual feedback
    const [wrongFlashId, setWrongFlashId] = useState<string | null>(null);
    const [penaltyAnim, setPenaltyAnim] = useState(false);

    // Timer ref
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Load Best Time
        const savedBest = localStorage.getItem('deptTimeAttackBest');
        if (savedBest) {
            setBestTime(parseInt(savedBest, 10));
        }

        // Fetch GeoJSON
        fetch('/data/france-departments-dom.geojson')
            .then(res => res.json())
            .then(data => {
                setGeoData(data);
                startGame();
            })
            .catch(err => console.error("Error loading France GeoJSON:", err));

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startGame = useCallback(() => {
        setTargetSequence(shuffleArray(DEPARTMENTS));
        setCurrentIndex(0);
        setFoundDepts([]);
        setTimeElapsed(0);
        setWrongFlashId(null);
        setGameState('playing');

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeElapsed(prev => prev + 1); // increment every 100ms
        }, 100);
    }, []);

    const handleEndGame = (finalTime: number) => {
        setGameState('ended');
        if (timerRef.current) clearInterval(timerRef.current);

        if (bestTime === null || finalTime < bestTime) {
            setBestTime(finalTime);
            localStorage.setItem('deptTimeAttackBest', finalTime.toString());
        }
    };

    const handleMapClick = (deptId: string) => {
        if (gameState !== 'playing') return;

        const currentTarget = targetSequence[currentIndex];

        if (deptId === currentTarget.id) {
            // Correct
            const newFound = [...foundDepts, deptId];
            setFoundDepts(newFound);

            if (currentIndex + 1 >= targetSequence.length) {
                // Win game
                handleEndGame(timeElapsed);
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        } else {
            // Wrong click
            // Ignore if clicking an already found department
            if (foundDepts.includes(deptId)) return;

            // Flash red
            setWrongFlashId(deptId);
            setTimeout(() => setWrongFlashId(null), 500);

            // Add 5 seconds penalty (50 deciseconds)
            setTimeElapsed(prev => prev + 50);

            // Trigger penalty animation
            setPenaltyAnim(true);
            setTimeout(() => setPenaltyAnim(false), 500);
        }
    };

    const formatTime = (totalDs: number) => {
        const seconds = Math.floor(totalDs / 10);
        const ds = totalDs % 10;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${ds}`;
        }
        return `${remainingSeconds}.${ds}s`;
    };

    // --- MAP STYLES & INTERACTION ---
    const style = (feature: any) => {
        const deptId = feature.properties.code;

        const isFound = foundDepts.includes(deptId);
        const isWrong = wrongFlashId === deptId;
        const isHoverTarget = (!isFound && !isWrong); // Default interactive state

        let fillColor = '#1e293b'; // Default dark slate
        if (isFound) fillColor = '#22c55e'; // Green
        else if (isWrong) fillColor = '#ef4444'; // Red

        return {
            fillColor,
            weight: isFound ? 0.5 : 1,
            opacity: 1,
            color: '#cbd5e1',
            dashArray: isFound ? '' : '3',
            fillOpacity: isFound ? 0.8 : isWrong ? 0.9 : 0.4
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        const deptId = feature.properties.code;
        const deptName = feature.properties.nom;

        // Ensure we only make supported DEPARTMENTS interactive
        const isSupported = DEPARTMENTS.some(d => d.id === deptId);

        if (isSupported) {
            layer.on({
                mouseover: (e: any) => {
                    const l = e.target;
                    // Don't override color if found or flashing wrong
                    if (!foundDepts.includes(deptId) && wrongFlashId !== deptId) {
                        l.setStyle({
                            weight: 2,
                            color: '#e2e8f0', // Light border on hover to see where we click
                            fillColor: '#94a3b8', // Highlight grey
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                        l.bringToFront();
                    }
                },
                mouseout: (e: any) => {
                    layer.setStyle(style(feature));
                },
                click: () => handleMapClick(deptId)
            });
            // No tooltip in this mode — showing names would defeat the quiz!
        } else {
            // Non-supported departments: no interaction
        }
    };

    // Sub-component for rendering a DOM inset map
    const DomInsetMap = ({ id, title }: { id: string, title: string }) => {
        if (!geoData) return null;
        const domFeature = geoData.features.find((f: any) => f.properties.code === id);
        if (!domFeature) return null;

        const singleGeoData = { type: "FeatureCollection" as const, features: [domFeature] };

        const isFound = foundDepts.includes(id);
        const isWrong = wrongFlashId === id;

        // Custom highlight logic for inset container
        let ringClass = "border-white/20";
        if (isFound) ringClass = "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
        if (isWrong) ringClass = "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]";

        return (
            <div className={`flex flex-col items-center gap-1 group cursor-pointer`}
                onClick={() => handleMapClick(id)}>
                <div className={`w-14 h-14 md:w-20 md:h-20 bg-slate-900/50 border-2 rounded-xl overflow-hidden relative transition-all duration-300 ${ringClass} ${!isFound && !isWrong ? 'hover:scale-110 hover:border-slate-300 hover:z-50' : ''}`}>
                    <MapContainer
                        zoomControl={false} scrollWheelZoom={false} dragging={false} doubleClickZoom={false} attributionControl={false}
                        className="w-full h-full bg-transparent pointer-events-none" style={{ background: 'transparent' }}
                    >
                        <MapFitter data={singleGeoData as any} />
                        <GeoJSON data={singleGeoData as any} style={style} />
                    </MapContainer>
                    {/* Hover overlay hint */}
                    {!isFound && !isWrong && (
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 pointer-events-none transition-colors" />
                    )}
                </div>
            </div>
        );
    };


    if (gameState === 'loading') {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 animate-in fade-in duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Chargement de la carte...</h2>
            </div>
        );
    }

    const currentTarget = targetSequence[currentIndex];

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-slate-900 animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-4 md:px-8 pb-2 safe-top z-[1000] bg-slate-900/80 backdrop-blur-md border-b border-white/5 shadow-md">
                <button
                    onClick={onBack}
                    className="p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <Home className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Target Department Display */}
                {gameState === 'playing' ? (
                    <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">Où se trouve ?</span>
                        <div className="bg-slate-800/80 border border-slate-600 px-4 py-2 md:px-8 md:py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in pop-in duration-300">
                            <h2 className="text-lg md:text-3xl font-black text-white text-center">
                                {currentTarget?.name} <span className="text-slate-400">({currentTarget?.id})</span>
                            </h2>
                        </div>
                        <span className="text-xs text-slate-500 font-bold mt-1">
                            {currentIndex + 1} / {targetSequence.length}
                        </span>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                        <h2 className="text-2xl md:text-4xl font-black text-green-400 text-center uppercase tracking-tight">Terminé !</h2>
                    </div>
                )}

                {/* Timer Display */}
                <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Chrono
                    </span>
                    <div className={`text-2xl md:text-3xl font-black font-mono transition-colors duration-200 ${penaltyAnim ? 'text-red-500 scale-110 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-white'}`}>
                        {formatTime(timeElapsed)}
                    </div>
                    {penaltyAnim && (
                        <div className="absolute text-red-500 font-bold text-sm md:text-base -translate-y-8 animate-out fade-out slide-out-to-top duration-500">
                            +5.0s
                        </div>
                    )}
                </div>
            </header>

            {/* Main Game Area */}
            <div className="flex-1 relative w-full h-full bg-slate-800/50 flex flex-col md:flex-row shadow-inner overflow-hidden">

                {/* Main map container */}
                <div className="flex-1 relative h-full">
                    {geoData && (
                        <MapContainer
                            center={[46.603354, 1.888334]}
                            zoom={5.5}
                            zoomControl={false}
                            scrollWheelZoom={true} // Allow zooming into small departments like in Ile de France!
                            dragging={true}
                            className="w-full h-full bg-transparent outline-none"
                            style={{ background: 'transparent' }}
                        >
                            <GeoJSON
                                // Force re-render of styles quickly when foundDepts or wrongFlashId changes
                                key={`${foundDepts.length}-${wrongFlashId}`}
                                data={geoData}
                                style={style}
                                onEachFeature={onEachFeature}
                                filter={(feature) => !['971', '972', '973', '974', '976'].includes(feature.properties.code)}
                            />
                        </MapContainer>
                    )}
                </div>

                {/* DOM Insets Panel */}
                <div className="absolute bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:w-32 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 p-2 md:p-3 shadow-2xl flex flex-row md:flex-col gap-2 md:gap-4 justify-around md:justify-center overflow-x-auto md:overflow-y-auto z-[500]">
                    <DomInsetMap id="971" title="Guad." />
                    <DomInsetMap id="972" title="Mart." />
                    <DomInsetMap id="973" title="Guyane" />
                    <DomInsetMap id="974" title="Réunion" />
                    <DomInsetMap id="976" title="Mayotte" />
                </div>

                {/* Game Over Screen */}
                {gameState === 'ended' && (
                    <div className="absolute inset-0 z-[1000] bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500 zoom-in-95">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">Bravo !</h2>
                        <p className="text-xl md:text-2xl text-slate-300 font-medium mb-8">Vous avez trouvé les {targetSequence.length} départements.</p>

                        <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Votre Temps</span>
                                <div className="text-5xl font-black text-white font-mono mt-1">{formatTime(timeElapsed)}</div>
                            </div>

                            <div className="w-full h-px bg-slate-700"></div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-amber-500/80 uppercase tracking-widest flex items-center gap-1">
                                    <Trophy className="w-3 h-3" /> Record Actuel
                                </span>
                                <div className="text-2xl font-black text-amber-400 font-mono mt-1">{bestTime ? formatTime(bestTime) : formatTime(timeElapsed)}</div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={onBack}
                                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors"
                            >
                                Menu Principal
                            </button>
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center gap-2"
                            >
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
