import { useState } from 'react';
import { GameState, Guess } from '@/hooks/useGame';
import { RotateCcw, History, Home, Flag, Globe, Trophy, Share2, AlertCircle } from 'lucide-react';
import { CityData, getDifficultyFromPopulation, generateHintString } from '@/utils/gameUtils';

interface GameOverlayProps {
    attempts: number;
    guesses: Guess[];
    gameState: GameState;
    targetCity: CityData | null;
    onRestart: () => void;
    onMenu: () => void;
    onNextLevel?: () => void;
    gameMode: 'france' | 'capital' | 'story' | 'time_attack' | 'department' | 'europe' | 'daily';
    score?: number;
    timeLeft?: number;
    leaderboard?: Array<{ username: string, score: number }>;
    onSubmitScore?: (username: string) => void;
}

export default function GameOverlay({ attempts, guesses, gameState, targetCity, onRestart, onMenu, onNextLevel, gameMode, score = 0, timeLeft = 0, leaderboard = [], onSubmitScore }: GameOverlayProps) {
    const isGameOver = gameState !== 'playing';
    const [showHistory, setShowHistory] = useState(false);
    const [username, setUsername] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Format time mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Daily Mode Share Logic
    const handleShareDaily = () => {
        if (!targetCity) return;
        
        let emojiGrid = '';
        const maxAttempts = 6;
        
        // Generate grid
        for (let i = 0; i < maxAttempts; i++) {
            if (i < guesses.length) {
                const dist = guesses[i].distance;
                if (dist === 0) emojiGrid += '🟩'; // Perfect
                else if (dist < 50) emojiGrid += '🟨'; // Very Close
                else if (dist < 200) emojiGrid += '🟧'; // Close
                else emojiGrid += '🟥'; // Far
            } else if (i === guesses.length && gameState === 'won') {
                 // The winning guess isn't fully in `guesses` array until next render sometimes, 
                 // but typically in this setup `attempts` holds the winning attempt count.
                 // Actually `guesses` DOES contain the winning guess.
            } else {
                emojiGrid += '⬛'; // Unused
            }
        }

        const winCount = gameState === 'won' ? attempts : 'X';
        const todayStr = new Date().toLocaleDateString('fr-FR');
        const shareText = `CityGuessr - Défi Quotidien (${todayStr})\n${winCount}/6\n\n${emojiGrid}\n\nhttps://cityguessr.fr`;
        
        navigator.clipboard.writeText(shareText);
        setHasSubmitted(true); // Reuse this state to show "Copied" feedback
        setTimeout(() => setHasSubmitted(false), 2000);
    };

    const difficulty = targetCity ? getDifficultyFromPopulation(targetCity.population) : null;
    const difficultyColor = difficulty === 'Facile' ? 'text-green-400' : difficulty === 'Moyen' ? 'text-yellow-400' : difficulty === 'Difficile' ? 'text-orange-400' : 'text-red-400';
    const showHint = attempts === 5 && gameState === 'playing' && targetCity;

    return (
        <>
            {/* HUD Bar - Top Left */}
            <div className="absolute top-4 left-4 pointer-events-auto z-20">
                <div className="flex items-center gap-2 md:gap-4 bg-slate-900/80 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg border border-white/10 ring-1 ring-black/5">
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={onMenu}
                            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
                            title="Retour au menu"
                        >
                            <Home className="h-5 w-5" />
                        </button>
                        <div className="w-px h-6 md:h-8 bg-white/10" />

                        <div className="flex flex-col items-start gap-1">
                            {gameMode === 'time_attack' && (
                                <div className="flex items-center gap-4 px-1 mb-1 border-b border-white/5 pb-1 w-full justify-between">
                                    <div className={`flex items-center gap-1.5 font-mono text-sm md:text-base font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                        <span>⏱️</span>
                                        {formatTime(timeLeft)}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-sm md:text-base font-bold text-amber-400">
                                        <span>🏆</span>
                                        {score}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                {gameMode === 'france' ? <Flag className="h-3.5 w-3.5 text-blue-400" /> : gameMode === 'capital' || gameMode === 'europe' ? <Globe className="h-3.5 w-3.5 text-emerald-400" /> : gameMode === 'department' ? <Flag className="h-3.5 w-3.5 text-purple-400" /> : gameMode === 'daily' ? <Trophy className="h-3.5 w-3.5 text-yellow-400" /> : <Trophy className="h-3.5 w-3.5 text-amber-400" />}
                                <span className="text-slate-200 font-bold text-[10px] md:text-xs uppercase tracking-wider hidden sm:inline">
                                    {gameMode === 'france' ? 'France' : gameMode === 'capital' ? 'Monde' : gameMode === 'time_attack' ? 'Chrono' : gameMode === 'department' ? 'Département' : gameMode === 'europe' ? 'Europe' : gameMode === 'daily' ? 'Quotidien' : 'Histoire'}
                                </span>
                                {/* Difficulty Badge for Daily */}
                                {gameMode === 'daily' && difficulty && (
                                    <span className={`ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-black/20 border border-white/5 ${difficultyColor}`}>
                                        {difficulty}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1 md:gap-1.5">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-4 md:w-6 rounded-full transition-all duration-500 ${i < attempts ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-700/50'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6th Attempt Hint - Top Center */}
            {showHint && targetCity && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="flex items-center gap-3 bg-red-500/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-red-500/20 shadow-lg shadow-red-500/10">
                        <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-none mb-1">Dernière chance</span>
                            <span className="text-xl font-mono font-bold text-white tracking-[0.2em]">{generateHintString(targetCity.name)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* History Box - Top Right */}
            {guesses.length > 0 && (
                <>
                    {/* Toggle Button for Mobile & Desktop */}
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`fixed top-20 right-4 z-30 pointer-events-auto p-2.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg text-slate-300 hover:text-white transition-all active:scale-95 ${showHistory ? 'bg-white/10 text-white ring-1 ring-white/20' : ''}`}
                    >
                        <History className="h-5 w-5" />
                    </button>

                    {/* History Panel */}
                    <div className={`
                        absolute top-4 right-4 w-72 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden pointer-events-auto max-h-[60vh] flex flex-col z-20 
                        transition-all duration-300 origin-top-right
                        ${showHistory ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none absolute'}
                    `}>
                        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-slate-400" />
                                <h3 className="font-bold text-slate-200 text-sm tracking-wide">Historique <span className="text-slate-500 font-medium">({guesses.length})</span></h3>
                            </div>
                            <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white transition-colors">
                                <span className="sr-only">Fermer</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
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
                </>
            )}

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300 pointer-events-auto">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">
                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${gameState === 'won' ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_20px_rgba(248,113,113,0.5)]'}`} />

                        {gameMode === 'time_attack' ? (
                            <>
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="h-8 w-8 text-red-400" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Temps écoulé !</h2>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Score final <br />
                                    <span className="font-bold text-amber-400 text-3xl block mt-1">{score}</span>
                                </p>

                                {/* Leaderboard Section */}
                                <div className="mb-6 w-full text-left">
                                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-amber-400" />
                                        Classement
                                    </h3>

                                    <div className="bg-slate-800/50 rounded-xl overflow-hidden mb-4 border border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-slate-400 bg-black/20 uppercase">
                                                <tr>
                                                    <th className="px-3 py-2">#</th>
                                                    <th className="px-3 py-2">Joueur</th>
                                                    <th className="px-3 py-2 text-right">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {leaderboard?.map((entry, idx) => (
                                                    <tr key={idx} className={idx < 3 ? 'bg-amber-400/5' : ''}>
                                                        <td className="px-3 py-2 font-mono text-slate-500">
                                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-200 font-medium truncate max-w-[100px]">{entry.username}</td>
                                                        <td className="px-3 py-2 text-right font-mono text-amber-400">{entry.score}</td>
                                                    </tr>
                                                ))}
                                                {leaderboard?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="px-3 py-4 text-center text-slate-500 italic">Aucun score pour le moment</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Submission Form */}
                                    {!hasSubmitted ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Votre pseudo"
                                                maxLength={15}
                                                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white flex-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (username.trim()) {
                                                        onSubmitScore?.(username);
                                                        setHasSubmitted(true);
                                                    }
                                                }}
                                                disabled={!username.trim()}
                                                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Envoyer
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-green-400 text-sm font-bold bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                                            ✓ Score envoyé
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : gameState === 'won' ? (
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
                            {gameMode === 'daily' && isGameOver && (
                                <button
                                    onClick={handleShareDaily}
                                    className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg
                                        ${hasSubmitted 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-yellow-500 hover:bg-yellow-400 text-yellow-950 shadow-yellow-500/20'}`}
                                >
                                    {hasSubmitted ? '✓ Résultat copié !' : <><Share2 className="h-5 w-5" /> Partager mon score</>}
                                </button>
                            )}
                            {gameMode === 'story' ? (
                                <>
                                    <button
                                        onClick={onNextLevel || onMenu}
                                        className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg text-white
                                            ${gameState === 'won' 
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 hover:scale-[1.02] shadow-green-500/20' 
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 hover:scale-[1.02] shadow-blue-500/20'}`}
                                    >
                                        <Trophy className="h-5 w-5" />
                                        Niveau Suivant
                                    </button>
                                    <button
                                        onClick={onMenu}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/5"
                                    >
                                        <Home className="h-5 w-5" />
                                        Retour au Menu
                                    </button>
                                </>
                            ) : gameMode === 'daily' ? (
                                <button
                                    onClick={onMenu}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/5"
                                >
                                    <Home className="h-5 w-5" />
                                    Retour au Menu
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
