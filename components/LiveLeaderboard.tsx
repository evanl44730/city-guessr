import { Trophy, Check, Loader2 } from 'lucide-react';

interface Player {
    id: string;
    username: string;
    score: number;
    attempts: number;
    finishedRound: boolean;
}

interface LiveLeaderboardProps {
    players: Player[];
    currentPlayerId: string;
}

export default function LiveLeaderboard({ players, currentPlayerId }: LiveLeaderboardProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="absolute top-20 left-4 z-20 w-64 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden animate-in slide-in-from-left-4 fade-in duration-500">
            <div className="bg-white/5 p-3 border-b border-white/5 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Classement en direct</span>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {sortedPlayers.map((player, index) => (
                    <div
                        key={player.id}
                        className={`
                            flex items-center justify-between p-2 rounded-xl border transition-all
                            ${player.id === currentPlayerId
                                ? 'bg-indigo-500/20 border-indigo-500/30'
                                : 'bg-white/5 border-transparent'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`
                                w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full
                                ${index === 0 ? 'bg-amber-400 text-amber-900' :
                                    index === 1 ? 'bg-slate-300 text-slate-900' :
                                        index === 2 ? 'bg-amber-700 text-amber-100' : 'bg-slate-700 text-slate-400'}
                            `}>
                                {index + 1}
                            </span>
                            <span className={`text-xs font-bold truncate max-w-[80px] ${player.id === currentPlayerId ? 'text-indigo-300' : 'text-slate-300'}`}>
                                {player.username}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-400">{player.score}</span>
                            {player.finishedRound ? (
                                <Check className="w-3 h-3 text-green-500" />
                            ) : (
                                <Loader2 className="w-3 h-3 text-slate-500 animate-spin" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
