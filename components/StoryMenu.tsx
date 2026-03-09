import { useState } from "react";
import { STORY_LEVELS, StoryLevel } from "@/data/storyLevels";
import { Lock, Star, Check, Map as MapIcon, Globe, LayoutGrid, ChevronDown } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { CityData } from "@/utils/gameUtils";

interface StoryMenuProps {
    onSelectLevel: (levelId: number) => void;
    onBack: () => void;
    progress: Record<number, number>;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    dynamicLevels?: StoryLevel[]; // Passed from useGame for departments
}

export default function StoryMenu({ onSelectLevel, onBack, progress, selectedCategory, onSelectCategory, dynamicLevels = [] }: StoryMenuProps) {
    // If it's a built-in category, use STORY_LEVELS. Otherwise, use dynamicLevels passed from useGame.
    const isDepartment = selectedCategory !== 'france' && selectedCategory !== 'capital';
    const filteredLevels = isDepartment ? dynamicLevels : STORY_LEVELS.filter(level => level.category === selectedCategory);

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

                    {/* Category Selection Dropdown */}
                    <div className="flex p-1 bg-slate-900/50 rounded-xl self-start w-full md:w-auto relative group z-20">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => onSelectCategory(e.target.value)}
                            className="appearance-none w-full md:w-64 bg-slate-800 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium shadow-inner"
                        >
                            <optgroup label="Modes Principaux">
                                <option value="france">🇫🇷 France (Villes Majeures)</option>
                                <option value="capital">🌍 Monde (Capitales)</option>
                            </optgroup>
                            <optgroup label="Explorer les 101 Départements">
                                {DEPARTMENTS.map(dep => (
                                    <option key={dep.id} value={`dept_${dep.id}`}>
                                        {dep.id} - {dep.name} ({dep.region})
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors h-5 w-5" />
                    </div>
                </div>

                {/* Levels Grid */}
                {filteredLevels.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 min-h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p>Chargement des villes du département...</p>
                    </div>
                ) : (
                <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4 p-1 md:p-2 custom-scrollbar flex-1 min-h-0">
                    {filteredLevels.map((level) => {
                        // Unlock logic:
                        // First level of each category is always unlocked.
                        const isFirstLevel = level.id === 1 || level.id === 101 || level.id === 201 || level.id === 301 || level.id === 401 || level.id === 501;
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
                )}
            </div>
        </div>
    );
}
