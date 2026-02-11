import { CityData } from "@/utils/gameUtils";

export interface StoryLevel {
    id: number;
    cityName: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert';
    minScoreToUnlock: number;
    category: 'france' | 'capital' | 'haute_garonne';
}

export const STORY_LEVELS: StoryLevel[] = [
    // --- FRANCE (Levels 1-50) ---
    // Easy
    { id: 1, cityName: "Paris", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 2, cityName: "Marseille", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 3, cityName: "Lyon", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 4, cityName: "Toulouse", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 5, cityName: "Nice", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 6, cityName: "Nantes", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 7, cityName: "Strasbourg", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 8, cityName: "Montpellier", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 9, cityName: "Bordeaux", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    { id: 10, cityName: "Lille", difficulty: "Easy", minScoreToUnlock: 6, category: "france" },
    // Medium
    { id: 11, cityName: "Rennes", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 12, cityName: "Reims", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 13, cityName: "Le Havre", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 14, cityName: "Saint-Étienne", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 15, cityName: "Toulon", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 16, cityName: "Grenoble", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 17, cityName: "Dijon", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 18, cityName: "Angers", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 19, cityName: "Nîmes", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    { id: 20, cityName: "Clermont-Ferrand", difficulty: "Medium", minScoreToUnlock: 6, category: "france" },
    // Hard
    { id: 21, cityName: "Le Mans", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 22, cityName: "Aix-en-Provence", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 23, cityName: "Brest", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 24, cityName: "Tours", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 25, cityName: "Amiens", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 26, cityName: "Limoges", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 27, cityName: "Annecy", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 28, cityName: "Perpignan", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 29, cityName: "Metz", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    { id: 30, cityName: "Besançon", difficulty: "Hard", minScoreToUnlock: 6, category: "france" },
    // Very Hard
    { id: 31, cityName: "Orléans", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 32, cityName: "Rouen", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 33, cityName: "Mulhouse", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 34, cityName: "Caen", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 35, cityName: "Nancy", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 36, cityName: "Avignon", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 37, cityName: "Poitiers", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 38, cityName: "Dunkerque", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 39, cityName: "La Rochelle", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    { id: 40, cityName: "Pau", difficulty: "Very Hard", minScoreToUnlock: 6, category: "france" },
    // Expert
    { id: 41, cityName: "Ajaccio", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 42, cityName: "Bastia", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 43, cityName: "Calais", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 44, cityName: "Cannes", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 45, cityName: "Colmar", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 46, cityName: "Bourges", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 47, cityName: "Quimper", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 48, cityName: "Troyes", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 49, cityName: "Chambéry", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },
    { id: 50, cityName: "Carcassonne", difficulty: "Expert", minScoreToUnlock: 6, category: "france" },

    // --- CAPITALS (Levels 101-130) ---
    // Easy
    { id: 101, cityName: "London", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 102, cityName: "Berlin", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 103, cityName: "Madrid", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 104, cityName: "Rome", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 105, cityName: "Washington, D.C.", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 106, cityName: "Beijing", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 107, cityName: "Tokyo", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 108, cityName: "Moscow", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 109, cityName: "Ottawa", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    { id: 110, cityName: "Brasilia", difficulty: "Easy", minScoreToUnlock: 6, category: "capital" },
    // Medium
    { id: 111, cityName: "New Delhi", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 112, cityName: "Cairo", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 113, cityName: "Buenos Aires", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 114, cityName: "Pretoria", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 115, cityName: "Bangkok", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 116, cityName: "Seoul", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 117, cityName: "Jakarta", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 118, cityName: "Riyadh", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 119, cityName: "Ankara", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    { id: 120, cityName: "Wellington", difficulty: "Medium", minScoreToUnlock: 6, category: "capital" },
    // Hard
    { id: 121, cityName: "Bern", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 122, cityName: "Brussels", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 123, cityName: "Lisbon", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 124, cityName: "Stockholm", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 125, cityName: "Oslo", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 126, cityName: "Copenhagen", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 127, cityName: "Helsinki", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 128, cityName: "Amsterdam", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 129, cityName: "Warsaw", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },
    { id: 130, cityName: "Canberra", difficulty: "Hard", minScoreToUnlock: 6, category: "capital" },

    // --- HAUTE-GARONNE (Levels 201-230) ---
    // Easy
    { id: 201, cityName: "Toulouse", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 202, cityName: "Colomiers", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 203, cityName: "Tournefeuille", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 204, cityName: "Blagnac", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 205, cityName: "Muret", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 206, cityName: "Cugnaux", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 207, cityName: "Plaisance-du-Touch", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 208, cityName: "Balma", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 209, cityName: "Ramonville-Saint-Agne", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 210, cityName: "Castanet-Tolosan", difficulty: "Easy", minScoreToUnlock: 6, category: "haute_garonne" },
    // Medium
    { id: 211, cityName: "Fonsorbes", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 212, cityName: "L'Union", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 213, cityName: "Saint-Gaudens", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 214, cityName: "Saint-Orens-de-Gameville", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 215, cityName: "Saint-Jean", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 216, cityName: "Castelginest", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 217, cityName: "Portet-sur-Garonne", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 218, cityName: "Revel", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 219, cityName: "Auterive", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 220, cityName: "Saint-Lys", difficulty: "Medium", minScoreToUnlock: 6, category: "haute_garonne" },
    // Hard
    { id: 221, cityName: "Villeneuve-Tolosane", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 222, cityName: "Frouzins", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 223, cityName: "Léguevin", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 224, cityName: "Seysses", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 225, cityName: "Grenade", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 226, cityName: "Pibrac", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 227, cityName: "Aucamville", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 228, cityName: "La Salvetat-Saint-Gilles", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 229, cityName: "Aussonne", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
    { id: 230, cityName: "Escalquens", difficulty: "Hard", minScoreToUnlock: 6, category: "haute_garonne" },
];
