import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase admin environment variables. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }
});

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// List of 5 major cities per country
const countryCities = {
    'AL': ['Tirana', 'Durrës', 'Vlorë', 'Elbasan', 'Shkodër'],
    'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt am Main'],
    'AD': ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana'],
    'AT': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
    'BE': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège'],
    'BY': ['Minsk', 'Gomel', 'Vitebsk', 'Mogilev', 'Grodno'],
    'BA': ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar'],
    'BG': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse'],
    'CY': ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta'],
    'HR': ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar'],
    'DK': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza'],
    'EE': ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve'],
    'FI': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'], // Already heavily covered, but we can add them to country_FR
    'GR': ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa'],
    'HU': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs'],
    'IE': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford'],
    'IS': ['Reykjavik', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Reykjanesbær'],
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
    'XK': ['Pristina', 'Prizren', 'Ferizaj', 'Peja', 'Gjakova'],
    'LV': ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala'],
    'LI': ['Schaan', 'Vaduz', 'Triesen', 'Balzers', 'Eschen'],
    'LT': ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'],
    'LU': ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Pétange'],
    'MK': ['Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo'],
    'MT': ['St. Paul\'s Bay', 'Birkirkara', 'Sliema', 'Mosta', 'Qormi'],
    'MD': ['Chișinău', 'Tiraspol', 'Bălți', 'Bender', 'Rîbnița'],
    'MC': ['Monaco', 'Monte Carlo', 'La Condamine', 'Fontvieille', 'Moneghetti'],
    'ME': ['Podgorica', 'Nikšić', 'Herceg Novi', 'Pljevlja', 'Bar'],
    'NO': ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen'],
    'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    'PL': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań'],
    'PT': ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga'],
    'CZ': ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec'],
    'RO': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța'],
    'GB': ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    'SM': ['Serravalle', 'Borgo Maggiore', 'City of San Marino', 'Domagnano', 'Fiorentino'],
    'RS': ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica'],
    'SK': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra'],
    'SI': ['Ljubljana', 'Maribor', 'Kranj', 'Celje', 'Koper'],
    'SE': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Sollentuna'],
    'CH': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern'],
    'UA': ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk'],
    'VA': ['Vatican City'] // ONLY 1 city
};

async function getCityData(cityName, countryCode) {
    try {
        // We use free Open-Meteo geocoding API to get coordinates and population
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;
        console.log(`Fetching data for ${cityName}...`);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            console.warn(`⚠️ No results found for ${cityName}. Retrying without exact country match...`);
            return null;
        }

        // Try to find the result that matches the country_code
        // Note: Open-Meteo country_code is uppercase 2 letters
        let bestMatch = data.results.find(r => r.country_code === countryCode);
        
        if (!bestMatch) {
            console.warn(`⚠️ Could not strictly match ${cityName} to country ${countryCode}. Taking first result.`);
            bestMatch = data.results[0];
        }

        return {
            name: bestMatch.name,
            population: bestMatch.population || 1000, // default if not provided
            lat: bestMatch.latitude,
            lng: bestMatch.longitude
        };
    } catch (err) {
        console.error(`❌ Error fetching ${cityName}:`, err);
        return null;
    }
}

async function insertCitiesForCountry(countryCode, cities) {
    const records = [];
    const categoryName = `country_${countryCode}`;

    for (const [index, cityName] of cities.entries()) {
        const cityData = await getCityData(cityName, countryCode);
        
        if (cityData) {
            records.push({
                name: cityData.name,
                zip: countryCode, // Store country code in zip or metadata 
                population: cityData.population,
                lat: cityData.lat,
                lng: cityData.lng,
                category: ['europe', categoryName]
            });
        }
        
        // Open-Meteo limits ~10,000 req/day and rate limited to 1 per sec or so without key
        await delay(500); 
    }

    if (records.length > 0) {
        // Upsert by name + lat/lng or just name + zip
        // Simplest: just regular insert, Supabase ID is serial. 
        // We might want to clear old "country_XX" records first just in case.
        
        console.log(`Deleting existing ${categoryName} cities...`);
        await supabase
            .from('cities')
            .delete()
            .contains('category', [categoryName]);

        console.log(`Inserting ${records.length} cities for ${countryCode}...`);
        const { error } = await supabase
            .from('cities')
            .insert(records);

        if (error) {
            console.error(`❌ Error inserting ${countryCode}:`, error);
        } else {
            console.log(`✅ Success for ${countryCode}!`);
        }
    }
}

async function main() {
    console.log("Starting Europe cities import...");
    for (const [countryCode, cities] of Object.entries(countryCities)) {
        console.log(`\n\n--- Processing ${countryCode} ---`);
        await insertCitiesForCountry(countryCode, cities);
    }
    console.log("\nDone importing Europe cities!");
}

main().catch(console.error);
