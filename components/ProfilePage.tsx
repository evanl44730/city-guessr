import React, { useEffect, useState } from 'react';
import { Home, Trophy, Clock, Ruler, Compass, TrendingUp, LayoutGrid, MapPin, Star, Trash2, Radar, Book, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getFoundCities, FOUND_CITIES_KEY } from '@/utils/progressTracker';
import { getUnlockedAchievements, ACHIEVEMENTS } from '@/utils/achievements';
import { CityData } from '@/utils/gameUtils';

const DynamicHeatmap = dynamic(() => import('./Heatmap'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-800/50 animate-pulse text-slate-400">Chargement de la carte...</div>
});

interface ProfilePageProps {
    onBack: () => void;
}

interface GameRecord {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    format: (val: number) => string;
    type: 'higher_is_better' | 'lower_is_better';
}

const GAME_RECORDS: GameRecord[] = [
    {
        key: 'timeAttackBestScore',
        label: 'Contre-la-montre',
        icon: <Clock className="w-6 h-6" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        format: (v) => `${v} pts`,
        type: 'higher_is_better',
    },
    {
        key: 'higherLowerBestScore',
        label: 'Plus ou Moins',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500/30',
        format: (v) => `${v} pts`,
        type: 'higher_is_better',
    },
    {
        key: 'higherLowerLatitudeBestScore',
        label: 'Nord ou Sud',
        icon: <Compass className="w-6 h-6" />,
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-500/20',
        borderColor: 'border-indigo-500/30',
        format: (v) => `${v} pts`,
        type: 'higher_is_better',
    },
    {
        key: 'shapeGameBestScore',
        label: "L'Ombre Mystère",
        icon: <LayoutGrid className="w-6 h-6" />,
        color: 'text-fuchsia-400',
        bgColor: 'bg-fuchsia-500/20',
        borderColor: 'border-fuchsia-500/30',
        format: (v) => `${v} pts`,
        type: 'higher_is_better',
    },
    {
        key: 'distanceGameBest',
        label: 'Le Juste km',
        icon: <Ruler className="w-6 h-6" />,
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/20',
        borderColor: 'border-teal-500/30',
        format: (v) => `${v} / 10 000`,
        type: 'higher_is_better',
    },
    {
        key: 'deptTimeAttackBest',
        label: 'Chrono Départements',
        icon: <Clock className="w-6 h-6" />,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
        format: (v) => {
            const seconds = Math.floor(v / 10);
            const ds = v % 10;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            if (minutes > 0) return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${ds}`;
            return `${remainingSeconds}.${ds}s`;
        },
        type: 'lower_is_better',
    },
];

export default function ProfilePage({ onBack }: ProfilePageProps) {
    const [records, setRecords] = useState<Record<string, number | null>>({});
    const [storyProgress, setStoryProgress] = useState<Record<string, number>>({});
    const [radarStreaks, setRadarStreaks] = useState<Record<string, number>>({});
    const [foundCities, setFoundCities] = useState<CityData[]>([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const newRecords: Record<string, number | null> = {};
        GAME_RECORDS.forEach(r => {
            const val = localStorage.getItem(r.key);
            newRecords[r.key] = val ? parseInt(val, 10) : null;
        });
        setRecords(newRecords);

        // Story progress
        const savedStory = localStorage.getItem('city_guessr_story_progress');
        if (savedStory) {
            try {
                setStoryProgress(JSON.parse(savedStory));
            } catch {
                setStoryProgress({});
            }
        }

        // Radar streaks
        const savedRadar = localStorage.getItem('radarBestStreaks');
        if (savedRadar) {
            try {
                setRadarStreaks(JSON.parse(savedRadar));
            } catch {
                setRadarStreaks({});
            }
        }
        
        setFoundCities(getFoundCities());
        setUnlockedAchievements(getUnlockedAchievements());
        setIsMounted(true);
    }, []);

    const completedLevels = Object.keys(storyProgress).length;
    const totalStars = Object.values(storyProgress).reduce((sum, v) => sum + (v > 0 ? 1 : 0), 0);

    const handleResetAll = () => {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous vos records ? Cette action est irréversible.')) {
            GAME_RECORDS.forEach(r => localStorage.removeItem(r.key));
            localStorage.removeItem('city_guessr_story_progress');
            localStorage.removeItem('city_guessr_daily_progress');
            localStorage.removeItem('radarBestStreaks');
            localStorage.removeItem(FOUND_CITIES_KEY);
            setRecords({});
            setStoryProgress({});
            setRadarStreaks({});
            setFoundCities([]);
            setUnlockedAchievements([]);
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-slate-900 animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-4 md:px-8 z-[1000] bg-slate-900/80 backdrop-blur-md border-b border-white/5 shadow-md">
                <button onClick={onBack} className="p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                    <Home className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex-1 flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 tracking-tight">
                        Mon Profil
                    </h1>
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase">Records &amp; Statistiques</p>
                </div>

                <div className="w-11"></div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-2xl mx-auto flex flex-col gap-6">

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white">Joueur</h2>
                                <p className="text-sm text-slate-400 font-medium">CityGuessr Champion</p>
                            </div>
                        </div>
                        <div className="flex gap-6 mt-4">
                            <div className="flex flex-col items-center flex-1 bg-slate-800/50 rounded-2xl p-4">
                                <Star className="w-5 h-5 text-amber-400 mb-1" />
                                <span className="text-2xl font-black text-white font-mono">{totalStars}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Étoiles</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 bg-slate-800/50 rounded-2xl p-4">
                                <MapPin className="w-5 h-5 text-blue-400 mb-1" />
                                <span className="text-2xl font-black text-white font-mono">{completedLevels}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Niveaux</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 bg-slate-800/50 rounded-2xl p-4">
                                <Trophy className="w-5 h-5 text-emerald-400 mb-1" />
                                <span className="text-2xl font-black text-white font-mono">
                                    {Object.values(records).filter(v => v !== null).length}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Records</span>
                            </div>
                        </div>
                    </div>

                    {/* Records Grid */}
                    <div>
                        <h3 className="text-lg md:text-xl font-black text-white mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            Meilleurs Scores
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {GAME_RECORDS.map(record => {
                                const value = records[record.key];
                                const hasRecord = value !== null && value !== undefined;

                                return (
                                    <div
                                        key={record.key}
                                        className={`relative group rounded-2xl border ${record.borderColor} bg-slate-800/60 backdrop-blur-sm p-4 md:p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-xl ${record.bgColor} ${record.color}`}>
                                                {record.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm md:text-base font-bold text-white">{record.label}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {hasRecord ? (
                                                        <>
                                                            <Trophy className="w-3 h-3 text-amber-400" />
                                                            <span className={`text-lg md:text-xl font-black font-mono ${record.color}`}>
                                                                {record.format(value!)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-slate-500 italic">Pas encore joué</span>
                                                    )}
                                                </div>
                                            </div>
                                            {record.type === 'lower_is_better' && hasRecord && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full uppercase">⏱ Temps</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Radar Streaks Section */}
                    <div>
                        <h3 className="text-lg md:text-xl font-black text-white mb-4 flex items-center gap-2">
                            <Radar className="w-5 h-5 text-green-400" />
                            Radar — Séries par difficulté
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { key: 'easy', label: 'Facile', color: 'green' },
                                { key: 'medium', label: 'Moyen', color: 'yellow' },
                                { key: 'hard', label: 'Difficile', color: 'orange' },
                                { key: 'expert', label: 'Expert', color: 'red' },
                            ].map(diff => {
                                const val = radarStreaks[diff.key] || 0;
                                return (
                                    <div key={diff.key} className={`rounded-2xl border border-${diff.color}-500/20 bg-slate-800/60 p-4 flex flex-col items-center gap-1 hover:scale-[1.02] transition-all`}>
                                        <span className={`text-[10px] font-bold text-${diff.color}-400 uppercase tracking-widest`}>{diff.label}</span>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-3 h-3 text-amber-400" />
                                            <span className={`text-2xl font-black font-mono text-${diff.color}-400`}>{val > 0 ? val : '—'}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-500 font-bold">meilleure série</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <Star className="w-6 h-6 text-amber-400" />
                            Mes Succès
                        </h3>
                        
                        <div className="flex flex-col gap-8 md:gap-10">
                            {[
                                { id: 'exploration', label: 'Exploration', icon: <MapPin className="w-5 h-5 text-blue-400" /> },
                                { id: 'story', label: 'Mode Histoire', icon: <Book className="w-5 h-5 text-amber-500" /> },
                                { id: 'challenges', label: 'Défis & Records', icon: <Trophy className="w-5 h-5 text-emerald-400" /> },
                                { id: 'easter_eggs', label: 'Insolites', icon: <Sparkles className="w-5 h-5 text-fuchsia-400" /> }
                            ].map(category => {
                                const categoryAchievements = ACHIEVEMENTS.filter(a => (a as any).category === category.id);
                                if (categoryAchievements.length === 0) return null;

                                return (
                                    <div key={category.id}>
                                        <h4 className="text-md md:text-lg font-bold text-slate-300 mb-3 flex items-center gap-2">
                                            {category.icon}
                                            {category.label}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                                            {categoryAchievements.map(ach => {
                                                const isUnlocked = unlockedAchievements.includes(ach.id);
                                                return (
                                                    <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-2xl border bg-slate-800/60 backdrop-blur-sm transition-all ${isUnlocked ? 'border-white/20 hover:scale-[1.02]' : 'border-white/5 opacity-40 grayscale'}`}>
                                                        <div className={`text-3xl flex-shrink-0 ${isUnlocked ? ach.color : 'text-slate-500'}`}>
                                                            {isUnlocked ? ach.icon : '🔒'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                                                            <p className="text-xs text-slate-400 mt-1 leading-tight">{ach.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Heatmap Section */}
                    <div>
                        <h3 className="text-lg md:text-xl font-black text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-500" />
                            Carte de Chaleur Personnelle
                            <span className="text-xs font-medium text-slate-400 ml-2 bg-slate-800 px-2 py-1 rounded-full">
                                {foundCities.length} {foundCities.length > 1 ? 'villes trouvées' : 'ville trouvée'}
                            </span>
                        </h3>
                        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-white/10 relative z-0 shadow-lg cursor-crosshair">
                            {isMounted && (
                                <DynamicHeatmap foundCities={foundCities} />
                            )}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="flex justify-center pt-4 pb-8">
                        <button
                            onClick={handleResetAll}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                            Réinitialiser tous les records
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
