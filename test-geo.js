async function test() {
  try {
    const res = await fetch('https://geo.api.gouv.fr/communes?nom=Paris&fields=nom,contour,codesPostaux&format=geojson&geometry=contour');
    const data = await res.json();
    const exactMatch = data.features.find(f => f.properties.nom.toLowerCase() === 'paris');
    if (exactMatch) {
      console.log('Found exact match for Paris. Geotype:', exactMatch.geometry.type);
    } else {
      console.log('Not found');
    }
  } catch (e) {
    console.error(e);
  }
}
test();
