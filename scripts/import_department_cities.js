const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Liste des codes de départements métropolitains et DOM
const DEPARTEMENTS = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2A', '2B', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', 
    '971', // Guadeloupe
    '972', // Martinique
    '973', // Guyane
    '974', // La Réunion
    '976'  // Mayotte
];

async function fetchCitiesForDepartment(depCode) {
    try {
        const response = await fetch(`https://geo.api.gouv.fr/departements/${depCode}/communes?fields=nom,codesPostaux,population,centre&format=json&geometry=centre`);
        if (!response.ok) {
            console.error(`Erreur HTTP lors de la récupération du département ${depCode}: ${response.status}`);
            return [];
        }
        const data = await response.json();
        
        // Filter out cities without needed data
        const validCities = data.filter(c => c.nom && c.codesPostaux && c.codesPostaux.length > 0 && c.population && c.centre && c.centre.coordinates);
        
        // Sort by population (descending)
        validCities.sort((a, b) => b.population - a.population);
        
        // Take top 30
        const top30 = validCities.slice(0, 30);
        
        // Format for Supabase
        const isDom = depCode.startsWith('97');
        const formattedCities = top30.map(c => ({
            name: c.nom,
            zip: c.codesPostaux[0], 
            population: c.population,
            lat: c.centre.coordinates[1], // API Geo returns [lon, lat]
            lng: c.centre.coordinates[0],
            category: [isDom ? 'france_dom' : 'france_metropole']
        }));
        
        return formattedCities;
    } catch (e) {
        console.error(`Erreur pour le département ${depCode}:`, e.message);
        return [];
    }
}

async function run() {
    console.log("Démarrage de l'importation par département...");
    
    // 1. Récupérer les villes déjà existantes dans la DB pour éviter les doublons sur le nom/zip
    console.log("Récupération des villes existantes dans Supabase...");
    let existingCities = new Set();
    const { data: currentDb, error } = await supabase.from('cities').select('name, zip');
    if (error) {
        console.error("Erreur lors de la récupération des villes existantes:", error.message);
        return;
    }
    currentDb.forEach(c => existingCities.add(`${c.name.toLowerCase()}-${c.zip}`));
    console.log(`${existingCities.size} villes existantes trouvées.`);

    let allNewCities = [];

    // 2. Fetcher de l'API geogouv
    for (const dep of DEPARTEMENTS) {
        console.log(`Récupération du département ${dep}...`);
        const depCities = await fetchCitiesForDepartment(dep);
        
        // Exclude those already in DB
        const newForDep = depCities.filter(c => !existingCities.has(`${c.name.toLowerCase()}-${c.zip}`));
        
        allNewCities.push(...newForDep);
        
        // Be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100)); 
    }
    
    console.log(`Génération terminée. ${allNewCities.length} nouvelles villes à insérer.`);
    
    // 3. Insérer en base de données par lot
    if (allNewCities.length === 0) {
        console.log("Aucune nouvelle ville à insérer.");
        return;
    }

    const BATCH_SIZE = 500;
    let totalInserted = 0;

    for (let i = 0; i < allNewCities.length; i += BATCH_SIZE) {
        const batch = allNewCities.slice(i, i + BATCH_SIZE);
        console.log(`Insertion lot ${Math.floor(i/BATCH_SIZE)+1} (${batch.length} villes)...`);
        
        const { error: insertError } = await supabase
            .from('cities')
            .insert(batch);
            
        if (insertError) {
            console.error("Erreur lors de l'insertion d'un lot:", insertError.message);
            break;
        }
        totalInserted += batch.length;
    }

    console.log(`Importation terminée avec succès ! ${totalInserted} nouvelles villes insérées dans Supabase.`);
}

run().catch(console.error);
