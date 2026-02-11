import { MapIcon, Home, ArrowLeft } from "lucide-react";

interface DepartmentMenuProps {
    onSelectDepartment: (departmentId: string) => void;
    onBack: () => void;
}

const DEPARTMENTS = [
    { id: '31', name: 'Haute-Garonne', region: 'Occitanie', color: 'bg-pink-500' },
    { id: '81', name: 'Tarn', region: 'Occitanie', color: 'bg-amber-500' },
    { id: '44', name: 'Loire-Atlantique', region: 'Pays de la Loire', color: 'bg-cyan-500' },
    { id: '12', name: 'Aveyron', region: 'Occitanie', color: 'bg-red-500' },
];

export default function DepartmentMenu({ onSelectDepartment, onBack }: DepartmentMenuProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[85vh] flex flex-col backdrop-blur-xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <MapIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Départements</h2>
                            <p className="text-slate-400 text-sm">Choisissez un territoire à explorer</p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/20 font-medium flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar p-1">
                    {DEPARTMENTS.map((dept) => (
                        <button
                            key={dept.id}
                            onClick={() => onSelectDepartment(dept.id)}
                            className="group relative flex flex-col p-6 rounded-2xl bg-slate-700/30 border border-white/5 hover:bg-slate-700/50 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-left"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl ${dept.color}`} />

                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                                    {dept.id}
                                </span>
                                <div className={`p-2 rounded-lg ${dept.color} bg-opacity-20 text-white`}>
                                    <Home className="w-5 h-5" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                                {dept.name}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium">
                                {dept.region}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
