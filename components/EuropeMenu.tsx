"use client";

import { useState, useMemo } from 'react';
import { EUROPEAN_COUNTRIES } from '@/data/europe';
import { Globe, ArrowLeft, Search } from 'lucide-react';

interface EuropeMenuProps {
    onSelectCountry: (countryId: string) => void;
    onBack: () => void;
}

export default function EuropeMenu({ onSelectCountry, onBack }: EuropeMenuProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return EUROPEAN_COUNTRIES;

        return EUROPEAN_COUNTRIES.filter(country => 
            country.name.toLowerCase().includes(query) ||
            country.nativeName.toLowerCase().includes(query) ||
            country.id.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <div className="z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 md:p-8 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 relative overflow-hidden flex flex-col max-h-[90vh]">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <button 
                    onClick={onBack}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all shadow-lg active:scale-95 text-slate-300 hover:text-white group"
                >
                    <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                        <Globe className="h-8 w-8 text-emerald-400" />
                        Explorer l'Europe
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base mt-1">
                        Choisissez un pays pour y deviner 5 de ses plus grandes villes.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 z-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, langue native ou code (ex: IT)..."
                    className="w-full bg-slate-950/50 border border-white/10 text-white placeholder-slate-500 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                />
            </div>
            
            {/* Scrollable list of countries */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 z-10">
                {filteredCountries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Globe className="h-12 w-12 mb-4 opacity-50" />
                        <p className="font-medium text-lg">Aucun pays trouvé</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pb-4">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.id}
                                onClick={() => onSelectCountry(country.id)}
                                className="group flex flex-col items-start p-4 bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-2xl hover:bg-emerald-500/10 transition-all text-left shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 active:scale-95"
                            >
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className="text-4xl leading-none">{country.emoji}</div>
                                    <span className="text-xs font-mono font-bold text-slate-500 bg-black/20 px-2 py-1 rounded-lg">
                                        {country.id}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-200 mt-2 text-lg truncate w-full group-hover:text-emerald-400 transition-colors">
                                    {country.name}
                                </span>
                                <span className="text-sm font-medium text-slate-500 truncate w-full">
                                    {country.nativeName}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
