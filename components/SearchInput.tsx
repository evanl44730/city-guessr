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
        <div className="relative w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={disabled}
                    placeholder="Entrez une ville..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-black placeholder:text-slate-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <button
                    type="submit"
                    disabled={disabled || !query}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Valider
                </button>
            </form>

            {showSuggestions && query && filteredCities.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {filteredCities.map((city) => (
                        <li
                            key={city.name}
                            onClick={() => handleSelect(city.name)}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 flex justify-between items-center"
                        >
                            <span>{city.name}</span>
                            <span className="text-xs text-slate-400">{city.zip}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Overlay to close suggestions when clicking outside */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowSuggestions(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
