import { Trophy, Clock, CheckCircle } from 'lucide-react';
import { CityData } from '@/utils/gameUtils';

interface Player {
    id: string;
    username: string;
    score: number;
    finishedRound: boolean;
}

interface MultiplayerGameOverlayProps {
    roomId: string;
    currentRound: number;
    totalRounds: number;
    players: Player[];
    attempts: number;
    finishedRound: boolean;
    hasWonRound: boolean; // Not used in scoring directly but for visual feedback
    targetCity: CityData | null;
    isGameOver: boolean;
    onReturnToMenu: () => void;
}

export default function MultiplayerGameOverlay({
    roomId,
    currentRound,
    totalRounds,
    players,
    attempts,
    finishedRound,
    targetCity,
    isGameOver,
    onReturnToMenu
}: MultiplayerGameOverlayProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    if (isGameOver) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-700 pointer-events-auto">
                <div className="w-full max-w-2xl bg-slate-800/50 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
                    <Trophy className="w-20 h-20 text-amber-400 mb-6 drop-shadow-lg" />
                    <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-2">
                        Partie Terminée
                    </h2>
                    <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm font-bold">
                        Classement Final
                    </p>

                    <div className="w-full space-y-3 mb-8">
                        {sortedPlayers.map((player, index) => (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between p-4 rounded-xl border ${index === 0 ? 'bg-amber-500/20 border-amber-500/50' :
                                    index === 1 ? 'bg-slate-500/20 border-slate-500/50' :
                                        index === 2 ? 'bg-orange-500/20 border-orange-500/50' : 'bg-slate-800 border-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-black text-lg
                                        ${index === 0 ? 'bg-amber-500 text-amber-950' :
                                            index === 1 ? 'bg-slate-400 text-slate-900' :
                                                index === 2 ? 'bg-orange-500 text-orange-950' : 'bg-slate-700 text-slate-400'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <span className="text-xl font-bold text-white">{player.username}</span>
                                </div>
                                <span className="text-2xl font-black text-white">{player.score} <span className="text-sm font-medium text-slate-400">pts</span></span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onReturnToMenu}
                        className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1"
                    >
                        Retour au menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-40 pointer-events-none p-4 md:p-6 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex justify-between items-start pointer-events-auto">
                <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                            Salon {roomId}
                        </div>
                        <div className="text-slate-400 text-sm font-medium">
                            Manche <span className="text-white font-bold">{currentRound}</span> / {totalRounds}
                        </div>
                    </div>

                </div>

                {/* Live Leaderboard */}
                <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl min-w-[200px]">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Trophy className="w-3 h-3" />
                        Classement
                    </h3>
                    <div className="space-y-2">
                        {sortedPlayers.map((player, index) => (
                            <div key={player.id} className="flex items-center justify-between gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={`
                                        w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold
                                        ${index === 0 ? 'bg-amber-400 text-amber-950' :
                                            index === 1 ? 'bg-slate-400 text-slate-900' :
                                                index === 2 ? 'bg-orange-400 text-orange-950' : 'bg-slate-700 text-slate-400'}
                                    `}>
                                        {index + 1}
                                    </span>
                                    <span className={`font-medium ${player.finishedRound ? 'text-emerald-400' : 'text-slate-200'}`}>
                                        {player.username}
                                    </span>
                                </div>
                                <span className="font-bold text-white">{player.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="flex items-end justify-center pointer-events-auto">
                {finishedRound ? (
                    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 shadow-2xl animate-in zoom-in slide-in-from-bottom-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Ville trouvée !</h3>
                            <p className="text-slate-400">En attente des autres joueurs...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl mx-auto">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center px-4">
                                <span className="text-3xl font-black text-white font-mono">{attempts}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Essais</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
