import { useState, useMemo } from "react";
import { MapIcon, Home, ArrowLeft, Search } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";

interface DepartmentMenuProps {
    onSelectDepartment: (departmentId: string) => void;
    onBack: () => void;
}

export default function DepartmentMenu({ onSelectDepartment, onBack }: DepartmentMenuProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDepartments = useMemo(() => {
        return DEPARTMENTS.filter(d => 
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.id.includes(searchQuery) ||
            d.region.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl shadow-2xl p-4 md:p-8 w-full max-w-6xl h-full max-h-[90vh] flex flex-col backdrop-blur-xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 md:p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <MapIcon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Départements</h2>
                            <p className="text-slate-400 text-xs md:text-sm">Choisissez un territoire à explorer (101 disponibles)</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <input 
                                type="text"
                                placeholder="Rechercher (nom, code, région)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>

                        <button
                            onClick={onBack}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/20 font-medium flex items-center gap-2 shrink-0 md:text-base text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Retour</span>
                        </button>
                    </div>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 overflow-y-auto custom-scrollbar p-1 flex-1 min-h-0">
                    {filteredDepartments.map((dept) => (
                        <button
                            key={dept.id}
                            onClick={() => onSelectDepartment(dept.id)}
                            className="group relative flex flex-col p-6 rounded-2xl bg-slate-700/30 border border-white/5 hover:bg-slate-700/50 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-left"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl ${dept.color}`} />

                            <div className="flex items-start justify-between mb-2">
                                <span className="text-2xl md:text-3xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                                    {dept.id}
                                </span>
                                <div className={`p-1.5 md:p-2 rounded-lg ${dept.color} bg-opacity-20 text-white shadow-sm`}>
                                    <Home className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </div>

                            <h3 className="text-base md:text-lg font-bold text-white mb-0.5 group-hover:text-blue-200 transition-colors leading-tight">
                                {dept.name}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">
                                {dept.region}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
