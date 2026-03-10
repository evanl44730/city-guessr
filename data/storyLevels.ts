import { CityData } from "@/utils/gameUtils";

export interface StoryLevel {
    id: number;
    cityName: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert';
    minScoreToUnlock: number;
    category: string;
    population?: number;
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
];

/**
 * Generate StoryLevels for a specific department
 */
export function generateStoryLevelsForDepartment(departmentId: string, cities: CityData[]): StoryLevel[] {
    // A department category is typically prefixed, but here we just pass the raw string if needed, e.g., dept_31
    const categoryName = `dept_${departmentId}`;

    // Get the base ID for this department (e.g., department 31 will use IDs 3101-3130)
    // To ensure unique IDs, we can use a formula like: 10000 + (parseInt(departmentId) * 100)
    // Actually, maybe simpler: just generate IDs from 1 to 30 and ensure state is isolated per department.
    // Or, unique IDs per department: 200 + index? If there are 101 departments, that could overlap.
    // Let's use 1000 * depNum + index
    // Note: depId can be "2A" or "2B", so hash it or just use a stable formula
    
    // Sort cities by population (descending) to assign difficulty: most populated = Easy, least = Expert
    const sortedCities = [...cities].sort((a, b) => b.population - a.population);
    
    return sortedCities.slice(0, 30).map((city, index) => {
        let difficulty: StoryLevel['difficulty'] = 'Easy';
        if (index >= 10 && index < 20) difficulty = 'Medium';
        if (index >= 20 && index < 25) difficulty = 'Hard';
        if (index >= 25) difficulty = 'Expert';

        // Base ID 1 for index 0. To make it totally unique, let's just use index + 1
        // since progress isolated by level ID might overlap? 
        // Wait, progress in useGame is an object `{ [levelId]: score }`. 
        // We MUST guarantee unique IDs across ALL categories!
        // String ID would be better, but StoryLevel requires number ID.
        // Let's create a numerical hash for the department string.
        let deptNum = 0;
        if (departmentId === '2A') deptNum = 201;
        else if (departmentId === '2B') deptNum = 202;
        else deptNum = parseInt(departmentId) || 0; // works for 971, etc.
        
        const uniqueId = (deptNum * 1000) + (index + 1);

        return {
            id: uniqueId,
            cityName: city.name,
            difficulty,
            minScoreToUnlock: 6,
            category: categoryName,
            population: city.population
        };
    });
}

/**
 * Generate StoryLevels for a specific country (5 levels)
 */
export function generateStoryLevelsForCountry(countryId: string, cities: CityData[]): StoryLevel[] {
    const categoryName = `country_${countryId}`;

    const sortedCities = [...cities].sort((a, b) => b.population - a.population);
    
    // Country IDs are strings like "IT", we need a reliable numeric hash to avoid ID collisions
    // Simple hash: charCodeAt(0) * 1000 + charCodeAt(1) * 10
    const hash = (countryId.charCodeAt(0) * 1000) + (countryId.charCodeAt(1) * 10);
    
    return sortedCities.slice(0, 5).map((city, index) => {
        let difficulty: StoryLevel['difficulty'] = 'Easy';
        if (index === 1) difficulty = 'Medium';
        if (index === 2) difficulty = 'Hard';
        if (index === 3) difficulty = 'Very Hard';
        if (index === 4) difficulty = 'Expert';

        return {
            id: hash + index + 1, // e.g., 73841, 73842...
            cityName: city.name,
            difficulty,
            minScoreToUnlock: 6,
            category: categoryName,
            population: city.population
        };
    });
}
