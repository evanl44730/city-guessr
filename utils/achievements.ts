import { getFoundCities } from './progressTracker';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    category: 'exploration' | 'story' | 'challenges' | 'easter_eggs';
}

export const ACHIEVEMENTS: Achievement[] = [
    // --- EXPLORATION ---
    { id: 'exp_1', title: 'Première découverte', description: 'Trouvez votre première ville.', icon: '🌟', color: 'text-yellow-400', category: 'exploration' },
    { id: 'exp_10', title: 'Petit Explorateur', description: 'Trouvez 10 villes uniques.', icon: '👟', color: 'text-emerald-400', category: 'exploration' },
    { id: 'exp_25', title: 'Randonneur', description: 'Trouvez 25 villes uniques.', icon: '🎒', color: 'text-green-500', category: 'exploration' },
    { id: 'exp_50', title: 'Cartographe', description: 'Trouvez 50 villes uniques.', icon: '📍', color: 'text-blue-400', category: 'exploration' },
    { id: 'exp_100', title: 'Globe-Trotteur', description: 'Trouvez 100 villes uniques.', icon: '🌍', color: 'text-indigo-500', category: 'exploration' },
    { id: 'exp_250', title: 'Voyageur Vétéran', description: 'Trouvez 250 villes uniques.', icon: '✈️', color: 'text-purple-500', category: 'exploration' },
    { id: 'exp_500', title: 'Maître du Monde', description: 'Trouvez 500 villes uniques.', icon: '🌌', color: 'text-fuchsia-500', category: 'exploration' },
    { id: 'exp_1000', title: 'Légende Vivante', description: 'Trouvez 1000 villes uniques.', icon: '👑', color: 'text-yellow-500', category: 'exploration' },

    // --- MODE HISTOIRE ---
    { id: 'story_1', title: 'Premier Pas', description: 'Terminez 1 niveau du mode Histoire.', icon: '🌱', color: 'text-green-400', category: 'story' },
    { id: 'story_5', title: 'Aventurier', description: 'Terminez 5 niveaux du mode Histoire.', icon: '📖', color: 'text-amber-500', category: 'story' },
    { id: 'story_20', title: 'Pèlerin', description: 'Terminez 20 niveaux du mode Histoire.', icon: '🚶', color: 'text-orange-400', category: 'story' },
    { id: 'story_50', title: 'Vétéran', description: 'Terminez 50 niveaux du mode Histoire.', icon: '⚔️', color: 'text-red-500', category: 'story' },
    { id: 'story_100', title: 'Conquérant', description: 'Terminez 100 niveaux du mode Histoire.', icon: '🏰', color: 'text-purple-600', category: 'story' },
    { id: 'story_500', title: 'Érudit', description: 'Terminez 500 niveaux du mode Histoire.', icon: '📜', color: 'text-blue-500', category: 'story' },
    { id: 'story_1000', title: 'Gourou', description: 'Terminez 1000 niveaux du mode Histoire.', icon: '🧘', color: 'text-indigo-400', category: 'story' },
    { id: 'story_3340', title: 'Fin de l\'Histoire', description: 'Terminez absolument tous les niveaux (3340 niveaux).', icon: '🏆', color: 'text-amber-400', category: 'story' },

    // --- DÉFIS & RECORDS ---
    { id: 'radar_app', title: 'Apprenti Radar', description: 'Obtenez une série > 0 en Radar Moyen.', icon: '📡', color: 'text-emerald-300', category: 'challenges' },
    { id: 'radar_exp', title: 'Expert Radar', description: 'Obtenez une série > 0 en Radar Expert.', icon: '🛰️', color: 'text-emerald-500', category: 'challenges' },
    { id: 'ta_sprint', title: 'Sprinteur', description: 'Score de 5 000 pts en Contre-la-montre.', icon: '⚡', color: 'text-red-400', category: 'challenges' },
    { id: 'ta_god', title: 'Maître du Temps', description: 'Score de 10 000 pts en Contre-la-montre.', icon: '⏳', color: 'text-purple-500', category: 'challenges' },
    { id: 'dist_good', title: 'Un Bon Compas', description: 'Score de 5 000 au Juste km.', icon: '📏', color: 'text-teal-400', category: 'challenges' },
    { id: 'dist_perf', title: 'Le Juste Prix', description: 'Score parfait de 10 000 au Juste km.', icon: '🎯', color: 'text-red-500', category: 'challenges' },
    { id: 'shape_obs', title: 'Observateur', description: 'Score de 10 au mode L\'Ombre Mystère.', icon: '👁️', color: 'text-slate-400', category: 'challenges' },
    { id: 'shape_gen', title: 'Génie de l\'Ombre', description: 'Score de 20 au mode L\'Ombre Mystère.', icon: '👤', color: 'text-slate-300', category: 'challenges' },

    // --- INSOLITES ---
    { id: 'dom_tom', title: 'Voyageur des Îles', description: 'Trouvez une ville des DOM-TOM.', icon: '🌴', color: 'text-cyan-400', category: 'easter_eggs' },
    { id: 'paris', title: 'Capitale Éternelle', description: 'Trouvez la ville de Paris.', icon: '🗼', color: 'text-pink-400', category: 'easter_eggs' },
];

export function getUnlockedAchievements(): string[] {
    if (typeof window === 'undefined') return [];
    
    const unlocked: string[] = [];
    const foundCities = getFoundCities();
    
    // Found Cities logic
    const len = foundCities.length;
    if (len >= 1) unlocked.push('exp_1');
    if (len >= 10) unlocked.push('exp_10');
    if (len >= 25) unlocked.push('exp_25');
    if (len >= 50) unlocked.push('exp_50');
    if (len >= 100) unlocked.push('exp_100');
    if (len >= 250) unlocked.push('exp_250');
    if (len >= 500) unlocked.push('exp_500');
    if (len >= 1000) unlocked.push('exp_1000');

    // Insolites
    if (foundCities.some(c => c.zip && c.zip.startsWith('97'))) unlocked.push('dom_tom');
    if (foundCities.some(c => c.name.toLowerCase() === 'paris')) unlocked.push('paris');
    
    // Radar logic
    try {
        const radarStreaks = JSON.parse(localStorage.getItem('radarBestStreaks') || '{}');
        if (radarStreaks['medium'] && radarStreaks['medium'] > 0) unlocked.push('radar_app');
        if (radarStreaks['hard'] && radarStreaks['hard'] > 0) unlocked.push('radar_app'); // fallback
        if (radarStreaks['expert'] && radarStreaks['expert'] > 0) unlocked.push('radar_exp');
    } catch (e) {}

    // Time Attack logic
    try {
        const taScore = parseInt(localStorage.getItem('timeAttackBestScore') || '0', 10);
        if (taScore >= 5000) unlocked.push('ta_sprint');
        if (taScore >= 10000) unlocked.push('ta_god');
    } catch (e) {}

    // Distance logic
    try {
        const distScore = parseInt(localStorage.getItem('distanceGameBest') || '0', 10);
        if (distScore >= 5000) unlocked.push('dist_good');
        if (distScore >= 10000) unlocked.push('dist_perf');
    } catch (e) {}

    // Shape logic
    try {
        const shapeScore = parseInt(localStorage.getItem('shapeGameBestScore') || '0', 10);
        if (shapeScore >= 10) unlocked.push('shape_obs');
        if (shapeScore >= 20) unlocked.push('shape_gen');
    } catch (e) {}

    // Story logic
    try {
        const storyProgress = JSON.parse(localStorage.getItem('city_guessr_story_progress') || '{}');
        const wonLevels = Object.values(storyProgress).filter((score: any) => typeof score === 'number' && score > 0).length;
        if (wonLevels >= 1) unlocked.push('story_1');
        if (wonLevels >= 5) unlocked.push('story_5');
        if (wonLevels >= 20) unlocked.push('story_20');
        if (wonLevels >= 50) unlocked.push('story_50');
        if (wonLevels >= 100) unlocked.push('story_100');
        if (wonLevels >= 500) unlocked.push('story_500');
        if (wonLevels >= 1000) unlocked.push('story_1000');
        if (wonLevels >= 3340) unlocked.push('story_3340');
    } catch (e) {}

    return unlocked;
}

export function checkAndNotifyAchievements() {
    if (typeof window === 'undefined') return;
    const currentUnlocked = getUnlockedAchievements();
    const knownJson = localStorage.getItem('city_guessr_known_achievements');
    
    // First run for existing user or new user: just save current state
    if (!knownJson) {
        localStorage.setItem('city_guessr_known_achievements', JSON.stringify(currentUnlocked));
        return;
    }

    const previouslyKnown = JSON.parse(knownJson);
    const newAchievements = currentUnlocked.filter(id => !previouslyKnown.includes(id));
    
    if (newAchievements.length > 0) {
        localStorage.setItem('city_guessr_known_achievements', JSON.stringify(currentUnlocked));
        
        newAchievements.forEach(id => {
            const achInfo = ACHIEVEMENTS.find(a => a.id === id);
            if (achInfo) {
                // Wait slightly to not block the main thread and allow rendering
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('achievementUnlocked', { detail: achInfo }));
                }, 100);
            }
        });
    }
}
