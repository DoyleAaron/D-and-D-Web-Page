/**
 * LAND vs WATER BOUNDARY ANALYZER
 * Compares kingdom land borders to water regions
 * Outputs where water needs to be adjusted to meet land
 */

const fs = require('fs');

// Read map-coordinates.js
const mapCoordsCode = fs.readFileSync('map-coordinates.js', 'utf8');

// Extract the MAP_COORDINATES object
const coordsMatch = mapCoordsCode.match(/const MAP_COORDINATES = \{([\s\S]*?)\};/);
if (!coordsMatch) {
  console.error('Could not parse MAP_COORDINATES');
  process.exit(1);
}

// Parse the arrays manually
function extractArray(code, name) {
  const regex = new RegExp(name + ':\\s*\\[([\\s\\S]*?)\\]\\s*,?\\s*\\/\\/', 'm');
  const match = code.match(regex);
  if (!match) return [];
  
  const points = [];
  const pointRegex = /\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)\s*\}/g;
  let m;
  while ((m = pointRegex.exec(match[1])) !== null) {
    points.push({ x: parseFloat(m[1]), y: parseFloat(m[2]) });
  }
  return points;
}

// Extract all land borders
const braewood = extractArray(mapCoordsCode, 'braewood');
const islefield = extractArray(mapCoordsCode, 'islefield');
const kluimont = extractArray(mapCoordsCode, 'kluimont');
const lavalto = extractArray(mapCoordsCode, 'lavalto');

console.log('='.repeat(70));
console.log('LAND BOUNDARY ANALYSIS');
console.log('='.repeat(70));
console.log('');

// Get bounds for each
function getBounds(points) {
  if (points.length === 0) return null;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

console.log('KINGDOM BOUNDS:');
console.log('Braewood:', getBounds(braewood));
console.log('Islefield:', getBounds(islefield));
console.log('Kluimont:', getBounds(kluimont));
console.log('Lavalto Island:', getBounds(lavalto));
console.log('');

// Identify coastal segments of each kingdom
// A point is "coastal" if it's near the map edge (ocean) or touches water

console.log('='.repeat(70));
console.log('COASTAL EDGE ANALYSIS');
console.log('='.repeat(70));
console.log('');

// Braewood coastal edges (east and north of map)
console.log('BRAEWOOD COASTAL POINTS:');
console.log('North coast (y < 25):');
const braewoodNorth = braewood.filter(p => p.y < 25);
braewoodNorth.forEach(p => console.log(`  (${p.x}, ${p.y})`));

console.log('East coast (x > 85):');
const braewoodEast = braewood.filter(p => p.x > 85);
braewoodEast.forEach(p => console.log(`  (${p.x}, ${p.y})`));

console.log('South coast (y > 75, x > 55):');
const braewoodSouth = braewood.filter(p => p.y > 75 && p.x > 55);
braewoodSouth.forEach(p => console.log(`  (${p.x}, ${p.y})`));

console.log('');

// Islefield coastal edges (west and south of map)
console.log('ISLEFIELD COASTAL POINTS:');
console.log('West coast (x < 10):');
const islefieldWest = islefield.filter(p => p.x < 10);
islefieldWest.forEach(p => console.log(`  (${p.x}, ${p.y})`));

console.log('South coast (y > 90):');
const islefieldSouth = islefield.filter(p => p.y > 90);
islefieldSouth.forEach(p => console.log(`  (${p.x}, ${p.y})`));

console.log('');

// Kluimont - this is complex because it has islands
console.log('KLUIMONT STRUCTURE:');
console.log('Total points:', kluimont.length);

// Find gaps in the polygon - these indicate separate island shapes
// Look for big jumps in coordinates
let islands = [];
let currentIsland = [];
for (let i = 0; i < kluimont.length; i++) {
  const p = kluimont[i];
  if (currentIsland.length === 0) {
    currentIsland.push(p);
  } else {
    const last = currentIsland[currentIsland.length - 1];
    const dist = Math.sqrt((p.x - last.x) ** 2 + (p.y - last.y) ** 2);
    if (dist > 10) {
      // Big jump - new island
      islands.push(currentIsland);
      currentIsland = [p];
    } else {
      currentIsland.push(p);
    }
  }
}
if (currentIsland.length > 0) islands.push(currentIsland);

console.log('Found', islands.length, 'separate land masses in Kluimont:');
islands.forEach((island, i) => {
  const bounds = getBounds(island);
  console.log(`  Island ${i + 1}: ${island.length} points, bounds: x(${bounds.minX.toFixed(1)}-${bounds.maxX.toFixed(1)}), y(${bounds.minY.toFixed(1)}-${bounds.maxY.toFixed(1)})`);
});

console.log('');
console.log('='.repeat(70));
console.log('LAVALTO LAKE ANALYSIS');
console.log('='.repeat(70));
console.log('');

// The Lavalto border IS the volcanic island in the center
// The LAKE is the ring of water AROUND this island
const lavaltoBounds = getBounds(lavalto);
console.log('Lavalto Island (volcanic center):');
console.log('  Bounds:', lavaltoBounds);
console.log('  This is the FORBIDDEN zone for ships');
console.log('');

// The lake extends beyond the island - we need to find where
// Look at which kingdom borders touch the lake area
console.log('Kingdoms that touch Lavalto Lake area (x: 45-66, y: 48-70):');
const lakeArea = { minX: 45, maxX: 66, minY: 48, maxY: 70 };

const braewoodLake = braewood.filter(p => 
  p.x >= lakeArea.minX && p.x <= lakeArea.maxX && 
  p.y >= lakeArea.minY && p.y <= lakeArea.maxY
);
console.log('Braewood points in lake area:', braewoodLake.length);
braewoodLake.forEach(p => console.log(`  (${p.x}, ${p.y})`));

const islefieldLake = islefield.filter(p => 
  p.x >= lakeArea.minX && p.x <= lakeArea.maxX && 
  p.y >= lakeArea.minY && p.y <= lakeArea.maxY
);
console.log('Islefield points in lake area:', islefieldLake.length);
islefieldLake.forEach(p => console.log(`  (${p.x}, ${p.y})`));

const kluimontLake = kluimont.filter(p => 
  p.x >= lakeArea.minX && p.x <= lakeArea.maxX && 
  p.y >= lakeArea.minY && p.y <= lakeArea.maxY
);
console.log('Kluimont points in lake area:', kluimontLake.length);
kluimontLake.forEach(p => console.log(`  (${p.x}, ${p.y})`));

console.log('');
console.log('='.repeat(70));
console.log('WATER BOUNDARY REQUIREMENTS');
console.log('='.repeat(70));
console.log('');

console.log('Based on land borders, water should be defined as:');
console.log('');

console.log('1. OCEAN_NORTH:');
console.log('   - Top edge of map (y=0) down to Braewood/Kluimont north borders');
console.log('   - Must include water between Rimduff Isles');
console.log('   - Eastern limit: where Braewood meets ocean (~x=87-94)');
console.log('   - Western limit: map edge (x=0)');
console.log('');

console.log('2. OCEAN_EAST:');
console.log('   - Right edge of map (x=100) to Braewood east coast');
console.log('   - Follows Braewood border from north (~y=20) to south (~y=80)');
console.log('');

console.log('3. OCEAN_SOUTH:');
console.log('   - Bottom edge of map (y=100) up to Braewood/Islefield south borders');
console.log('   - Braewood south: ~x=55-88, y=75-90');
console.log('   - Islefield south: ~x=2-35, y=80-100');
console.log('');

console.log('4. OCEAN_WEST:');
console.log('   - Left edge of map (x=0) to Islefield west coast');
console.log('   - Follows Islefield border from ~y=40 to ~y=90');
console.log('');

console.log('5. LAVALTO_LAKE:');
console.log('   - Ring of water between:');
console.log('     - Outer edge: Kluimont/Braewood/Islefield borders touching lake');
console.log('     - Inner edge: Lavalto Island border');
console.log('   - Ships can travel in the ring, NOT across the island');
console.log('');

console.log('6. RIMDUFF_SEA:');
console.log('   - Water between the Rimduff/Kluimont islands');
console.log('   - Part of ocean_north but between land masses');

// Output the actual coastal points that water boundaries should connect to
console.log('');
console.log('='.repeat(70));
console.log('EXACT COASTAL COORDINATES (for water boundaries)');
console.log('='.repeat(70));
console.log('');

// Braewood east coast (sorted by Y)
console.log('BRAEWOOD EAST COAST (x > 86):');
const beCoast = braewood.filter(p => p.x > 86).sort((a, b) => a.y - b.y);
beCoast.forEach(p => console.log(`  { x: ${p.x}, y: ${p.y} },`));

console.log('');
console.log('BRAEWOOD SOUTH COAST (y > 75):');
const bsCoast = braewood.filter(p => p.y > 75).sort((a, b) => a.x - b.x);
bsCoast.forEach(p => console.log(`  { x: ${p.x}, y: ${p.y} },`));

console.log('');
console.log('ISLEFIELD WEST COAST (x < 8):');
const iwCoast = islefield.filter(p => p.x < 8).sort((a, b) => a.y - b.y);
iwCoast.forEach(p => console.log(`  { x: ${p.x}, y: ${p.y} },`));

console.log('');
console.log('ISLEFIELD SOUTH COAST (y > 90):');
const isCoast = islefield.filter(p => p.y > 90).sort((a, b) => a.x - b.x);
isCoast.forEach(p => console.log(`  { x: ${p.x}, y: ${p.y} },`));
