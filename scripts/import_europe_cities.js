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

const countryCities = {
    'AL': ['Tirana', 'Durrës', 'Vlorë', 'Elbasan', 'Shkodër', 'Korçë', 'Fier', 'Berat', 'Lushnjë', 'Kavajë', 'Pogradec', 'Krujë', 'Kukës', 'Lezhë', 'Sarandë'],
    'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt am Main', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Duisburg'],
    'AD': ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana', 'Canillo', 'Ordino'], // Not enough cities
    'AT': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'St. Pölten', 'Dornbirn', 'Wiener Neustadt', 'Steyr', 'Feldkirch', 'Bregenz', 'Wolfsberg'],
    'BE': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst', 'Mechelen', 'La Louvière', 'Kortrijk', 'Hasselt', 'Sint-Niklaas'],
    'BY': ['Minsk', 'Gomel', 'Vitebsk', 'Mogilev', 'Grodno', 'Brest', 'Bobruisk', 'Baranovichi', 'Borisov', 'Pinsk', 'Orsha', 'Mozyr', 'Soligorsk', 'Novopolotsk', 'Lida'],
    'BA': ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina', 'Brčko', 'Prijedor', 'Doboj', 'Trebinje', 'Cazin', 'Zavidovići', 'Sanski Most', 'Pale', 'Kakanj'],
    'BG': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen', 'Haskovo', 'Yambol', 'Pazardzhik', 'Blagoevgrad', 'Veliko Tarnovo'],
    'CY': ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Protaras', 'Ayia Napa', 'Paralimni', 'Geroskipou', 'Morphou', 'Lefka', 'Troodos'], // Island
    'HR': ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Slavonski Brod', 'Pula', 'Sesvete', 'Karlovac', 'Sisak', 'Varaždin', 'Šibenik', 'Dubrovnik', 'Bjelovar', 'Vinkovci'],
    'DK': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Silkeborg', 'Helsingør', 'Næstved', 'Viborg'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón'],
    'EE': ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu', 'Sillamäe', 'Kuressaare', 'Võru', 'Valga', 'Haapsalu', 'Jõhvi', 'Paide'],
    'FI': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Kuopio', 'Lahti', 'Kouvola', 'Pori', 'Joensuu', 'Lappeenranta', 'Hämeenlinna', 'Vaasa'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Toulon', 'Saint-Étienne', 'Le Havre'],
    'GR': ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes', 'Ioannina', 'Chania', 'Chalcis', 'Katerini', 'Trikala', 'Kalamata', 'Serres', 'Alexandroupoli'],
    'HU': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely', 'Szolnok', 'Tatabánya', 'Érd', 'Sopron', 'Veszprém'],
    'IE': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan', 'Kilkenny', 'Ennis', 'Carlow', 'Tralee', 'Athlone'],
    'IS': ['Reykjavik', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Reykjanesbær', 'Garðabær', 'Mosfellsbær', 'Selfoss', 'Akranes', 'Seltjarnarnes'], // Smaller country
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste'],
    'XK': ['Pristina', 'Prizren', 'Ferizaj', 'Peja', 'Gjakova', 'Gjilan', 'Mitrovica', 'Vushtrri', 'Suharekë', 'Rahovec', 'Glogovac', 'Lipjan', 'Fushë Kosovë', 'Skënderaj', 'Klina'],
    'LV': ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Jēkabpils', 'Valmiera', 'Ogre', 'Tukums', 'Cēsis', 'Salaspils', 'Kuldīga', 'Sigulda'],
    'LI': ['Schaan', 'Vaduz', 'Triesen', 'Balzers', 'Eschen', 'Mauren', 'Triesenberg', 'Ruggell', 'Gamprin', 'Schellenberg'], // Microstate
    'LT': ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai', 'Jonava', 'Utena', 'Kėdainiai', 'Telšiai', 'Tauragė', 'Visaginas', 'Ukmergė'],
    'LU': ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Pétange', 'Sanem', 'Hesperange', 'Bettembourg', 'Schifflange', 'Mersch', 'Strassen', 'Kaerjeng', 'Walferdange', 'Echternach', 'Wiltz'],
    'MK': ['Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Veles', 'Štip', 'Ohrid', 'Gostivar', 'Strumica', 'Kavadarci', 'Kočani', 'Kičevo', 'Struga', 'Radoviš'],
    'MT': ['Birkirkara', 'Qormi', 'Mosta', 'Żabbar', 'St. Paul\'s Bay', 'Sliema', 'San Ġwann', 'Naxxar', 'Rabat', 'Żejtun', 'Żebbuġ', 'Fgura', 'Attard', 'Zurrieq', 'Hamrun'],
    'MD': ['Chișinău', 'Bălți', 'Tiraspol', 'Bender', 'Rîbnița', 'Cahul', 'Ungheni', 'Soroca', 'Orhei', 'Dubăsari', 'Comrat', 'Ceadîr-Lunga', 'Strășeni', 'Edineț', 'Căușeni'],
    'MC': ['Monaco'], // City-state
    'ME': ['Podgorica', 'Nikšić', 'Herceg Novi', 'Pljevlja', 'Bar', 'Bijelo Polje', 'Cetinje', 'Kotor', 'Budva', 'Berane', 'Ulcinj', 'Tivat', 'Rožaje', 'Danilovgrad', 'Mojkovac'],
    'NO': ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg', 'Skien', 'Ålesund', 'Sandefjord', 'Haugesund', 'Tønsberg'],
    'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen', 'Apeldoorn', 'Haarlem', 'Enschede', 'Arnhem', 'Amersfoort'],
    'PL': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Białystok', 'Katowice', 'Gdynia', 'Częstochowa', 'Radom', 'Toruń'],
    'PT': ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Almada', 'Agualva-Cacém', 'Queluz', 'Rio Tinto', 'Viseu', 'Aveiro', 'Odivelas'],
    'CZ': ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice', 'Zlín', 'Havířov', 'Kladno', 'Most', 'Opava'],
    'RO': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați', 'Ploiești', 'Oradea', 'Brăila', 'Arad', 'Pitești', 'Sibiu', 'Bacău'],
    'GB': ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Manchester', 'Sheffield', 'Leeds', 'Edinburgh', 'Leicester', 'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Nottingham'],
    'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk', 'Voronezh', 'Perm', 'Volgograd'],
    'SM': ['Serravalle', 'Borgo Maggiore', 'City of San Marino', 'Domagnano', 'Fiorentino', 'Acquaviva', 'Faetano', 'Chiesanuova', 'Montegiardino'], // Microstate
    'RS': ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo', 'Čačak', 'Kruševac', 'Kraljevo', 'Novi Pazar', 'Smederevo', 'Leskovac', 'Užice', 'Valjevo'],
    'SK': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra', 'Banská Bystrica', 'Trnava', 'Martin', 'Trenčín', 'Poprad', 'Prievidza', 'Zvolen', 'Považská Bystrica', 'Nové Zámky', 'Michalovce'],
    'SI': ['Ljubljana', 'Maribor', 'Kranj', 'Koper', 'Celje', 'Novo Mesto', 'Domžale', 'Velenje', 'Nova Gorica', 'Kamnik', 'Krško', 'Slovenska Bistrica', 'Jesenice', 'Škofja Loka', 'Izola'],
    'SE': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Södertälje'],
    'CH': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel/Bienne', 'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Fribourg', 'Schaffhausen'],
    'UA': ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Zaporizhzhia', 'Lviv', 'Kryvyi Rih', 'Mykolaiv', 'Sevastopol', 'Mariupol', 'Luhansk', 'Vinnytsia', 'Makiivka', 'Simferopol'],
    'VA': ['Vatican City'] // Microstate
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
