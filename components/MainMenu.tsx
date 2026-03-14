import { Map, Globe, Trophy, Users, LayoutGrid, Calendar, TrendingUp, Compass, Radar, Clock, Ruler, User } from 'lucide-react';

interface MainMenuProps {
    onSelectMode: (mode: 'france' | 'capital' | 'story' | 'online' | 'time_attack' | 'department' | 'europe' | 'daily' | 'higher_lower' | 'north_south' | 'radar' | 'shape' | 'dept_time_attack' | 'distance' | 'profile') => void;
}

type GameMode = MainMenuProps['onSelectMode'] extends (mode: infer M) => void ? M : never;

type ModeItem = {
    mode: GameMode;
    icon: React.ReactNode;
    label: string;
    desc: string;
    // Explicit Tailwind classes to avoid purge issues
    iconBg: string;
    iconText: string;
    hoverBorder: string;
    hoverShadow: string;
    hoverText: string;
    gradientFrom: string;
    iconHoverBg: string;
};

const c = (color: string) => ({
    iconBg: `bg-${color}-500/20`,
    iconText: `text-${color}-400`,
    hoverBorder: `hover:border-${color}-500/50`,
    hoverShadow: `hover:shadow-${color}-500/15`,
    hoverText: `group-hover:text-${color}-300`,
    gradientFrom: `from-${color}-500/10`,
    iconHoverBg: `group-hover:bg-${color}-500`,
});

// Pre-compute all color variants so Tailwind can detect them via static analysis:
// bg-blue-500/20 text-blue-400 hover:border-blue-500/50 hover:shadow-blue-500/15 group-hover:text-blue-300 from-blue-500/10 group-hover:bg-blue-500
// bg-emerald-500/20 text-emerald-400 hover:border-emerald-500/50 hover:shadow-emerald-500/15 group-hover:text-emerald-300 from-emerald-500/10 group-hover:bg-emerald-500
// bg-pink-500/20 text-pink-400 hover:border-pink-500/50 hover:shadow-pink-500/15 group-hover:text-pink-300 from-pink-500/10 group-hover:bg-pink-500
// bg-teal-500/20 text-teal-400 hover:border-teal-500/50 hover:shadow-teal-500/15 group-hover:text-teal-300 from-teal-500/10 group-hover:bg-teal-500
// bg-amber-500/20 text-amber-400 hover:border-amber-500/50 hover:shadow-amber-500/15 group-hover:text-amber-300 from-amber-500/10 group-hover:bg-amber-500
// bg-yellow-500/20 text-yellow-400 hover:border-yellow-500/50 hover:shadow-yellow-500/15 group-hover:text-yellow-300 from-yellow-500/10 group-hover:bg-yellow-500
// bg-red-500/20 text-red-400 hover:border-red-500/50 hover:shadow-red-500/15 group-hover:text-red-300 from-red-500/10 group-hover:bg-red-500
// bg-orange-500/20 text-orange-400 hover:border-orange-500/50 hover:shadow-orange-500/15 group-hover:text-orange-300 from-orange-500/10 group-hover:bg-orange-500
// bg-cyan-500/20 text-cyan-400 hover:border-cyan-500/50 hover:shadow-cyan-500/15 group-hover:text-cyan-300 from-cyan-500/10 group-hover:bg-cyan-500
// bg-indigo-500/20 text-indigo-400 hover:border-indigo-500/50 hover:shadow-indigo-500/15 group-hover:text-indigo-300 from-indigo-500/10 group-hover:bg-indigo-500
// bg-green-500/20 text-green-400 hover:border-green-500/50 hover:shadow-green-500/15 group-hover:text-green-300 from-green-500/10 group-hover:bg-green-500
// bg-fuchsia-500/20 text-fuchsia-400 hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/15 group-hover:text-fuchsia-300 from-fuchsia-500/10 group-hover:bg-fuchsia-500
// bg-purple-500/20 text-purple-400 hover:border-purple-500/50 hover:shadow-purple-500/15 group-hover:text-purple-300 from-purple-500/10 group-hover:bg-purple-500
// shadow-blue-500/10 shadow-emerald-500/10 shadow-pink-500/10 shadow-teal-500/10 shadow-amber-500/10 shadow-yellow-500/10 shadow-red-500/10 shadow-orange-500/10 shadow-cyan-500/10 shadow-indigo-500/10 shadow-green-500/10 shadow-fuchsia-500/10 shadow-purple-500/10

const SECTIONS: { title: string; modes: ModeItem[] }[] = [
    {
        title: '🗺️ Classiques',
        modes: [
            { mode: 'france', icon: <Map className="w-6 h-6" />, label: 'France', desc: 'Géographie française', ...c('blue') },
            { mode: 'capital', icon: <Globe className="w-6 h-6" />, label: 'Monde', desc: 'Capitales mondiales', ...c('emerald') },
            { mode: 'department', icon: <LayoutGrid className="w-6 h-6" />, label: 'Départements', desc: 'Focus local', ...c('pink') },
            { mode: 'europe', icon: <Globe className="w-6 h-6" />, label: 'Europe', desc: 'Villes par pays', ...c('teal') },
        ],
    },
    {
        title: '⚔️ Défis',
        modes: [
            { mode: 'story', icon: <Trophy className="w-6 h-6" />, label: 'Histoire', desc: 'Le défi ultime', ...c('amber') },
            { mode: 'daily', icon: <Calendar className="w-6 h-6" />, label: 'Défi du Jour', desc: 'Une ville par jour', ...c('yellow') },
            { mode: 'time_attack', icon: <Clock className="w-6 h-6" />, label: 'Contre-la-montre', desc: 'Trouvez vite !', ...c('red') },
            { mode: 'dept_time_attack', icon: <Clock className="w-6 h-6" />, label: 'Chrono Depts', desc: '101 clics chrono', ...c('orange') },
        ],
    },
    {
        title: '🎲 Mini-jeux',
        modes: [
            { mode: 'higher_lower', icon: <TrendingUp className="w-6 h-6" />, label: 'Plus ou Moins', desc: 'Populations', ...c('cyan') },
            { mode: 'north_south', icon: <Compass className="w-6 h-6" />, label: 'Nord ou Sud', desc: 'Latitudes', ...c('indigo') },
            { mode: 'radar', icon: <Radar className="w-6 h-6" />, label: 'Radar', desc: 'Sans carte !', ...c('green') },
            { mode: 'shape', icon: <LayoutGrid className="w-6 h-6" />, label: "L'Ombre Mystère", desc: 'Silhouettes', ...c('fuchsia') },
            { mode: 'distance', icon: <Ruler className="w-6 h-6" />, label: 'Le Juste km', desc: 'Estimez !', ...c('teal') },
        ],
    },
    {
        title: '🌐 Multijoueur',
        modes: [
            { mode: 'online', icon: <Users className="w-6 h-6" />, label: 'En ligne', desc: 'Affrontez vos amis', ...c('purple') },
        ],
    },
];

export default function MainMenu({ onSelectMode }: MainMenuProps) {
    return (
        <div className="fixed inset-0 z-[50] overflow-y-auto overflow-x-hidden w-full h-full custom-scrollbar">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center min-h-full w-full max-w-5xl px-4 py-6 md:py-10 mx-auto animate-in fade-in zoom-in duration-500">
                {/* Title — pb-2 + leading-tight prevents gradient text clipping on descenders */}
                <div className="text-center mb-4 md:mb-8 mt-6 md:mt-0">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tighter pb-2 leading-tight drop-shadow-2xl">
                        CityGuessr
                    </h1>
                    <p className="text-slate-300 text-base md:text-xl font-light tracking-wide">
                        Explorez le monde, devinez les villes.
                    </p>
                    <button
                        onClick={() => onSelectMode('profile')}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500/20 hover:border-amber-500/50 transition-all hover:scale-105"
                    >
                        <User className="w-3.5 h-3.5" />
                        Mon Profil
                    </button>
                </div>

                {/* Sections grouped by category */}
                <div className="w-full flex flex-col gap-6 md:gap-8">
                    {SECTIONS.map((section) => (
                        <div key={section.title}>
                            {/* Section Header */}
                            <h2 className="text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4 pl-1">
                                {section.title}
                            </h2>

                            {/* Cards Grid — compact */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                {section.modes.map((item) => (
                                    <button
                                        key={item.mode}
                                        onClick={() => onSelectMode(item.mode)}
                                        className={`group relative flex flex-col items-center p-3 md:p-4 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/10 ${item.hoverBorder} hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl ${item.hoverShadow} transition-all duration-300`}
                                    >
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                        <div className={`p-3 rounded-xl ${item.iconBg} ${item.iconText} mb-2 md:mb-3 ${item.iconHoverBg} group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-md`}>
                                            {item.icon}
                                        </div>
                                        <h3 className={`text-sm md:text-base font-bold text-white mb-0.5 ${item.hoverText} transition-colors text-center leading-tight`}>
                                            {item.label}
                                        </h3>
                                        <p className="text-slate-400 text-center text-[10px] md:text-xs leading-snug group-hover:text-slate-200 transition-colors">
                                            {item.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 mb-4 flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase opacity-60">
                    <span>Alpha v1.0</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>Next.js</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>Leaflet</span>
                </div>
            </div>
        </div>
    );
}
