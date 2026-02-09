import { GameState, Guess } from '@/hooks/useGame';
import { RotateCcw, History } from 'lucide-react';
import { CityData } from '@/utils/gameUtils';

interface GameOverlayProps {
    attempts: number;
    guesses: Guess[];
    gameState: GameState;
    targetCity: CityData | null;
    onRestart: () => void;
}

export default function GameOverlay({ attempts, guesses, gameState, targetCity, onRestart }: GameOverlayProps) {
    const isGameOver = gameState !== 'playing';

    return (
        <>
            <div className="w-full flex flex-col gap-4 pointer-events-none">
                {/* HUD Bar - Attempts only */}
                <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-200 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600 font-bold text-sm uppercase tracking-wider">Essais</span>
                        <div className="flex gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 w-6 rounded-full transition-colors ${i < attempts ? 'bg-green-500' : 'bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* History Box - Top Right */}
            {guesses.length > 0 && (
                <div className="absolute top-16 right-0 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden pointer-events-auto max-h-[50vh] flex flex-col">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-500" />
                        <h3 className="font-semibold text-slate-700 text-sm">Historique ({guesses.length})</h3>
                    </div>
                    <div className="overflow-y-auto p-2 space-y-2">
                        {[...guesses].reverse().map((guess, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-800">{guess.city.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-600 text-xs">
                                    <span>{Math.round(guess.distance)} km</span>
                                    <span className="font-mono text-slate-400">{guess.direction}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300 pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">

                        {gameState === 'won' ? (
                            <>
                                <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">Bravo ! 🎉</h2>
                                <p className="text-slate-600 mb-6">
                                    Vous avez trouvé <span className="font-bold text-green-600">{targetCity?.name}</span> !
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">Perdu... 😢</h2>
                                <p className="text-slate-600 mb-6">
                                    La ville était <span className="font-bold text-blue-600">{targetCity?.name}</span>.
                                </p>
                            </>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={onRestart}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Rejouer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
