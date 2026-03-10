import { useState, useMemo } from 'react';
import { ArrowLeft, Play, Calendar, Check, X } from 'lucide-react';

interface DailyProgress {
    attempts: number;
    win: boolean;
    city: string;
}

interface DailyMenuProps {
    onBack: () => void;
    onPlayDate: (dateStr: string) => void;
    dailyProgress: Record<string, DailyProgress>;
    citiesData: CityData[];
}

import { CityData, getDailyCity, getDifficultyFromPopulation } from '@/utils/gameUtils';

export default function DailyMenu({ onBack, onPlayDate, dailyProgress, citiesData }: DailyMenuProps) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Generate last 30 days
    const days = useMemo(() => {
        const result = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            result.push(d.toISOString().split('T')[0]);
        }
        return result;
    }, [todayStr]);

    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-slate-900 overflow-y-auto p-4 custom-scrollbar">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            
            {/* Header */}
            <div className="relative z-10 w-full max-w-4xl flex items-center justify-between mb-8 mt-12 md:mt-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all font-medium backdrop-blur-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        Défi Quotidien
                    </h1>
                </div>
                <div className="w-[100px]" /> {/* Spacer for centering */}
            </div>

            {/* List of Days Container */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-slate-900/50 border border-white/5 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
                <div className="h-full overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {days.map((dateStr, index) => {
                        const progress = dailyProgress[dateStr];
                        const isToday = dateStr === todayStr;
                        
                        // Get Daily City properly using deterministic random
                        let diffColor = 'border-white/10';
                        let diffText = '';
                        let textDiffColor = 'text-slate-400';
                        let bgDiffColor = 'bg-slate-800/80';
                        
                        if (citiesData && citiesData.length > 0) {
                            // Filter for France only, to mirror the game logic in useGame.ts
                            const franceCities = citiesData.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
                            const dailyCity = getDailyCity(franceCities, dateStr);
                            if (dailyCity) {
                                const difficulty = getDifficultyFromPopulation(dailyCity.population);
                                diffText = difficulty;
                                
                                switch (difficulty) {
                                    case 'Facile':
                                        diffColor = 'border-green-500/50 shadow-green-500/5 hover:border-green-400';
                                        textDiffColor = 'text-green-400';
                                        bgDiffColor = 'bg-green-500/10';
                                        break;
                                    case 'Moyen':
                                        diffColor = 'border-yellow-500/50 shadow-yellow-500/5 hover:border-yellow-400';
                                        textDiffColor = 'text-yellow-400';
                                        bgDiffColor = 'bg-yellow-500/10';
                                        break;
                                    case 'Difficile':
                                        diffColor = 'border-orange-500/50 shadow-orange-500/5 hover:border-orange-400';
                                        textDiffColor = 'text-orange-400';
                                        bgDiffColor = 'bg-orange-500/10';
                                        break;
                                    case 'Expert':
                                        diffColor = 'border-red-500/50 shadow-red-500/5 hover:border-red-400';
                                        textDiffColor = 'text-red-400';
                                        bgDiffColor = 'bg-red-500/10';
                                        break;
                                    default:
                                        diffColor = 'border-white/10 hover:border-slate-500/50';
                                }
                            }
                        }

                        // Format date (e.g., "10 Mars 2026")
                        const dateObj = new Date(dateStr);
                        const formattedDate = dateObj.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        });

                        return (
                            <div 
                                key={dateStr}
                                className={`
                                    relative flex flex-col p-4 md:p-5 rounded-2xl border backdrop-blur-md transition-all
                                    ${isToday ? 'bg-yellow-500/5 shadow-lg shadow-yellow-500/10 ring-1 ring-yellow-500/30' : 'bg-slate-800/40'}
                                    ${diffColor}
                                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col items-start gap-1.5">
                                        {isToday && (
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-500 text-yellow-950 text-[9px] font-black uppercase tracking-wider">
                                                Aujourd'hui
                                            </span>
                                        )}
                                        <h3 className="text-white font-bold leading-none">{formattedDate}</h3>
                                        {diffText && (
                                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${bgDiffColor} ${textDiffColor}`}>
                                                {diffText}
                                            </span>
                                        )}
                                    </div>
                                    {progress && (
                                        <div className={`p-1.5 rounded-full shrink-0 ${progress.win ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {progress.win ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </div>
                                    )}
                                </div>

                                {/* Status or Action */}
                                <div className="mt-auto pt-2">
                                    {progress ? (
                                        <div className="flex flex-col gap-1 bg-black/20 rounded-xl p-3 border border-white/5">
                                            <div className="text-xs text-slate-400 flex justify-between">
                                                <span>Ville:</span> <span className="text-white font-bold truncate max-w-[100px]" title={progress.city}>{progress.city}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 flex justify-between">
                                                <span>Essais:</span> <span className={`font-bold ${progress.win ? 'text-emerald-400' : 'text-red-400'}`}>{progress.attempts}/6</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onPlayDate(dateStr)}
                                            className={`
                                                w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95
                                                ${isToday 
                                                    ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-400 shadow-yellow-500/20' 
                                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'}
                                            `}
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Jouer
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
