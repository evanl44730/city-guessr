import { useState } from "react";
import { STORY_LEVELS } from "@/data/storyLevels";
import { Lock, Star, Check, Map as MapIcon, Globe, LayoutGrid } from "lucide-react";

interface StoryMenuProps {
    onSelectLevel: (levelId: number) => void;
    onBack: () => void;
    progress: Record<number, number>;
}

export default function StoryMenu({ onSelectLevel, onBack, progress }: StoryMenuProps) {
    const [selectedCategory, setSelectedCategory] = useState<'france' | 'capital' | 'haute_garonne'>('france');

    const filteredLevels = STORY_LEVELS.filter(level => level.category === selectedCategory);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl shadow-2xl p-4 md:p-8 w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] flex flex-col overflow-hidden backdrop-blur-xl">

                {/* Header & Tabs */}
                <div className="flex flex-col gap-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 md:p-3 rounded-xl bg-amber-500/20 text-amber-400">
                                <Star className="h-5 w-5 md:h-6 md:w-6 fill-amber-500/20" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Mode Histoire</h2>
                                <p className="text-slate-400 text-xs md:text-sm">Complétez les niveaux pour débloquer la suite</p>
                            </div>
                        </div>
                        <button
                            onClick={onBack}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/20 font-medium text-sm md:text-base"
                        >
                            Retour
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex p-1 bg-slate-900/50 rounded-xl self-start overflow-x-auto max-w-full">
                        <button
                            onClick={() => setSelectedCategory('france')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'france'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MapIcon className="w-4 h-4" />
                            France
                        </button>
                        <button
                            onClick={() => setSelectedCategory('capital')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'capital'
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            Monde
                        </button>
                        <button
                            onClick={() => setSelectedCategory('haute_garonne')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'haute_garonne'
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Haute-Garonne
                        </button>
                    </div>
                </div>

                {/* Levels Grid */}
                <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4 p-1 md:p-2 custom-scrollbar flex-1 min-h-0">
                    {filteredLevels.map((level) => {
                        // Unlock logic: 
                        // Level 1, 101, 201 are always unlocked.
                        // Others require the previous level (id - 1) to be in progress.
                        const isFirstLevel = level.id === 1 || level.id === 101 || level.id === 201;
                        const isUnlocked = isFirstLevel || progress[level.id - 1] !== undefined;

                        const isCompleted = progress[level.id] !== undefined;
                        const bestScore = progress[level.id];

                        return (
                            <button
                                key={level.id}
                                onClick={() => isUnlocked && onSelectLevel(level.id)}
                                disabled={!isUnlocked}
                                className={`
                                    relative flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 group
                                    ${isCompleted
                                        ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20 hover:-translate-y-1'
                                        : isUnlocked
                                            ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10'
                                            : 'border-transparent bg-black/20 opacity-40 cursor-not-allowed grayscale'}
                                `}
                            >
                                <span className={`text-lg md:text-xl font-black mb-0.5 md:mb-1 ${isCompleted ? 'text-green-400' : isUnlocked ? 'text-white group-hover:text-blue-400' : 'text-slate-500'}`}>
                                    {level.id}
                                </span>

                                {isUnlocked ? (
                                    <div className="flex flex-col items-center w-full">
                                        <div className="w-full h-px bg-white/5 my-1 md:my-2" />
                                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-full">
                                            {isCompleted ? level.cityName : '???'}
                                        </span>
                                        {isCompleted ? (
                                            <div className="mt-1 md:mt-2 flex items-center gap-1 text-[10px] md:text-xs font-bold text-green-400 bg-green-400/10 px-1.5 md:px-2 py-0.5 rounded-full">
                                                <Check className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                {bestScore}
                                            </div>
                                        ) : (
                                            <div className="mt-1 md:mt-2 text-[9px] md:text-[10px] text-slate-500 bg-white/5 px-1.5 md:px-2 py-0.5 rounded-full">
                                                À faire
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-1 md:mt-2">
                                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
                                    </div>
                                )}

                                {level.difficulty === 'Hard' || level.difficulty === 'Very Hard' || level.difficulty === 'Expert' ? (
                                    <div className="absolute top-1 right-1 md:top-2 md:right-2">
                                        <Star className="h-2 w-2 md:h-2.5 md:w-2.5 text-amber-400 fill-amber-400" />
                                    </div>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
