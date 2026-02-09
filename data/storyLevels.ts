import { CityData } from "@/utils/gameUtils";

export interface StoryLevel {
    id: number;
    cityName: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
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
];
