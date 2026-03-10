import { useState } from "react";
import { STORY_LEVELS, StoryLevel } from "@/data/storyLevels";
import { Lock, Star, Check, X, Map as MapIcon, Globe, LayoutGrid, ChevronDown } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { EUROPEAN_COUNTRIES } from "@/data/europe";
import { getDifficultyFromPopulation } from "@/utils/gameUtils";

interface StoryMenuProps {
    onSelectLevel: (levelId: number) => void;
    onBack: () => void;
    progress: Record<number, number>;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    dynamicLevels?: StoryLevel[]; // Passed from useGame for departments
}

export default function StoryMenu({ onSelectLevel, onBack, progress, selectedCategory, onSelectCategory, dynamicLevels = [] }: StoryMenuProps) {
    const [regionType, setRegionType] = useState<'main' | 'dept' | 'europe'>(() => {
        if (selectedCategory.startsWith('dept_')) return 'dept';
        if (selectedCategory.startsWith('country_')) return 'europe';
        return 'main';
    });

    const handleRegionTypeChange = (type: string) => {
        setRegionType(type as any);
        if (type === 'main') onSelectCategory('france');
        if (type === 'dept') onSelectCategory('dept_01'); // Ain
        if (type === 'europe') onSelectCategory('country_AL'); // Albanie
    };

    // If it's a built-in category, use STORY_LEVELS. Otherwise, use dynamicLevels passed from useGame.
    const isDepartment = selectedCategory !== 'france' && selectedCategory !== 'capital';
    const filteredLevels = isDepartment ? dynamicLevels : STORY_LEVELS.filter(level => level.category === selectedCategory);

    // Progression Stats Calculation
    // Total Levels = 50 (France) + 30 (Capitals) + (101 * 30) (Depts) + (45 * 5) (Europe)
    const expectedDeptCities = 101 * 30; // 3030
    const expectedEuropeCities = EUROPEAN_COUNTRIES.length * 5; // 45 * 5 = 225
    const expectedClassicCities = 50 + 30; // 80
    
    // We limit total by 3335 (Max theoretic). 
    // In practice, since cities might be missing, 3335 is the absolute 100% completion target.
    const totalLevels = expectedDeptCities + expectedEuropeCities + expectedClassicCities;
    
    // Calculate wins (progress > 0) and failures (progress === -1)
    const progressValues = Object.values(progress);
    const winCount = progressValues.filter(p => p > 0).length;
    const failCount = progressValues.filter(p => p === -1).length;
    
    const winPercentage = Math.min(100, Math.max(0, (winCount / totalLevels) * 100));
    const failPercentage = Math.min(100, Math.max(0, (failCount / totalLevels) * 100));

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl shadow-2xl p-4 md:p-8 w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] flex flex-col overflow-hidden backdrop-blur-xl">

                {/* Header & Tabs */}
                <div className="flex flex-col gap-4 mb-6">
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
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/20 font-medium text-sm md:text-base shrink-0"
                        >
                            Retour
                        </button>
                    </div>

                    {/* Global Progression */}
                    <div className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex justify-between items-end mb-2 relative z-10">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest pl-1">Progression Globale</h3>
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <div className="flex items-center gap-1 text-green-400">
                                    <Check className="w-4 h-4" />
                                    <span className="text-xl font-black">{winCount}</span>
                                </div>
                                <div className="flex items-center gap-1 text-red-400">
                                    <X className="w-4 h-4" />
                                    <span className="text-xl font-black">{failCount}</span>
                                </div>
                                <span className="text-slate-500 font-medium ml-2">/ {totalLevels}</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative z-10 flex">
                            {/* Win Bar */}
                            <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out relative"
                                style={{ width: `${winPercentage}%` }}
                            >
                            </div>
                            {/* Fail Bar */}
                            <div 
                                className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000 ease-out relative"
                                style={{ width: `${failPercentage}%` }}
                            >
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-medium relative z-10">
                            <div className="text-green-400/80">{winPercentage.toFixed(1)}% réussis</div>
                            <div className="text-red-400/80">{failPercentage.toFixed(1)}% échoués</div>
                        </div>
                    </div>

                    {/* Category Selection Dropdowns */}
                    <div className="flex flex-col md:flex-row gap-4 relative z-20 w-full mb-2">
                        
                        {/* Region Type Dropdown */}
                        <div className="flex p-1 bg-slate-900/50 rounded-xl relative group w-full md:w-1/3">
                            <select 
                                value={regionType}
                                onChange={(e) => handleRegionTypeChange(e.target.value)}
                                className="appearance-none w-full bg-slate-800 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium shadow-inner"
                            >
                                <option value="main">🌍 Modes Classiques</option>
                                <option value="dept">🇫🇷 Départements</option>
                                <option value="europe">🇪🇺 Europe</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors h-5 w-5" />
                        </div>

                        {/* Specific Category Dropdown */}
                        <div className="flex p-1 bg-slate-900/50 rounded-xl relative group w-full md:w-2/3">
                            {/* Selected Europe Flag Overlay */}
                            {regionType === 'europe' && selectedCategory.startsWith('country_') && (
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                    <img 
                                        src={`https://flagcdn.com/w40/${selectedCategory.replace('country_', '').toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w80/${selectedCategory.replace('country_', '').toLowerCase()}.png 2x`}
                                        alt=""
                                        className="h-5 w-auto rounded-[2px] shadow-sm border border-white/10"
                                    />
                                </div>
                            )}
                            <select 
                                value={selectedCategory}
                                onChange={(e) => onSelectCategory(e.target.value)}
                                className={`appearance-none w-full bg-slate-800 border border-white/10 text-white rounded-lg py-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium shadow-inner ${regionType === 'europe' ? 'pl-12' : 'pl-4'}`}
                            >
                                {regionType === 'main' && (
                                    <>
                                        <option value="france">🇫🇷 France (50 Villes Majeures)</option>
                                        <option value="capital">🌍 Monde (30 Capitales)</option>
                                    </>
                                )}
                                {regionType === 'dept' && DEPARTMENTS.map(dep => (
                                    <option key={dep.id} value={`dept_${dep.id}`}>
                                        {dep.id} - {dep.name} ({dep.region})
                                    </option>
                                ))}
                                {regionType === 'europe' && EUROPEAN_COUNTRIES.map(country => (
                                    <option key={country.id} value={`country_${country.id}`}>
                                        {country.emoji} {country.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Levels Grid */}
                {filteredLevels.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 min-h-[300px] text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="font-semibold text-white/80 text-lg mb-2">Chargement en cours...</p>
                        <p className="text-sm">Si le chargement persiste, <strong>actualisez la page (F5)</strong> pour charger les nouvelles données.</p>
                    </div>
                ) : (
                <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4 p-1 md:p-2 custom-scrollbar flex-1 min-h-0">
                    {filteredLevels.map((level, index) => {
                        // Unlock logic:
                        // First level of the currently selected category is always unlocked.
                        const isFirstLevel = index === 0;
                        
                        // A level is unlocked if it's the first level OR if the PREVIOUS level in THIS category is completed in any way (won or failed).
                        // We check the previous level's ID in the filtered array instead of just `level.id - 1`
                        // to handle dynamic gaps (like dept_31 having IDs 31001, 31002, etc.)
                        const previousLevelInCat = index > 0 ? filteredLevels[index - 1] : null;
                        const isUnlocked = isFirstLevel || (previousLevelInCat && progress[previousLevelInCat.id] !== undefined);

                        const hasPlayed = progress[level.id] !== undefined;
                        const isCompleted = hasPlayed && progress[level.id] > 0;
                        const isFailed = hasPlayed && progress[level.id] === -1;
                        const bestScore = progress[level.id];

                        // Prevent playing if already played
                        const canPlay = isUnlocked && !hasPlayed;

                        // Calculate Difficulty Tag
                        let diffTag: string = level.difficulty;
                        if (!diffTag && level.population) {
                            diffTag = getDifficultyFromPopulation(level.population);
                        }
                        const isHardOrExpert = diffTag === 'Difficile' || diffTag === 'Hard' || diffTag === 'Expert' || diffTag === 'Very Hard';

                        return (
                            <button
                                key={level.id}
                                onClick={() => canPlay && onSelectLevel(level.id)}
                                disabled={!canPlay}
                                className={`
                                    relative flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 group
                                    ${isCompleted
                                        ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20 cursor-default grayscale-0 opacity-100'
                                    : isFailed
                                        ? 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20 cursor-default grayscale-0 opacity-100'
                                        : isUnlocked
                                            ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10'
                                            : 'border-transparent bg-black/20 opacity-40 cursor-not-allowed grayscale'}
                                `}
                            >
                                <span className={`text-lg md:text-xl font-black mb-0.5 md:mb-1 ${isCompleted ? 'text-green-400' : isFailed ? 'text-red-400' : isUnlocked ? 'text-white group-hover:text-blue-400' : 'text-slate-500'}`}>
                                    {level.id}
                                </span>

                                {(isUnlocked || hasPlayed) ? (
                                    <div className="flex flex-col items-center w-full">
                                        <div className="w-full h-px bg-white/5 my-1 md:my-2" />
                                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-full">
                                            {hasPlayed ? level.cityName : '???'}
                                        </span>
                                        {isCompleted ? (
                                            <div className="mt-1 md:mt-2 flex items-center gap-1 text-[10px] md:text-xs font-bold text-green-400 bg-green-400/10 px-1.5 md:px-2 py-0.5 rounded-full">
                                                <Check className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                {bestScore}
                                            </div>
                                        ) : isFailed ? (
                                            <div className="mt-1 md:mt-2 flex items-center gap-1 text-[10px] md:text-xs font-bold text-red-500 bg-red-500/10 px-1.5 md:px-2 py-0.5 rounded-full">
                                                <X className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                Échec
                                            </div>
                                        ) : (
                                            <div className="mt-1 md:mt-2 flex flex-col items-center gap-1">
                                                {diffTag && (
                                                    <span className={`text-[8px] font-bold uppercase px-1 rounded bg-black/30 ${isHardOrExpert ? 'text-orange-400' : 'text-slate-400'}`}>
                                                        {diffTag}
                                                    </span>
                                                )}
                                                <div className="text-[9px] md:text-[10px] text-slate-500 bg-white/5 px-1.5 md:px-2 py-0.5 rounded-full">
                                                    Jouer
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-1 md:mt-2">
                                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
                                    </div>
                                )}

                                {isHardOrExpert ? (
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
