/**
 * BOUNDARY ANALYSIS SCRIPT
 * Compares water boundaries to land boundaries
 * Run with: node analyze-boundaries.js
 */

const fs = require('fs');

// =====================================================
// LAND BOUNDARIES (from map-coordinates.js)
// These are the AUTHORITATIVE boundaries - water must align to these
// =====================================================

// Braewood coastal points (eastern kingdom - touches ocean_east and ocean_south)
const BRAEWOOD_COAST = {
  // Eastern coast (north to south)
  east: [
    { x: 91, y: 18.5 }, { x: 93.8, y: 16.8 }, { x: 94.6, y: 13.7 }, { x: 94.1, y: 10.2 },
    { x: 91.3, y: 6.9 }, { x: 89.6, y: 4.8 }, { x: 87.1, y: 4.4 }, { x: 83.7, y: 3.8 },
    // Going down the east coast
    { x: 87.6, y: 20.8 }, { x: 86.5, y: 23.2 }, { x: 86, y: 27.6 }, { x: 86.3, y: 30.1 },
    { x: 88.9, y: 32.3 }, { x: 91.4, y: 35.1 }, { x: 92.9, y: 39.4 }, { x: 93.5, y: 48.9 },
    { x: 93.7, y: 55.4 }, { x: 93.3, y: 63.7 }, { x: 92.6, y: 70.5 }, { x: 90, y: 76.5 },
    { x: 84.8, y: 83.7 },
  ],
  // Southern coast  
  south: [
    { x: 84.8, y: 83.7 }, { x: 81.1, y: 88.3 }, { x: 78.7, y: 89.3 }, { x: 76.7, y: 90 },
    { x: 72.8, y: 89 }, { x: 69.4, y: 87.3 }, { x: 65.1, y: 86 }, { x: 62, y: 84.7 },
    { x: 59.1, y: 82.3 }, { x: 56.2, y: 79.2 }, { x: 54.7, y: 74.8 }, { x: 55.8, y: 72.6 },
  ]
};

// Islefield coastal points (southwestern kingdom - touches ocean_west and ocean_south)  
const ISLEFIELD_COAST = {
  // Western coast (north to south)
  west: [
    { x: 12.4, y: 43.8 }, { x: 11.2, y: 46.5 }, { x: 8.5, y: 49.9 }, { x: 7.5, y: 51.7 },
    { x: 6.3, y: 54.2 }, { x: 5.9, y: 57 }, { x: 5.6, y: 62 }, { x: 4.8, y: 65.9 },
    { x: 5.6, y: 67.3 }, { x: 5.7, y: 69.6 }, { x: 4.2, y: 70.6 }, { x: 2.5, y: 73 },
    { x: 2.4, y: 77.5 }, { x: 2.5, y: 81 }, { x: 3.2, y: 83.5 }, { x: 4, y: 86.2 },
    { x: 5.9, y: 90 }, { x: 7.5, y: 91.7 }, { x: 8.9, y: 93.7 }, { x: 10.6, y: 95 },
    { x: 13.2, y: 97.4 }, { x: 15.2, y: 98.2 }, { x: 18.4, y: 99.1 }, { x: 21.1, y: 99.5 },
    { x: 24.2, y: 99.9 },
  ],
  // Southern coast (connecting to Braewood)
  south: [
    { x: 24.2, y: 99.9 }, { x: 27.2, y: 99.8 }, { x: 28.9, y: 99.5 }, { x: 31, y: 96.8 },
    { x: 29.1, y: 94.2 }, { x: 28.9, y: 92.2 }, { x: 27.4, y: 90 }, { x: 27.4, y: 87.8 },
    { x: 27.6, y: 84.2 }, { x: 27.3, y: 81.9 }, { x: 27.6, y: 79.9 },
  ],
  // Northern boundary (touches Kluimont/inland)
  north: [
    { x: 12.4, y: 43.8 }, { x: 14, y: 43.6 }, { x: 15.6, y: 42.7 }, { x: 17.6, y: 42.7 },
    { x: 19.6, y: 42.9 }, { x: 20.8, y: 42.3 }, { x: 22.5, y: 41.6 }, { x: 24, y: 40.8 },
    { x: 25.1, y: 40.1 }, { x: 27.8, y: 40.5 }, { x: 30.4, y: 40.5 },
  ]
};

// Kluimont coastal points (northwestern islands - in ocean_north area)
const KLUIMONT_COAST = {
  // Main island chain boundaries
  islands: [
    // Main coast points from border
    { x: 9.3, y: 4.3 }, { x: 7.8, y: 5.1 }, { x: 6.3, y: 6.4 }, { x: 5.4, y: 7.1 },
    { x: 4.4, y: 7.9 }, { x: 3.8, y: 10.8 }, { x: 3.8, y: 13.5 }, { x: 4.8, y: 16.1 },
    { x: 6, y: 18.1 }, { x: 8.1, y: 19.5 }, { x: 9.6, y: 21.4 }, { x: 11.8, y: 20.9 },
    { x: 13.2, y: 19.1 }, { x: 14.9, y: 17.6 }, { x: 16.6, y: 15.4 }, { x: 17.5, y: 14.1 },
    { x: 18.6, y: 11.9 }, { x: 20, y: 11.2 }, { x: 20.6, y: 9.8 }, { x: 18.8, y: 9.4 },
    { x: 17.2, y: 9.1 }, { x: 15.1, y: 9.2 }, { x: 13.8, y: 8.6 }, { x: 12.8, y: 9.2 },
    { x: 11.5, y: 8.8 }, { x: 11.3, y: 6.3 }, { x: 10, y: 5.4 },
  ]
};

// Lavalto lake boundary (the lake itself)
const LAVALTO_LAKE_BOUNDARY = {
  // Outer lake boundary (where water meets land)
  outer: [
    { x: 57.4, y: 46.6 }, { x: 56.5, y: 49.6 }, { x: 58.9, y: 49.6 }, { x: 61.1, y: 50.4 },
    { x: 62.5, y: 51.7 }, { x: 63.2, y: 53.8 }, { x: 63.4, y: 55.6 }, { x: 62.3, y: 57.4 },
    { x: 61.4, y: 58.8 }, { x: 60, y: 61.2 }, { x: 57.4, y: 62.1 }, { x: 53.8, y: 61.5 },
    { x: 50.4, y: 60.3 }, { x: 47.1, y: 58 }, { x: 48.2, y: 55.5 }, { x: 48.9, y: 52 },
    { x: 51.6, y: 50.1 }, { x: 56, y: 49.2 }, { x: 54.7, y: 46.6 }, { x: 53.1, y: 47.1 },
    { x: 50.5, y: 48 }, { x: 48.4, y: 49.6 }, { x: 46.4, y: 52 }, { x: 45.5, y: 54.3 },
    { x: 45.5, y: 56.5 }, { x: 46, y: 58.8 }, { x: 46.7, y: 61 }, { x: 48.4, y: 62.8 },
    { x: 50.5, y: 63.1 }, { x: 53.8, y: 63.5 }, { x: 56.5, y: 63.4 }, { x: 59.2, y: 62.6 },
    { x: 62.7, y: 61.3 }, { x: 64.1, y: 59.2 }, { x: 66.1, y: 56.2 }, { x: 65.6, y: 54 },
    { x: 65.2, y: 51.9 }, { x: 64.1, y: 49 }, { x: 62.1, y: 48 }, { x: 59.8, y: 47.2 },
    { x: 56.2, y: 46.6 },
  ]
};

// =====================================================
// CURRENT WATER BOUNDARIES (user provided - need to align to land)
// =====================================================

const CURRENT_OCEAN_REGIONS = {
  ocean_east: {
    name: 'Ocean - East Coast',
    points: [
      { x: 87.5, y: 21.6 }, { x: 91.5, y: 22.6 }, { x: 94.4, y: 24.6 }, { x: 95.3, y: 27.6 },
      { x: 94.2, y: 30.7 }, { x: 90.8, y: 31.9 }, { x: 87.9, y: 33.6 }, { x: 86.6, y: 36 },
      { x: 89.3, y: 39.4 }, { x: 91.3, y: 39.6 }, { x: 92.6, y: 41.5 }, { x: 94.4, y: 43.6 },
      { x: 94.6, y: 48.6 }, { x: 94.6, y: 52.2 }, { x: 94.7, y: 55.8 }, { x: 94.2, y: 61.3 },
      { x: 93.1, y: 65.6 }, { x: 90.4, y: 68.8 }, { x: 88.4, y: 73.4 }, { x: 88.4, y: 81.1 },
      { x: 98.9, y: 80.9 }, { x: 99.3, y: 19.8 }, { x: 88, y: 19.5 },
    ]
  },
  ocean_south: {
    name: 'Ocean - South Coast',
    points: [
      { x: 27.4, y: 70.7 }, { x: 27.9, y: 69.5 }, { x: 29.9, y: 68.8 }, { x: 31.7, y: 69.8 },
      { x: 33.3, y: 71.5 }, { x: 36.4, y: 71.9 }, { x: 40.6, y: 71.6 }, { x: 44.4, y: 70.9 },
      { x: 49.6, y: 69.8 }, { x: 50.4, y: 68.9 }, { x: 54, y: 68.9 }, { x: 56.5, y: 70 },
      { x: 60.1, y: 71 }, { x: 63.2, y: 72.1 }, { x: 66.3, y: 73.1 }, { x: 70.3, y: 74.2 },
      { x: 74.3, y: 74.9 }, { x: 77.5, y: 75.5 }, { x: 81.2, y: 74.5 }, { x: 83.7, y: 73.3 },
      { x: 87.7, y: 72.1 }, { x: 87.9, y: 74 }, { x: 87.9, y: 76.9 }, { x: 87.9, y: 80.5 },
      { x: 33, y: 79.9 }, { x: 30.4, y: 80.3 }, { x: 31.5, y: 78.7 }, { x: 30.4, y: 77.8 },
      { x: 27.7, y: 74.6 },
    ]
  },
  ocean_west: {
    name: 'Ocean - West Coast',
    points: [
      { x: 17.4, y: 80.9 }, { x: 0.4, y: 80.8 }, { x: 0.4, y: 32.7 }, { x: 1.8, y: 35.1 },
      { x: 6.2, y: 43.2 }, { x: 13.2, y: 45.3 }, { x: 7.8, y: 49.6 }, { x: 6.3, y: 52.5 },
      { x: 4.7, y: 56.5 }, { x: 4, y: 57.6 }, { x: 3.6, y: 59.8 }, { x: 4.7, y: 60.6 },
      { x: 4.7, y: 62.5 }, { x: 2.5, y: 63.4 }, { x: 1.8, y: 66.4 }, { x: 2.4, y: 70.7 },
      { x: 3.3, y: 73.3 }, { x: 4.3, y: 75.1 }, { x: 7.4, y: 76.9 },
    ]
  },
  ocean_north: {
    name: 'Ocean - North Coast',
    points: [
      { x: 8.3, y: 32.4 }, { x: 0.7, y: 32.1 }, { x: 0.4, y: 19.9 }, { x: 12.1, y: 19.2 },
      { x: 33.9, y: 19.2 }, { x: 86.8, y: 19 }, { x: 87, y: 21 }, { x: 46.2, y: 19.9 },
      { x: 42.9, y: 20.1 }, { x: 27.5, y: 23.2 }, { x: 24.6, y: 23.5 }, { x: 9.2, y: 21.6 },
      { x: 6.7, y: 21.6 }, { x: 4, y: 22.8 }, { x: 3.4, y: 24.9 }, { x: 3.6, y: 27.4 },
      { x: 4, y: 28.9 }, { x: 5.8, y: 31 },
    ]
  },
  lavalto_lake: {
    name: 'Lavalto Lake (Ring)',
    points: LAVALTO_LAKE_BOUNDARY.outer
  }
};

// =====================================================
// SETTLEMENTS (ports and lake towns)
// =====================================================

const SETTLEMENTS = {
  // North coast ports
  'vorton': { x: 43.9, y: 3.5 },
  'strane': { x: 46.5, y: 4.2 },
  'slada': { x: 89.3, y: 6.3 },
  'yotherdon': { x: 87.7, y: 15.3 },
  'borugham': { x: 75.9, y: 13.6 },
  
  // East coast ports  
  'ardismouth': { x: 86.7, y: 32.5 },
  'oyard': { x: 91.4, y: 41 },
  'ioxyhull': { x: 92.9, y: 60.1 },
  
  // Southeast coast ports
  'rens': { x: 78.3, y: 87.9 },
  'frore': { x: 80.5, y: 80 },
  'dalo': { x: 74.1, y: 83 },
  'trares': { x: 65, y: 81.3 },
  
  // South coast ports
  'kadena': { x: 56.2, y: 74.3 },
  'olkgend': { x: 64.6, y: 73.7 },
  'antstel': { x: 40.8, y: 74.6 },
  'halten': { x: 35.7, y: 77.9 },
  
  // Southwest coast ports
  'islefield-city': { x: 22.4, y: 83.1 },
  'cok': { x: 15.4, y: 81.7 },
  'cheling': { x: 14.9, y: 86.3 },
  'ulsall': { x: 15.4, y: 93.8 },
  'esterhull': { x: 26.2, y: 96.3 },
  
  // West coast ports
  'beyross': { x: 10.9, y: 74.3 },
  'agosgas': { x: 6.6, y: 65 },
  'wrando': { x: 16.8, y: 63 },
  'slido': { x: 18.1, y: 58.9 },
  'okcaster': { x: 7.2, y: 56.8 },
  'guatpool': { x: 13.2, y: 52.3 },
  
  // Kluimont (Rimduff Isles) ports
  'kluimont-city': { x: 10.7, y: 12.9 },
  'qrey': { x: 7.8, y: 7 },
  'tarora': { x: 18.5, y: 24.7 },
  'aresphia': { x: 9.2, y: 27.9 },
  'kilson': { x: 11, y: 29.5 },
  'eimgend-city': { x: 28.2, y: 35.4 },
  
  // Lavalto Lake ports
  'dawerton': { x: 58.8, y: 52.7 },
  'flison': { x: 51.7, y: 52.9 },
  'agosron': { x: 50, y: 62.7 },
  'sheyton': { x: 69.5, y: 53.3 },
};

// =====================================================
// ANALYSIS FUNCTIONS
// =====================================================

function getBounds(points) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// =====================================================
// RUN ANALYSIS
// =====================================================

console.log('=' .repeat(70));
console.log('BOUNDARY ANALYSIS REPORT');
console.log('='.repeat(70));
console.log('');

// 1. Show bounds for each ocean region
console.log('OCEAN REGION BOUNDS:');
console.log('-'.repeat(40));
for (const [name, region] of Object.entries(CURRENT_OCEAN_REGIONS)) {
  const bounds = getBounds(region.points);
  console.log(`${name}: x(${bounds.minX.toFixed(1)} - ${bounds.maxX.toFixed(1)}) y(${bounds.minY.toFixed(1)} - ${bounds.maxY.toFixed(1)})`);
}

console.log('');
console.log('LAND COASTAL BOUNDS:');
console.log('-'.repeat(40));
console.log(`Braewood East: x(${getBounds(BRAEWOOD_COAST.east).minX.toFixed(1)} - ${getBounds(BRAEWOOD_COAST.east).maxX.toFixed(1)}) y(${getBounds(BRAEWOOD_COAST.east).minY.toFixed(1)} - ${getBounds(BRAEWOOD_COAST.east).maxY.toFixed(1)})`);
console.log(`Braewood South: x(${getBounds(BRAEWOOD_COAST.south).minX.toFixed(1)} - ${getBounds(BRAEWOOD_COAST.south).maxX.toFixed(1)}) y(${getBounds(BRAEWOOD_COAST.south).minY.toFixed(1)} - ${getBounds(BRAEWOOD_COAST.south).maxY.toFixed(1)})`);
console.log(`Islefield West: x(${getBounds(ISLEFIELD_COAST.west).minX.toFixed(1)} - ${getBounds(ISLEFIELD_COAST.west).maxX.toFixed(1)}) y(${getBounds(ISLEFIELD_COAST.west).minY.toFixed(1)} - ${getBounds(ISLEFIELD_COAST.west).maxY.toFixed(1)})`);
console.log(`Kluimont Islands: x(${getBounds(KLUIMONT_COAST.islands).minX.toFixed(1)} - ${getBounds(KLUIMONT_COAST.islands).maxX.toFixed(1)}) y(${getBounds(KLUIMONT_COAST.islands).minY.toFixed(1)} - ${getBounds(KLUIMONT_COAST.islands).maxY.toFixed(1)})`);
console.log(`Lavalto Lake: x(${getBounds(LAVALTO_LAKE_BOUNDARY.outer).minX.toFixed(1)} - ${getBounds(LAVALTO_LAKE_BOUNDARY.outer).maxX.toFixed(1)}) y(${getBounds(LAVALTO_LAKE_BOUNDARY.outer).minY.toFixed(1)} - ${getBounds(LAVALTO_LAKE_BOUNDARY.outer).maxY.toFixed(1)})`);

console.log('');
console.log('SETTLEMENT WATER PROXIMITY CHECK:');
console.log('-'.repeat(40));

// Check which settlements are in which water regions
for (const [name, pos] of Object.entries(SETTLEMENTS)) {
  const inRegions = [];
  for (const [regionName, region] of Object.entries(CURRENT_OCEAN_REGIONS)) {
    if (pointInPolygon(pos.x, pos.y, region.points)) {
      inRegions.push(regionName);
    }
  }
  if (inRegions.length > 0) {
    console.log(`⚠️  ${name} (${pos.x}, ${pos.y}) is INSIDE: ${inRegions.join(', ')}`);
  }
}

console.log('');
console.log('LAVALTO LAKE PORT CHECK:');
console.log('-'.repeat(40));
const lakePorts = ['dawerton', 'flison', 'agosron', 'sheyton'];
lakePorts.forEach(port => {
  const pos = SETTLEMENTS[port];
  const inLake = pointInPolygon(pos.x, pos.y, LAVALTO_LAKE_BOUNDARY.outer);
  console.log(`${port} (${pos.x}, ${pos.y}) - in lake polygon: ${inLake ? '✅ YES' : '❌ NO'}`);
});

console.log('');
console.log('='.repeat(70));
console.log('END OF ANALYSIS');
console.log('='.repeat(70));
