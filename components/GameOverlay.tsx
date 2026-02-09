import { GameState, Guess } from '@/hooks/useGame';
import { RotateCcw, History, Home, Flag, Globe, Trophy } from 'lucide-react';
import { CityData } from '@/utils/gameUtils';

interface GameOverlayProps {
    attempts: number;
    guesses: Guess[];
    gameState: GameState;
    targetCity: CityData | null;
    onRestart: () => void;
    onMenu: () => void;
    gameMode: 'france' | 'capital' | 'story';
}

export default function GameOverlay({ attempts, guesses, gameState, targetCity, onRestart, onMenu, gameMode }: GameOverlayProps) {
    const isGameOver = gameState !== 'playing';

    return (
        <>
            {/* HUD Bar - Top Left */}
            <div className="absolute top-4 left-4 pointer-events-auto z-20">
                <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenu}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                            title="Retour au menu"
                        >
                            <Home className="h-5 w-5" />
                        </button>
                        <div className="w-px h-8 bg-slate-200" />

                        <div className="flex flex-col items-start gap-0.5">
                            <div className="flex items-center gap-2">
                                {gameMode === 'france' ? <Flag className="h-3 w-3 text-blue-500" /> : <Globe className="h-3 w-3 text-emerald-500" />}
                                <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                    {gameMode === 'france' ? 'France' : 'Monde'}
                                </span>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider ml-1">Essais</span>
                            </div>

                            <div className="flex gap-1">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-5 rounded-full transition-colors ${i < attempts ? 'bg-green-500' : 'bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Box - Top Right */}
            {guesses.length > 0 && (
                <div className="absolute top-4 right-4 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden pointer-events-auto max-h-[50vh] flex flex-col z-20">
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
                            {gameMode === 'story' && gameState === 'won' ? (
                                <button
                                    onClick={onMenu}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors"
                                >
                                    <Trophy className="h-4 w-4" />
                                    Continuer (Menu)
                                </button>
                            ) : (
                                <button
                                    onClick={onRestart}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Rejouer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
