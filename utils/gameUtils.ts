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
