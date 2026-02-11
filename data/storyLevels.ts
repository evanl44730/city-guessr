import { CityData } from "@/utils/gameUtils";

export interface StoryLevel {
    id: number;
    cityName: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert';
    minScoreToUnlock: number; // e.g., max attempts allowed (maybe just 'win' is enough)
}

export const STORY_LEVELS: StoryLevel[] = [
    // Levels 1-10: Easy (Large Metropolises)
    { id: 1, cityName: "Paris", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 2, cityName: "Marseille", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 3, cityName: "Lyon", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 4, cityName: "Toulouse", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 5, cityName: "Nice", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 6, cityName: "Nantes", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 7, cityName: "Strasbourg", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 8, cityName: "Montpellier", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 9, cityName: "Bordeaux", difficulty: "Easy", minScoreToUnlock: 6 },
    { id: 10, cityName: "Lille", difficulty: "Easy", minScoreToUnlock: 6 },

    // Levels 11-20: Medium (Regional Hubs)
    { id: 11, cityName: "Rennes", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 12, cityName: "Reims", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 13, cityName: "Le Havre", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 14, cityName: "Saint-Étienne", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 15, cityName: "Toulon", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 16, cityName: "Grenoble", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 17, cityName: "Dijon", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 18, cityName: "Angers", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 19, cityName: "Nîmes", difficulty: "Medium", minScoreToUnlock: 6 },
    { id: 20, cityName: "Clermont-Ferrand", difficulty: "Medium", minScoreToUnlock: 6 },

    // Levels 21-30: Hard (Smaller or Remote)
    { id: 21, cityName: "Le Mans", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 22, cityName: "Aix-en-Provence", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 23, cityName: "Brest", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 24, cityName: "Tours", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 25, cityName: "Amiens", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 26, cityName: "Limoges", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 27, cityName: "Annecy", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 28, cityName: "Perpignan", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 29, cityName: "Metz", difficulty: "Hard", minScoreToUnlock: 6 },
    { id: 30, cityName: "Besançon", difficulty: "Hard", minScoreToUnlock: 6 },

    // Levels 31-40: Very Hard (Notable but slightly smaller/tricky)
    { id: 31, cityName: "Orléans", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 32, cityName: "Rouen", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 33, cityName: "Mulhouse", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 34, cityName: "Caen", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 35, cityName: "Nancy", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 36, cityName: "Avignon", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 37, cityName: "Poitiers", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 38, cityName: "Dunkerque", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 39, cityName: "La Rochelle", difficulty: "Very Hard", minScoreToUnlock: 6 },
    { id: 40, cityName: "Pau", difficulty: "Very Hard", minScoreToUnlock: 6 },

    // Levels 41-50: Expert (Smaller regional hubs & specific landmarks)
    { id: 41, cityName: "Ajaccio", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 42, cityName: "Bastia", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 43, cityName: "Calais", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 44, cityName: "Cannes", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 45, cityName: "Colmar", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 46, cityName: "Bourges", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 47, cityName: "Quimper", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 48, cityName: "Troyes", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 49, cityName: "Chambéry", difficulty: "Expert", minScoreToUnlock: 6 },
    { id: 50, cityName: "Carcassonne", difficulty: "Expert", minScoreToUnlock: 6 },
];
