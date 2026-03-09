import { useState, useEffect } from 'react';
import { Crown, Copy, Play, Settings, ChevronDown, Map, Globe, LayoutGrid } from 'lucide-react';
import { DEPARTMENTS } from '@/data/departments';
import { EUROPEAN_COUNTRIES } from '@/data/europe';

interface Player {
    id: string;
    username: string;
    score: number;
}

export interface GameSettings {
    categories: string[];
    rounds: number;
}

interface LobbyProps {
    roomId: string;
    players: Player[];
    isHost: boolean;
    settings: GameSettings;
    onStartGame: () => void;
    onUpdateSettings: (settings: GameSettings) => void;
}

type PresetMode = 'france' | 'capitals' | 'europe' | 'europe_country' | 'department' | 'all';

export default function Lobby({ roomId, players, isHost, settings, onStartGame, onUpdateSettings }: LobbyProps) {
    const [presetMode, setPresetMode] = useState<PresetMode>('france');
    const [selectedCountry, setSelectedCountry] = useState('ES');
    const [selectedDepartment, setSelectedDepartment] = useState('75');

    const copyCode = () => {
        navigator.clipboard.writeText(roomId);
    };

    // When preset mode changes, compute corresponding categories
    const handlePresetChange = (mode: PresetMode) => {
        setPresetMode(mode);
        let categories: string[] = [];

        switch (mode) {
            case 'france':
                categories = ['france_metropole', 'france_dom'];
                break;
            case 'capitals':
                categories = ['world_capital'];
                break;
            case 'europe':
                // All Europe countries
                categories = EUROPEAN_COUNTRIES.map(c => `country_${c.id}`);
                break;
            case 'europe_country':
                categories = [`country_${selectedCountry}`];
                break;
            case 'department':
                categories = [`dept_${selectedDepartment}`];
                break;
            case 'all':
                categories = ['france_metropole', 'france_dom', 'world_capital', ...EUROPEAN_COUNTRIES.map(c => `country_${c.id}`)];
                break;
        }

        onUpdateSettings({ ...settings, categories });
    };

    const handleRoundsChange = (rounds: number) => {
        onUpdateSettings({ ...settings, rounds });
    };

    const handleCountryChange = (countryId: string) => {
        setSelectedCountry(countryId);
        if (presetMode === 'europe_country') {
            onUpdateSettings({ ...settings, categories: [`country_${countryId}`] });
        }
    };

    const handleDepartmentChange = (depId: string) => {
        setSelectedDepartment(depId);
        if (presetMode === 'department') {
            onUpdateSettings({ ...settings, categories: [`dept_${depId}`] });
        }
    };

    // Resolve label for current settings
    const getSettingsLabel = (): string => {
        const cats = settings.categories;
        if (!cats || cats.length === 0) return 'France';
        if (cats.includes('france_metropole') && cats.length <= 2 && !cats.includes('world_capital')) return '🇫🇷 France';
        if (cats.includes('world_capital') && cats.length === 1) return '🌍 Capitales du monde';
        if (cats.length === 1 && cats[0].startsWith('country_')) {
            const id = cats[0].replace('country_', '');
            const country = EUROPEAN_COUNTRIES.find(c => c.id === id);
            return country ? `${country.emoji} ${country.name}` : cats[0];
        }
        if (cats.length === 1 && cats[0].startsWith('dept_')) {
            const id = cats[0].replace('dept_', '');
            const dep = DEPARTMENTS.find(d => d.id === id);
            return dep ? `🇫🇷 ${dep.id} - ${dep.name}` : cats[0];
        }
        if (cats.length > 5) return '🌍 Tout / Multi-catégories';
        return `${cats.length} catégorie(s)`;
    };

    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md overflow-y-auto p-4">
            <div className="w-full max-w-2xl p-6 md:p-8 rounded-3xl bg-slate-800/50 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Room Code */}
                <div className="text-center mb-6">
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

                {/* Players */}
                <div className="mb-6">
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

                {/* Game Settings */}
                <div className="mb-6 bg-slate-900/50 border border-white/5 rounded-2xl p-4 md:p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Paramètres de la partie</h3>
                    </div>

                    {isHost ? (
                        <div className="space-y-4">
                            {/* Mode / Category Preset */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Mode de jeu</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {([
                                        { id: 'france', label: '🇫🇷 France', icon: Map },
                                        { id: 'capitals', label: '🌍 Capitales', icon: Globe },
                                        { id: 'europe', label: '🇪🇺 Europe', icon: Globe },
                                        { id: 'europe_country', label: '🏳️ Un pays', icon: Globe },
                                        { id: 'department', label: '🗺️ Département', icon: LayoutGrid },
                                        { id: 'all', label: '🌐 Tout', icon: Globe },
                                    ] as { id: PresetMode; label: string; icon: any }[]).map(({ id, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => handlePresetChange(id)}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                                presetMode === id
                                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Country Selector (if europe_country) */}
                            {presetMode === 'europe_country' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Pays</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedCountry}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="appearance-none w-full bg-slate-800 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium shadow-inner"
                                        >
                                            {EUROPEAN_COUNTRIES.map(country => (
                                                <option key={country.id} value={country.id}>
                                                    {country.emoji} {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-5 w-5" />
                                    </div>
                                </div>
                            )}

                            {/* Department Selector (if department) */}
                            {presetMode === 'department' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Département</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedDepartment}
                                            onChange={(e) => handleDepartmentChange(e.target.value)}
                                            className="appearance-none w-full bg-slate-800 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium shadow-inner"
                                        >
                                            {DEPARTMENTS.map(dep => (
                                                <option key={dep.id} value={dep.id}>
                                                    {dep.id} - {dep.name} ({dep.region})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-5 w-5" />
                                    </div>
                                </div>
                            )}

                            {/* Rounds */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Nombre de rounds</label>
                                <div className="flex gap-2">
                                    {[5, 10, 15, 20].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => handleRoundsChange(n)}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                                settings.rounds === n
                                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Non-host: read-only view
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Mode</span>
                                <span className="text-sm font-bold text-white">{getSettingsLabel()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Rounds</span>
                                <span className="text-sm font-bold text-white">{settings.rounds}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Start Button */}
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
