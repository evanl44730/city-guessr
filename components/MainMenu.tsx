import { Map, Globe, Trophy, Users, LayoutGrid, Calendar, TrendingUp, Compass, Radar, Clock, Ruler, User } from 'lucide-react';
import Image from 'next/image';

interface MainMenuProps {
    onSelectMode: (mode: 'france' | 'capital' | 'story' | 'online' | 'time_attack' | 'department' | 'europe' | 'daily' | 'higher_lower' | 'north_south' | 'radar' | 'shape' | 'dept_time_attack' | 'distance' | 'profile') => void;
}

export default function MainMenu({ onSelectMode }: MainMenuProps) {
    return (
        <div className="fixed inset-0 z-[50] overflow-y-auto overflow-x-hidden w-full h-full custom-scrollbar">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Placeholder for generated image, using CSS gradient fallback for now if image load fails or is missing, but ideally referencing the artifact */}
                {/* Since I can't easily reference the artifact path directly in next/image without moving it to public, I will assume it's moving or use a robust fallback. 
                    For this step, I will use a css gradient that matches the theme, and if the user moves the image to public/bg.jpg, they can use it.
                    Actually, I should probably copy the artifact to public if possible, but I don't have direct copy to public capability easily without knowing the artifact path exact output.
                    I will use a rich CSS gradient background for now that mimics the "GeoGuessr" vibe clearly.
                 */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" /> {/* Optional pattern */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full max-w-6xl px-4 py-8 md:py-12 mx-auto animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-6 md:mb-10 mt-10 md:mt-0">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tighter mb-2 md:mb-4 drop-shadow-2xl">
                        CityGuessr
                    </h1>
                    <p className="text-slate-300 text-lg md:text-2xl font-light tracking-wide">
                        Explorez le monde, devinez les villes.
                    </p>
                    <button
                        onClick={() => onSelectMode('profile')}
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm hover:bg-amber-500/20 hover:border-amber-500/50 transition-all hover:scale-105"
                    >
                        <User className="w-4 h-4" />
                        Mon Profil
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                    <button
                        onClick={() => onSelectMode('france')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-blue-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-blue-500/20 text-blue-400 mb-4 md:mb-6 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/10">
                            <Map className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-blue-300 transition-colors">France</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Maîtrisez la géographie française.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('capital')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 md:mb-6 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/10">
                            <Globe className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-emerald-300 transition-colors">Monde</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Voyagez à travers les continents.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('story')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-amber-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-amber-500/20 text-amber-400 mb-4 md:mb-6 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/10">
                            <Trophy className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-amber-300 transition-colors">Histoire</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Relevez le défi ultime.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('online')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-purple-500/20 text-purple-400 mb-4 md:mb-6 group-hover:bg-purple-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/10">
                            <Users className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-purple-300 transition-colors">En ligne</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Affrontez vos amis
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('department')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-pink-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-pink-500/20 text-pink-400 mb-4 md:mb-6 group-hover:bg-pink-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-pink-500/10">
                            <LayoutGrid className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-pink-300 transition-colors">Départements</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Focus local.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('europe')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-teal-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-teal-500/20 text-teal-400 mb-4 md:mb-6 group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-teal-500/10">
                            <Globe className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-teal-300 transition-colors">Europe</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Trouvez les villes par pays.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('time_attack')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-red-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-red-500/20 text-red-400 mb-4 md:mb-6 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-red-500/10">
                            <Clock className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-red-300 transition-colors">Contre-la-montre</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Trouvez 15 villes vite.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('dept_time_attack')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-orange-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-orange-500/20 text-orange-400 mb-4 md:mb-6 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/10">
                            <Clock className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-orange-300 transition-colors">Chrono Départements</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            101 clics, sans erreur !
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('daily')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-yellow-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-yellow-500/20 text-yellow-400 mb-4 md:mb-6 group-hover:bg-yellow-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/10">
                            <Calendar className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-yellow-300 transition-colors">Défi Quotidien</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Une ville par jour. <br /> Pourrez-vous la trouver ?
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('higher_lower')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-4 md:mb-6 group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/10">
                            <TrendingUp className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-cyan-300 transition-colors">Plus ou Moins</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Comparez les populations !
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('north_south')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4 md:mb-6 group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/10">
                            <Compass className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-indigo-300 transition-colors">Nord ou Sud</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Lequel est plus au Nord ?
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('radar')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-green-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-green-500/20 text-green-400 mb-4 md:mb-6 group-hover:bg-green-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-green-500/10">
                            <Radar className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-green-300 transition-colors">Radar</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Sans carte. Triangulez !
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('shape')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-fuchsia-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 mb-4 md:mb-6 group-hover:bg-fuchsia-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-fuchsia-500/10">
                            <LayoutGrid className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-fuchsia-300 transition-colors">L'Ombre Mystère</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Devinez le territoire.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('distance')}
                        className="group relative flex flex-col items-center p-4 md:p-6 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-teal-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-teal-500/20 text-teal-400 mb-4 md:mb-6 group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-teal-500/10">
                            <Ruler className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-teal-300 transition-colors">Le Juste km</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Estimez la distance !
                        </p>
                    </button>
                </div>

                <div className="mt-8 flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase opacity-60">
                    <span>Alpha v1.0</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>Next.js</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <div className="flex gap-2 text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase opacity-60">
                        <span>Leaflet</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
