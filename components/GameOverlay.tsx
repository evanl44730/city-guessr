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
                <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 ring-1 ring-black/5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenu}
                            className="p-2.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
                            title="Retour au menu"
                        >
                            <Home className="h-5 w-5" />
                        </button>
                        <div className="w-px h-8 bg-white/10" />

                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                                {gameMode === 'france' ? <Flag className="h-3.5 w-3.5 text-blue-400" /> : gameMode === 'capital' ? <Globe className="h-3.5 w-3.5 text-emerald-400" /> : <Trophy className="h-3.5 w-3.5 text-amber-400" />}
                                <span className="text-slate-200 font-bold text-xs uppercase tracking-wider">
                                    {gameMode === 'france' ? 'France' : gameMode === 'capital' ? 'Monde' : 'Histoire'}
                                </span>
                            </div>

                            <div className="flex gap-1.5">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i < attempts ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-700/50'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Box - Top Right */}
            {guesses.length > 0 && (
                <div className="absolute top-4 right-4 w-72 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden pointer-events-auto max-h-[60vh] flex flex-col z-20 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-400" />
                        <h3 className="font-bold text-slate-200 text-sm tracking-wide">Historique <span className="text-slate-500 font-medium">({guesses.length})</span></h3>
                    </div>
                    <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {[...guesses].reverse().map((guess, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-blue-400 transition-colors" />
                                    <span className="font-medium text-slate-200">{guess.city.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                                    <span className="bg-black/20 px-1.5 py-0.5 rounded">{Math.round(guess.distance)} km</span>
                                    <span>{guess.direction}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300 pointer-events-auto">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">
                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${gameState === 'won' ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_20px_rgba(248,113,113,0.5)]'}`} />

                        {gameState === 'won' ? (
                            <>
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trophy className="h-10 w-10 text-green-400" />
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Bravo ! 🎉</h2>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    Vous avez trouvé <br />
                                    <span className="font-bold text-green-400 text-xl block mt-1">{targetCity?.name}</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <RotateCcw className="h-10 w-10 text-red-400" />
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Perdu... 😢</h2>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    La ville était <br />
                                    <span className="font-bold text-blue-400 text-xl block mt-1">{targetCity?.name}</span>
                                </p>
                            </>
                        )}

                        <div className="space-y-3">
                            {gameMode === 'story' && gameState === 'won' ? (
                                <button
                                    onClick={onMenu}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-500/20"
                                >
                                    <Trophy className="h-5 w-5" />
                                    Continuer (Menu)
                                </button>
                            ) : (
                                <button
                                    onClick={onRestart}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/5"
                                >
                                    <RotateCcw className="h-5 w-5" />
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
