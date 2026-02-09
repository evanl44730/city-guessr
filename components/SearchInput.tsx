"use client";

import { useState, useMemo } from 'react';
import citiesData from '@/data/cities.json';
import { Search } from 'lucide-react';

interface SearchInputProps {
    onSelect: (cityName: string) => void;
    disabled?: boolean;
}

export default function SearchInput({ onSelect, disabled }: SearchInputProps) {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredCities = useMemo(() => {
        if (!query) return [];
        return citiesData.filter(city =>
            city.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions
    }, [query]);

    const handleSelect = (cityName: string) => {
        onSelect(cityName);
        setQuery('');
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const match = citiesData.find(c => c.name.toLowerCase() === query.toLowerCase());
        if (match) {
            handleSelect(match.name);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto z-30">
            <div className="absolute inset-0 bg-slate-900/50 blur-xl rounded-full transform scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={disabled}
                    placeholder="Quelle est cette ville ?"
                    className="w-full pl-12 pr-24 py-4 rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium tracking-wide"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                <button
                    type="submit"
                    disabled={disabled || !query}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 disabled:opacity-0 disabled:scale-95 transition-all transform active:scale-95"
                >
                    Valider
                </button>
            </form>

            {showSuggestions && filteredCities.length > 0 && (
                <div className="absolute z-[100] w-full mt-2 bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    <ul className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                        {filteredCities.map((city, index) => (
                            <li
                                key={`${city.name}-${city.zip}-${index}`}
                                onClick={() => handleSelect(city.name)}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer text-slate-100 flex justify-between items-center rounded-lg transition-colors group border-b border-white/5 last:border-0"
                            >
                                <span className="font-medium group-hover:text-white transition-colors">{city.name}</span>
                                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">{city.zip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Overlay to close suggestions when clicking outside */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-20 bg-transparent"
                    onClick={() => setShowSuggestions(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
