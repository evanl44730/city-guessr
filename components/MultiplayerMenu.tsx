import { useState } from 'react';
import { User, Users, ArrowRight, ArrowLeft } from 'lucide-react';

interface MultiplayerMenuProps {
    onCreateRoom: (username: string) => void;
    onJoinRoom: (username: string, roomId: string) => void;
    onBack: () => void;
}

export default function MultiplayerMenu({ onCreateRoom, onJoinRoom, onBack }: MultiplayerMenuProps) {
    const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onCreateRoom(username.trim());
        }
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && roomId.trim()) {
            onJoinRoom(username.trim(), roomId.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md">
            <div className="w-full max-w-md p-8 rounded-3xl bg-slate-800/50 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={() => mode === 'menu' ? onBack() : setMode('menu')}
                    className="absolute top-8 left-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <h2 className="text-3xl font-black text-center text-white mb-8">
                    Multijoueur
                </h2>

                {mode === 'menu' && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('create')}
                            className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <User className="w-6 h-6" />
                            Créer un salon
                        </button>
                        <button
                            onClick={() => setMode('join')}
                            className="w-full p-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <Users className="w-6 h-6" />
                            Rejoindre un salon
                        </button>
                    </div>
                )}

                {mode === 'create' && (
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Pseudo</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:outline-none text-white placeholder-slate-600"
                                placeholder="Entrez votre pseudo"
                                required
                                maxLength={12}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold transition-all hover:-translate-y-1 shadow-lg shadow-blue-500/20"
                        >
                            Créer
                        </button>
                    </form>
                )}

                {mode === 'join' && (
                    <form onSubmit={handleJoin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Pseudo</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:outline-none text-white placeholder-slate-600"
                                placeholder="Entrez votre pseudo"
                                required
                                maxLength={12}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Code du salon</label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:outline-none text-white placeholder-slate-600 font-mono tracking-widest text-center uppercase"
                                placeholder="ABCD"
                                required
                                maxLength={4}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
                        >
                            Rejoindre
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
