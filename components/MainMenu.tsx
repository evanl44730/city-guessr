import { Map, Globe, Trophy, Users } from 'lucide-react';
import Image from 'next/image';

interface MainMenuProps {
    onSelectMode: (mode: 'france' | 'capital' | 'story' | 'online') => void;
}

export default function MainMenu({ onSelectMode }: MainMenuProps) {
    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
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

            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8 md:mb-16">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tighter mb-2 md:mb-4 drop-shadow-2xl">
                        CityGuessr
                    </h1>
                    <p className="text-slate-300 text-lg md:text-2xl font-light tracking-wide">
                        Explorez le monde, devinez les villes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                    <button
                        onClick={() => onSelectMode('france')}
                        className="group relative flex flex-col items-center p-4 md:p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-blue-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-blue-500/20 text-blue-400 mb-4 md:mb-6 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/10">
                            <Map className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-blue-300 transition-colors">France</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Maîtrisez la géographie française. <br /> 50 grandes villes à localiser.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('capital')}
                        className="group relative flex flex-col items-center p-4 md:p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 md:mb-6 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/10">
                            <Globe className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-emerald-300 transition-colors">Monde</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Voyagez à travers les continents. <br /> 30 capitales à découvrir.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('story')}
                        className="group relative flex flex-col items-center p-4 md:p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-amber-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-amber-500/20 text-amber-400 mb-4 md:mb-6 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/10">
                            <Trophy className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-amber-300 transition-colors">Histoire</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Relevez le défi ultime. <br /> 30 niveaux de difficulté croissante.
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode('online')}
                        className="group relative flex flex-col items-center p-4 md:p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 md:p-6 rounded-2xl bg-purple-500/20 text-purple-400 mb-4 md:mb-6 group-hover:bg-purple-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/10">
                            <Users className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-purple-300 transition-colors">En ligne</h2>
                        <p className="text-slate-400 text-center text-xs md:text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Affrontez vos amis. <br /> Devinez en temps réel.
                        </p>
                    </button>
                </div>

                <div className="mt-8 md:mt-16 flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase opacity-60">
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
