import { STORY_LEVELS } from "@/data/storyLevels";
import { Lock, Star, Check } from "lucide-react";

interface StoryMenuProps {
    onSelectLevel: (levelId: number) => void;
    onBack: () => void;
    progress: Record<number, number>;
}

export default function StoryMenu({ onSelectLevel, onBack, progress }: StoryMenuProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                            <Star className="h-6 w-6 fill-amber-500/20" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Mode Histoire</h2>
                            <p className="text-slate-400 text-sm">Complétez les niveaux pour débloquer la suite</p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/20 font-medium"
                    >
                        Retour
                    </button>
                </div>

                <div className="overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-2 custom-scrollbar">
                    {STORY_LEVELS.map((level) => {
                        const isUnlocked = level.id === 1 || progress[level.id - 1] !== undefined;
                        const isCompleted = progress[level.id] !== undefined;
                        const bestScore = progress[level.id];

                        return (
                            <button
                                key={level.id}
                                onClick={() => isUnlocked && onSelectLevel(level.id)}
                                disabled={!isUnlocked}
                                className={`
                                    relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group
                                    ${isCompleted
                                        ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20 hover:-translate-y-1'
                                        : isUnlocked
                                            ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10'
                                            : 'border-transparent bg-black/20 opacity-40 cursor-not-allowed grayscale'}
                                `}
                            >
                                <span className={`text-xl font-black mb-1 ${isCompleted ? 'text-green-400' : isUnlocked ? 'text-white group-hover:text-blue-400' : 'text-slate-500'}`}>
                                    {level.id}
                                </span>

                                {isUnlocked ? (
                                    <div className="flex flex-col items-center w-full">
                                        <div className="w-full h-px bg-white/5 my-2" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-full">
                                            {isCompleted ? level.cityName : '???'}
                                        </span>
                                        {isCompleted ? (
                                            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                                <Check className="h-3 w-3" />
                                                {bestScore}
                                            </div>
                                        ) : (
                                            <div className="mt-2 text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                À faire
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <Lock className="h-5 w-5 text-slate-600" />
                                    </div>
                                )}

                                {level.difficulty === 'Hard' && isUnlocked && (
                                    <div className="absolute top-2 right-2">
                                        <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
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
