import { STORY_LEVELS } from "@/data/storyLevels";
import { Lock, Star, Check } from "lucide-react";

interface StoryMenuProps {
    onSelectLevel: (levelId: number) => void;
    onBack: () => void;
    progress: Record<number, number>;
}

export default function StoryMenu({ onSelectLevel, onBack, progress }: StoryMenuProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Mode Histoire</h2>
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium">
                        Retour
                    </button>
                </div>

                <div className="overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
                    {STORY_LEVELS.map((level) => {
                        // Level 1 is always unlocked. Others need previous level completed.
                        const isUnlocked = level.id === 1 || progress[level.id - 1] !== undefined;
                        const isCompleted = progress[level.id] !== undefined;
                        const bestScore = progress[level.id];

                        return (
                            <button
                                key={level.id}
                                onClick={() => isUnlocked && onSelectLevel(level.id)}
                                disabled={!isUnlocked}
                                className={`
                                    relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                                    ${isCompleted
                                        ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                        : isUnlocked
                                            ? 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md'
                                            : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'}
                                `}
                            >
                                <span className={`text-lg font-bold mb-1 ${isCompleted ? 'text-green-700' : 'text-slate-700'}`}>
                                    Niveau {level.id}
                                </span>

                                {isUnlocked ? (
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                            {isCompleted ? level.cityName : '???'}
                                        </span>
                                        {isCompleted ? (
                                            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-green-600">
                                                <Check className="h-3 w-3" />
                                                {bestScore} essais
                                            </div>
                                        ) : (
                                            <div className="mt-2 text-xs text-slate-400">À faire</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-1">
                                        <Lock className="h-5 w-5 text-slate-300" />
                                    </div>
                                )}

                                {level.difficulty === 'Hard' && isUnlocked && (
                                    <div className="absolute top-2 right-2">
                                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
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
