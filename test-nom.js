async function test() {
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?q=Paris&country=France&format=json&polygon_geojson=1', {
      headers: {
        'User-Agent': 'CityGuessr-TestingApp/1.0 (test@example.com)'
      }
    });
    const data = await res.json();
    if (data.length > 0) {
      const best = data.find(d => d.osm_type === 'relation' && d.class === 'boundary');
      console.log('Best match:', best ? best.display_name : 'None');
      console.log('Has GeoJSON:', best && !!best.geojson);
      console.log('GeoJSON type:', best && best.geojson ? best.geojson.type : 'N/A');
    } else {
      console.log('No data');
    }
  } catch (e) {
    console.error(e);
  }
}
test();
