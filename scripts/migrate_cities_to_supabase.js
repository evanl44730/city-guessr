const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateData() {
  console.log("Starting migration...");
  const citiesPath = path.join(__dirname, '../data/cities.json');
  const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  
  console.log(`Found ${citiesData.length} cities to import.`);
  
  // Map the JSON structure to exactly match the Supabase table schema
  const formattedData = citiesData.map(city => ({
    name: city.name,
    zip: city.zip || null,
    population: city.population || null,
    lat: city.coords?.lat || 0,
    lng: city.coords?.lng || 0,
    category: city.category || []
  }));

  // Insert in batches to avoid overwhelming the database limits
  const BATCH_SIZE = 500;
  let totalInserted = 0;

  for (let i = 0; i < formattedData.length; i += BATCH_SIZE) {
    const batch = formattedData.slice(i, i + BATCH_SIZE);
    console.log(`Inserting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} cities)...`);
    
    const { data, error } = await supabase
      .from('cities')
      .insert(batch);
      
    if (error) {
      console.error("Error inserting batch:", error.message);
      break;
    }
    
    totalInserted += batch.length;
  }

  console.log(`Migration complete. Inserted ${totalInserted} rows.`);
}

migrateData().catch(console.error);
