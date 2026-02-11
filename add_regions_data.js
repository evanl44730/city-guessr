const fs = require('fs');
const path = require('path');

const citiesPath = path.join(__dirname, 'data', 'cities.json');
const cities = require(citiesPath);

const regions = {
    'tarn': [
        { name: "Albi", zip: "81000", population: 49000, coords: { lat: 43.9289, lng: 2.1464 } },
        { name: "Castres", zip: "81100", population: 41000, coords: { lat: 43.6044, lng: 2.2427 } },
        { name: "Gaillac", zip: "81600", population: 15000, coords: { lat: 43.9006, lng: 1.8972 } },
        { name: "Mazamet", zip: "81200", population: 10000, coords: { lat: 43.4932, lng: 2.3736 } },
        { name: "Carmaux", zip: "81400", population: 9500, coords: { lat: 44.0515, lng: 2.1583 } },
        { name: "Graulhet", zip: "81300", population: 12000, coords: { lat: 43.7607, lng: 1.9892 } },
        { name: "Lavaur", zip: "81500", population: 10000, coords: { lat: 43.6986, lng: 1.8150 } },
        { name: "Saint-Sulpice-la-Pointe", zip: "81370", population: 9000, coords: { lat: 43.7744, lng: 1.6869 } },
        { name: "Saint-Juéry", zip: "81160", population: 6600, coords: { lat: 43.9483, lng: 2.2133 } },
        { name: "Aussillon", zip: "81200", population: 5800, coords: { lat: 43.4967, lng: 2.3583 } },
        { name: "Labruguière", zip: "81290", population: 6500, coords: { lat: 43.5228, lng: 2.2611 } },
        { name: "Rabastens", zip: "81800", population: 5600, coords: { lat: 43.8219, lng: 1.7244 } },
        { name: "Lisle-sur-Tarn", zip: "81310", population: 4600, coords: { lat: 43.8519, lng: 1.8106 } },
        { name: "Lescure-d'Albigeois", zip: "81380", population: 4500, coords: { lat: 43.9556, lng: 2.1764 } },
        { name: "Saïx", zip: "81710", population: 3500, coords: { lat: 43.5822, lng: 2.1831 } },
        { name: "Réalmont", zip: "81120", population: 3400, coords: { lat: 43.7761, lng: 2.1906 } },
        { name: "Blaye-les-Mines", zip: "81400", population: 3000, coords: { lat: 44.0306, lng: 2.1306 } },
        { name: "Puylaurens", zip: "81700", population: 3200, coords: { lat: 43.5714, lng: 2.0125 } },
        { name: "Marssac-sur-Tarn", zip: "81150", population: 3100, coords: { lat: 43.9161, lng: 2.0294 } },
        { name: "Cordes-sur-Ciel", zip: "81170", population: 900, coords: { lat: 44.0628, lng: 1.9519 } },
        { name: "Sorèze", zip: "81540", population: 2800, coords: { lat: 43.4533, lng: 2.0678 } },
        { name: "Valence-d'Albigeois", zip: "81340", population: 1300, coords: { lat: 44.0194, lng: 2.4056 } },
        { name: "Lacaune", zip: "81230", population: 2500, coords: { lat: 43.7067, lng: 2.6903 } },
        { name: "Brassac", zip: "81260", population: 1300, coords: { lat: 43.6292, lng: 2.4989 } },
        { name: "Montredon-Labessonnié", zip: "81360", population: 2000, coords: { lat: 43.7192, lng: 2.3283 } },
        { name: "Burlats", zip: "81100", population: 2100, coords: { lat: 43.6364, lng: 2.3181 } },
        { name: "Aiguefonde", zip: "81200", population: 2500, coords: { lat: 43.4939, lng: 2.3167 } },
        { name: "Arthès", zip: "81160", population: 2500, coords: { lat: 43.9422, lng: 2.2033 } },
        { name: "Le Sequestre", zip: "81990", population: 1800, coords: { lat: 43.9100, lng: 2.1158 } },
        { name: "Saint-Benoît-de-Carmaux", zip: "81400", population: 2100, coords: { lat: 44.0536, lng: 2.1286 } }
    ],
    'loire_atlantique': [
        { name: "Nantes", zip: "44000", population: 309346, coords: { lat: 47.2184, lng: -1.5536 } },
        { name: "Saint-Nazaire", zip: "44600", population: 70619, coords: { lat: 47.2736, lng: -2.2138 } },
        { name: "Saint-Herblain", zip: "44800", population: 46352, coords: { lat: 47.2140, lng: -1.6508 } },
        { name: "Rezé", zip: "44400", population: 42368, coords: { lat: 47.1921, lng: -1.5694 } },
        { name: "Saint-Sébastien-sur-Loire", zip: "44230", population: 27493, coords: { lat: 47.2025, lng: -1.5019 } },
        { name: "Orvault", zip: "44700", population: 27209, coords: { lat: 47.2764, lng: -1.6247 } },
        { name: "Vertou", zip: "44120", population: 25045, coords: { lat: 47.1683, lng: -1.4772 } },
        { name: "Couëron", zip: "44220", population: 22309, coords: { lat: 47.2153, lng: -1.7247 } },
        { name: "Carquefou", zip: "44470", population: 20365, coords: { lat: 47.2961, lng: -1.4925 } },
        { name: "La Chapelle-sur-Erdre", zip: "44240", population: 19609, coords: { lat: 47.2967, lng: -1.5542 } },
        { name: "Bouguenais", zip: "44340", population: 19903, coords: { lat: 47.1783, lng: -1.6225 } },
        { name: "La Baule-Escoublac", zip: "44500", population: 16132, coords: { lat: 47.2869, lng: -2.3953 } },
        { name: "Guérande", zip: "44350", population: 16112, coords: { lat: 47.3292, lng: -2.4294 } },
        { name: "Pornic", zip: "44210", population: 15570, coords: { lat: 47.1149, lng: -2.1028 } },
        { name: "Châteaubriant", zip: "44110", population: 12011, coords: { lat: 47.7192, lng: -1.3789 } },
        { name: "Saint-Brevin-les-Pins", zip: "44250", population: 14287, coords: { lat: 47.2472, lng: -2.1661 } },
        { name: "Sainte-Luce-sur-Loire", zip: "44980", population: 15238, coords: { lat: 47.2486, lng: -1.4883 } },
        { name: "Pornichet", zip: "44380", population: 10952, coords: { lat: 47.2611, lng: -2.3386 } },
        { name: "Pontchâteau", zip: "44160", population: 10771, coords: { lat: 47.4361, lng: -2.0886 } },
        { name: "Blain", zip: "44130", population: 9954, coords: { lat: 47.4756, lng: -1.7633 } },
        { name: "Basse-Goulaine", zip: "44115", population: 9092, coords: { lat: 47.2164, lng: -1.4644 } },
        { name: "Vallet", zip: "44330", population: 9182, coords: { lat: 47.1611, lng: -1.2661 } },
        { name: "Treillières", zip: "44119", population: 9219, coords: { lat: 47.3308, lng: -1.6192 } },
        { name: "Thouaré-sur-Loire", zip: "44470", population: 10261, coords: { lat: 47.2664, lng: -1.4406 } },
        { name: "Ancenis-Saint-Géréon", zip: "44150", population: 11012, coords: { lat: 47.3622, lng: -1.1764 } },
        { name: "Savenay", zip: "44260", population: 8689, coords: { lat: 47.3614, lng: -1.9422 } },
        { name: "Trignac", zip: "44570", population: 7983, coords: { lat: 47.3183, lng: -2.1883 } },
        { name: "Sautron", zip: "44880", population: 8451, coords: { lat: 47.2625, lng: -1.6661 } },
        { name: "Donges", zip: "44480", population: 8152, coords: { lat: 47.3203, lng: -2.0683 } },
        { name: "Saint-Julien-de-Concelles", zip: "44450", population: 7123, coords: { lat: 47.2536, lng: -1.3933 } }
    ],
    'aveyron': [
        { name: "Rodez", zip: "12000", population: 24057, coords: { lat: 44.3506, lng: 2.5750 } },
        { name: "Millau", zip: "12100", population: 22002, coords: { lat: 44.1011, lng: 3.0786 } },
        { name: "Villefranche-de-Rouergue", zip: "12200", population: 11781, coords: { lat: 44.3517, lng: 2.0353 } },
        { name: "Onet-le-Château", zip: "12850", population: 11659, coords: { lat: 44.3883, lng: 2.5700 } },
        { name: "Saint-Affrique", zip: "12400", population: 8023, coords: { lat: 43.9594, lng: 2.8872 } },
        { name: "Decazeville", zip: "12300", population: 5353, coords: { lat: 44.5572, lng: 2.2519 } },
        { name: "Luc-la-Primaube", zip: "12450", population: 6000, coords: { lat: 44.3161, lng: 2.5539 } },
        { name: "Capdenac-Gare", zip: "12700", population: 4407, coords: { lat: 44.5778, lng: 2.0831 } },
        { name: "Espalion", zip: "12500", population: 4601, coords: { lat: 44.5208, lng: 2.7633 } },
        { name: "Aubin", zip: "12110", population: 3741, coords: { lat: 44.5283, lng: 2.2472 } },
        { name: "Sévérac-d'Aveyron", zip: "12150", population: 4062, coords: { lat: 44.3217, lng: 3.0708 } },
        { name: "Olemps", zip: "12510", population: 3425, coords: { lat: 44.3417, lng: 2.5622 } },
        { name: "Baraqueville", zip: "12160", population: 3144, coords: { lat: 44.2764, lng: 2.4331 } },
        { name: "Bozouls", zip: "12340", population: 2886, coords: { lat: 44.4711, lng: 2.7214 } },
        { name: "Laissac-Sévérac l'Église", zip: "12310", population: 2147, coords: { lat: 44.3800, lng: 2.8300 } },
        { name: "Marcillac-Vallon", zip: "12330", population: 1729, coords: { lat: 44.4742, lng: 2.4631 } },
        { name: "Rieupeyroux", zip: "12240", population: 1961, coords: { lat: 44.3075, lng: 2.2367 } },
        { name: "Saint-Geniez-d'Olt-et-d'Aubrac", zip: "12130", population: 2192, coords: { lat: 44.4650, lng: 2.9733 } },
        { name: "Naucelle", zip: "12800", population: 2008, coords: { lat: 44.1978, lng: 2.3425 } },
        { name: "Réquista", zip: "12170", population: 1994, coords: { lat: 44.0325, lng: 2.5358 } },
        { name: "Montbazens", zip: "12220", population: 1407, coords: { lat: 44.4764, lng: 2.2294 } },
        { name: "Laguiole", zip: "12210", population: 1234, coords: { lat: 44.6839, lng: 2.8461 } },
        { name: "Salles-Curan", zip: "12410", population: 1005, coords: { lat: 44.1817, lng: 2.7889 } },
        { name: "Sainte-Radegonde", zip: "12850", population: 1756, coords: { lat: 44.3364, lng: 2.6289 } },
        { name: "Villeneuve", zip: "12260", population: 1988, coords: { lat: 44.4372, lng: 2.0306 } },
        { name: "Pont-de-Salars", zip: "12290", population: 1645, coords: { lat: 44.2817, lng: 2.7300 } },
        { name: "Entraygues-sur-Truyère", zip: "12140", population: 981, coords: { lat: 44.6461, lng: 2.5658 } },
        { name: "Livinhac-le-Haut", zip: "12300", population: 1122, coords: { lat: 44.5908, lng: 2.2333 } },
        { name: "Cransac", zip: "12110", population: 1473, coords: { lat: 44.5261, lng: 2.2858 } },
        { name: "Flavin", zip: "12450", population: 2331, coords: { lat: 44.2894, lng: 2.5975 } }
    ]
};

let addedCount = 0;
let updatedCount = 0;

Object.entries(regions).forEach(([category, newCities]) => {
    newCities.forEach(newCity => {
        const existingCity = cities.find(c => c.name === newCity.name && c.zip === newCity.zip);

        if (existingCity) {
            if (!existingCity.category.includes(category)) {
                existingCity.category.push(category);
                updatedCount++;
            }
        } else {
            cities.push({
                ...newCity,
                category: ['france_region', category]
            });
            addedCount++;
        }
    });
});

fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 4));
console.log(`Finished! Added: ${addedCount}, Updated: ${updatedCount}`);
