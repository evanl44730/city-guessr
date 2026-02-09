import { useState } from 'react';
import { Users, LogIn, Plus } from 'lucide-react';

interface OnlineMenuProps {
    onJoin: (username: string, roomId: string) => void;
    onCreate: (username: string) => void;
    onBack: () => void;
}

export default function OnlineMenu({ onJoin, onCreate, onBack }: OnlineMenuProps) {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState<'menu' | 'join'>('menu');

    const handleCreate = () => {
        if (!username.trim()) return;
        onCreate(username);
    };

    const handleJoin = () => {
        if (!username.trim() || !roomId.trim()) return;
        onJoin(username, roomId);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-md backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
                        <Users className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Mode En Ligne</h2>
                    <p className="text-slate-400">Affrontez vos amis en temps réel</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Pseudo</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                            placeholder="Votre pseudo..."
                            maxLength={12}
                        />
                    </div>

                    {mode === 'menu' ? (
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                                onClick={handleCreate}
                                disabled={!username.trim()}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-sm">Créer</span>
                            </button>
                            <button
                                onClick={() => setMode('join')}
                                disabled={!username.trim()}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-sm">Rejoindre</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Code du Salon</label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono font-bold tracking-widest text-center uppercase"
                                    placeholder="ABCD"
                                    maxLength={4}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setMode('menu')}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold transition-all border border-white/5"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleJoin}
                                    disabled={!roomId.trim() || roomId.length !== 4}
                                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Rejoindre
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onBack}
                    className="w-full mt-6 py-2 text-slate-500 hover:text-white text-sm font-medium transition-colors"
                >
                    Retour au menu principal
                </button>
            </div>
        </div>
    );
}
