import { getDistance } from 'geolib';
import citiesData from '@/data/cities.json';
export type CityData = typeof citiesData[0];

export interface Coordinates {
    lat: number;
    lng: number;
}


export const calculateDistance = (from: Coordinates, to: Coordinates): number => {
    return getDistance(
        { latitude: from.lat, longitude: from.lng },
        { latitude: to.lat, longitude: to.lng }
    ) / 1000; // Convert meters to km
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
