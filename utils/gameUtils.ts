export interface CityData {
    name: string;
    zip: string;
    population: number;
    coords: Coordinates;
    category: string[];
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export const calculateDistance = (from: Coordinates, to: Coordinates): number => {
    const toRadian = (degree: number) => (degree * Math.PI) / 180;
    
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = toRadian(to.lat - from.lat);
    const dLon = toRadian(to.lng - from.lng);
    const lat1 = toRadian(from.lat);
    const lat2 = toRadian(to.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in km
};

export const calculateDirection = (from: Coordinates, to: Coordinates): string => {
    const dLat = to.lat - from.lat;
    const dLng = to.lng - from.lng;

    // Simple 8-point compass
    const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    const normalizedAngle = (angle + 360) % 360;

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(normalizedAngle / 45) % 8;

    return directions[index];
};

export const getRandomCity = (cities: CityData[]): CityData => {
    return cities[Math.floor(Math.random() * cities.length)];
};

// Seeded random number generator (simple version for daily)
const mulberry32 = (a: number) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Get city based on date string (YYYY-MM-DD)
export const getDailyCity = (cities: CityData[], dateStr: string): CityData => {
    // Basic hash of the date string to use as seed
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Use seeded RNG
    const randomFunc = mulberry32(hash);
    
    // Sort cities to guarantee same order before picking
    const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));
    
    const index = Math.floor(randomFunc() * sortedCities.length);
    return sortedCities[index];
};

export const getDifficultyFromPopulation = (population: number): 'Facile' | 'Moyen' | 'Difficile' | 'Expert' => {
    if (population > 100000) return 'Facile';
    if (population > 20000) return 'Moyen';
    if (population > 5000) return 'Difficile';
    return 'Expert';
};

// Generate hint string (e.g. "T-------" or "S---- E------")
export const generateHintString = (cityName: string): string => {
    let hint = "";
    let isNewWord = true;
    for (const char of cityName) {
        if (/\p{L}/u.test(char)) {
            if (isNewWord) {
                hint += char;
                isNewWord = false;
            } else {
                hint += '_';
            }
        } else {
            isNewWord = true;
            if (char === '-') {
                hint += ' - ';
            } else {
                hint += char;
            }
        }
    }
    return hint;
};
