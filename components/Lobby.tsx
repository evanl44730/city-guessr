import { Crown, Copy, Play } from 'lucide-react';

interface Player {
    id: string;
    username: string;
    score: number;
}

interface LobbyProps {
    roomId: string;
    players: Player[];
    isHost: boolean;
    onStartGame: () => void;
}

export default function Lobby({ roomId, players, isHost, onStartGame }: LobbyProps) {
    const copyCode = () => {
        navigator.clipboard.writeText(roomId);
    };

    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md">
            <div className="w-full max-w-2xl p-8 rounded-3xl bg-slate-800/50 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Code du salon</h2>
                    <div
                        onClick={copyCode}
                        className="inline-flex items-center gap-4 bg-slate-900/50 px-8 py-4 rounded-2xl border border-white/10 cursor-pointer hover:border-blue-500/50 transition-colors group"
                    >
                        <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-widest">
                            {roomId}
                        </span>
                        <Copy className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        Joueurs <span className="text-sm px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{players.length}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/5"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg">
                                    {player.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-200">
                                    {player.username}
                                </span>
                                {players[0].id === player.id && (
                                    <Crown className="w-4 h-4 text-amber-400 ml-auto" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {isHost && (
                    <button
                        onClick={onStartGame}
                        className="w-full p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        LANCER LA PARTIE
                    </button>
                )}

                {!isHost && (
                    <div className="text-center text-slate-400 animate-pulse">
                        En attente du chef de salon...
                    </div>
                )}
            </div>
        </div>
    );
}
