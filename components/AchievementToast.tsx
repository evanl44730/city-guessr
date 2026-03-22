import React, { useEffect, useState } from 'react';
import { Achievement } from '@/utils/achievements';

export default function AchievementToast() {
    const [toasts, setToasts] = useState<Achievement[]>([]);

    useEffect(() => {
        const handleAchievement = (e: Event) => {
            const customEvent = e as CustomEvent<Achievement>;
            const achievement = customEvent.detail;
            
            setToasts(prev => [...prev, achievement]);
            
            // Remove the toast after 5 seconds
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== achievement.id));
            }, 5000);
        };

        window.addEventListener('achievementUnlocked', handleAchievement);
        return () => window.removeEventListener('achievementUnlocked', handleAchievement);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div 
                    key={toast.id + Date.now()} 
                    className="bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-500 pointer-events-auto min-w-[300px]"
                >
                    <div className={`text-4xl ${toast.color} drop-shadow-xl flex-shrink-0 flex items-center justify-center`}>
                        {toast.icon}
                    </div>
                    <div className="pr-2">
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-0.5">
                            Succès Débloqué !
                        </div>
                        <h4 className="text-white font-bold text-base leading-tight">{toast.title}</h4>
                        <p className="text-slate-400 text-xs mt-1 leading-tight max-w-[220px]">
                            {toast.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
