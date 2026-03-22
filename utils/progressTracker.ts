import { CityData } from './gameUtils';

export const FOUND_CITIES_KEY = 'city_guessr_found_cities';

export function trackFoundCity(city: CityData) {
    if (typeof window === 'undefined') return;
    try {
        const stored = localStorage.getItem(FOUND_CITIES_KEY);
        const foundCities: CityData[] = stored ? JSON.parse(stored) : [];
        
        // Prevent duplicates based on coordinates
        const isAlreadyFound = foundCities.some(
            c => c.name === city.name && c.coords.lat === city.coords.lat && c.coords.lng === city.coords.lng
        );
        
        if (!isAlreadyFound) {
            foundCities.push({
                name: city.name,
                coords: city.coords,
                population: city.population,
                zip: city.zip,
                category: city.category
            });
            localStorage.setItem(FOUND_CITIES_KEY, JSON.stringify(foundCities));
            
            // Dispatch event for UI updates if needed
            window.dispatchEvent(new CustomEvent('city_found', { detail: city }));
        }
    } catch (e) {
        console.error("Erreur lors de l'enregistrement de la ville trouvée:", e);
    }
}

export function getFoundCities(): CityData[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(FOUND_CITIES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}
