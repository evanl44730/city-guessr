import { Map, Globe } from 'lucide-react';

interface MainMenuProps {
    onSelectMode: (mode: 'france' | 'capital') => void;
}

export default function MainMenu({ onSelectMode }: MainMenuProps) {
    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                    City<span className="text-blue-500">Guessr</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl">
                    Choisissez votre mode de jeu
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                    onClick={() => onSelectMode('france')}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 hover:scale-105 transition-all duration-300"
                >
                    <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Map className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Villes de France</h2>
                    <p className="text-slate-400 text-center">
                        Trouvez 50 grandes villes françaises.
                    </p>
                </button>

                <button
                    onClick={() => onSelectMode('capital')}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 hover:scale-105 transition-all duration-300"
                >
                    <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Globe className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Capitales du Monde</h2>
                    <p className="text-slate-400 text-center">
                        Voyagez à travers 30 capitales mondiales.
                    </p>
                </button>
            </div>

            <div className="mt-12 text-slate-500 text-sm">
                v1.0 • Developed with Next.js & Leaflet
            </div>
        </div>
    );
}
