/**
 * CORRECTED WATER REGIONS
 * Aligned to land boundaries from map-coordinates.js
 * 
 * Land is SOURCE OF TRUTH - water boundaries follow land edges
 */

const WATER_REGIONS = {
  
  // ======================================================================
  // OCEAN EAST - East coast of Braewood to map edge
  // Follows Braewood east coast exactly, then extends to map edge (x=100)
  // ======================================================================
  ocean_east: [
    // Map corner NE
    { x: 100, y: 0 },
    // East edge of map
    { x: 100, y: 100 },
    // Southeast corner connecting to ocean_south
    { x: 90, y: 76.5 },
    // Follow Braewood east coast (going north, x > 86)
    { x: 92.6, y: 70.5 },
    { x: 93.3, y: 63.7 },
    { x: 93.7, y: 55.4 },
    { x: 93.5, y: 48.9 },
    { x: 92.9, y: 39.4 },
    { x: 91.4, y: 35.1 },
    { x: 88.9, y: 32.3 },
    { x: 86.3, y: 30.1 },
    { x: 86, y: 27.6 },
    { x: 86.5, y: 23.2 },
    { x: 87.6, y: 20.8 },
    { x: 91, y: 18.5 },
    { x: 93.8, y: 16.8 },
    { x: 94.6, y: 13.7 },
    { x: 94.1, y: 10.2 },
    { x: 91.3, y: 6.9 },
    { x: 89.6, y: 4.8 },
    { x: 87.1, y: 4.4 },
    // Back to map corner
  ],

  // ======================================================================
  // OCEAN SOUTH - Between Braewood south coast and Islefield south coast
  // From x~31 (end of Islefield south) to x~90 (Braewood)
  // ======================================================================
  ocean_south: [
    // Start from Islefield south coast end
    { x: 31, y: 96.8 },
    { x: 35, y: 100 },  // Map edge
    { x: 100, y: 100 }, // Map corner SE
    // Braewood south coast (going west)
    { x: 90, y: 76.5 },
    { x: 84.8, y: 83.7 },
    { x: 81.1, y: 88.3 },
    { x: 78.7, y: 89.3 },
    { x: 76.7, y: 90 },
    { x: 72.8, y: 89 },
    { x: 69.4, y: 87.3 },
    { x: 65.1, y: 86 },
    { x: 62, y: 84.7 },
    { x: 59.1, y: 82.3 },
    { x: 56.2, y: 79.2 },
    // Gap between Braewood and Islefield (water passage)
    { x: 50, y: 78 },  // Estimate - water between kingdoms
    { x: 40, y: 82 },  // Water
    { x: 35, y: 88 },  // Water
    // Islefield south coast (going west)
    { x: 31, y: 96.8 },
    { x: 29.1, y: 94.2 },
    { x: 28.9, y: 92.2 },
    { x: 28.9, y: 99.5 },
    { x: 27.2, y: 99.8 },
    { x: 24.2, y: 99.9 },
    { x: 21.1, y: 99.5 },
    { x: 18.4, y: 99.1 },
    { x: 15.2, y: 98.2 },
    { x: 13.2, y: 97.4 },
    { x: 10.6, y: 95 },
    { x: 8.9, y: 93.7 },
    { x: 7.5, y: 91.7 },
    // Connects to ocean_west
  ],

  // ======================================================================
  // OCEAN WEST - West coast of Islefield to map edge
  // Follows Islefield west coast exactly
  // ======================================================================
  ocean_west: [
    // Map edge
    { x: 0, y: 40 },
    { x: 0, y: 100 },  // Map corner SW
    // Connect to Islefield south
    { x: 7.5, y: 91.7 },
    // Follow Islefield west coast (going north)
    { x: 5.9, y: 90 },
    { x: 4, y: 86.2 },
    { x: 3.2, y: 83.5 },
    { x: 2.5, y: 81 },
    { x: 2.4, y: 77.5 },
    { x: 2.5, y: 73 },
    { x: 4.2, y: 70.6 },
    { x: 5.7, y: 69.6 },
    { x: 5.6, y: 67.3 },
    { x: 4.8, y: 65.9 },
    { x: 5.6, y: 62 },
    { x: 5.9, y: 57 },
    { x: 6.3, y: 54.2 },
    { x: 7.5, y: 51.7 },
    { x: 8.5, y: 49.9 },
    // Islefield ends, connect to mainland
  ],

  // ======================================================================
  // OCEAN NORTH - North of Braewood/Kluimont, around Rimduff Isles
  // Complex - contains multiple island "holes"
  // ======================================================================
  ocean_north: [
    // Map edge - top of map
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    // Connect to Braewood at NE
    { x: 87.1, y: 4.4 },
    { x: 83.7, y: 3.8 },
    { x: 78.2, y: 3.7 },
    { x: 73.7, y: 3 },
    { x: 69.7, y: 1.9 },
    { x: 61.8, y: 2.2 },
    { x: 56.3, y: 2.4 },
    { x: 52.4, y: 2.1 },
    { x: 49.1, y: 2.6 },
    { x: 43, y: 2.7 },
    // Braewood meets Kluimont around here
    // Then goes around Rimduff Isles to map edge
    { x: 0, y: 0 },
  ],

  // ======================================================================
  // RIMDUFF ISLES - Islands within ocean_north (FORBIDDEN ZONES)
  // Ships travel AROUND these, not through them
  // ======================================================================
  rimduff_isle_nw: {
    // Island 1: x(3.8-20.6), y(4.3-21.4)
    bounds: { minX: 3.8, maxX: 20.6, minY: 4.3, maxY: 21.4 },
    isLand: true, // Ships cannot cross
  },
  
  rimduff_isle_n: {
    // Island 2: x(25.1-27.8), y(1.4-7.9)
    bounds: { minX: 25.1, maxX: 27.8, minY: 1.4, maxY: 7.9 },
    isLand: true,
  },
  
  rimduff_isle_main: {
    // Island 3: x(8.7-39.3), y(11.9-31.6)
    bounds: { minX: 8.7, maxX: 39.3, minY: 11.9, maxY: 31.6 },
    isLand: true,
  },

  // ======================================================================
  // LAVALTO LAKE - Ring of water around volcanic island
  // OUTER boundary = where Braewood/Islefield/Kluimont touch the lake
  // INNER boundary = Lavalto Island (forbidden zone)
  // ======================================================================
  lavalto_lake_outer: [
    // Braewood shore of lake (east side)
    { x: 63.8, y: 48.7 },
    { x: 64.9, y: 52.5 },
    { x: 65.5, y: 58.3 },
    { x: 65.5, y: 61.6 },
    { x: 64.4, y: 64.8 },
    { x: 62.7, y: 68.9 },
    // South transition
    { x: 55, y: 72 },  // Estimate
    { x: 50, y: 71 },  // Estimate
    // Islefield shore of lake (west side)
    { x: 47.9, y: 69.3 },
    { x: 45.8, y: 66 },
    { x: 45.5, y: 63.7 },
    { x: 45.6, y: 59.6 },
    { x: 45.8, y: 56.1 },
    { x: 46.6, y: 52.7 },
    { x: 45.6, y: 48 },
    // Kluimont shore of lake (north side)
    { x: 46, y: 48.6 },
    { x: 46.8, y: 50.1 },
    { x: 48.1, y: 49.5 },
    { x: 49.1, y: 48.5 },
    // Back to Braewood
    { x: 55, y: 47 },  // Estimate
    { x: 60, y: 47.5 }, // Estimate
    { x: 63.8, y: 48.7 },
  ],
  
  lavalto_island: {
    // The volcanic island - FORBIDDEN ZONE
    // Ships must go AROUND this, not through it
    bounds: { minX: 47.7, maxX: 63.7, minY: 48.7, maxY: 68.4 },
    isLand: true,
  },
};

// ======================================================================
// VALID SHIP NODES - Points where ships CAN travel
// Generated from water regions, excluding land
// ======================================================================
const VIABLE_SHIP_NODES = {
  
  // Ocean waypoints - for ship routes
  ocean_east_nodes: [
    { x: 95, y: 20, name: 'ocean_east_1' },
    { x: 95, y: 40, name: 'ocean_east_2' },
    { x: 95, y: 60, name: 'ocean_east_3' },
    { x: 92, y: 75, name: 'ocean_east_4' },
  ],
  
  ocean_south_nodes: [
    { x: 85, y: 85, name: 'ocean_south_1' },
    { x: 70, y: 90, name: 'ocean_south_2' },
    { x: 55, y: 85, name: 'ocean_south_3' },
    { x: 40, y: 90, name: 'ocean_south_4' },
    { x: 25, y: 98, name: 'ocean_south_5' },
  ],
  
  ocean_west_nodes: [
    { x: 5, y: 90, name: 'ocean_west_1' },
    { x: 4, y: 75, name: 'ocean_west_2' },
    { x: 5, y: 60, name: 'ocean_west_3' },
    { x: 7, y: 50, name: 'ocean_west_4' },
  ],
  
  ocean_north_nodes: [
    // Around Rimduff - these must avoid the islands
    { x: 50, y: 2, name: 'ocean_north_1' },
    { x: 70, y: 2, name: 'ocean_north_2' },
    { x: 85, y: 5, name: 'ocean_north_3' },
    // Between islands
    { x: 23, y: 5, name: 'rimduff_channel_1' },  // Between isle_n and isle_nw
    { x: 2, y: 10, name: 'rimduff_west' },       // West of islands
    { x: 42, y: 8, name: 'rimduff_east' },       // East of main isle
  ],
  
  lavalto_lake_nodes: [
    // Ring around the island - going clockwise from north
    { x: 55, y: 47, name: 'lavalto_north' },
    { x: 64, y: 52, name: 'lavalto_ne' },
    { x: 65, y: 60, name: 'lavalto_east' },
    { x: 63, y: 68, name: 'lavalto_se' },
    { x: 52, y: 71, name: 'lavalto_south' },
    { x: 46, y: 65, name: 'lavalto_sw' },
    { x: 45, y: 55, name: 'lavalto_west' },
    { x: 47, y: 49, name: 'lavalto_nw' },
  ],
};

// ======================================================================
// FORBIDDEN ZONES - Land areas ships cannot cross
// ======================================================================
const FORBIDDEN_SHIP_ZONES = [
  // Rimduff Isles
  { name: 'rimduff_isle_nw', minX: 3.8, maxX: 20.6, minY: 4.3, maxY: 21.4 },
  { name: 'rimduff_isle_n', minX: 25.1, maxX: 27.8, minY: 1.4, maxY: 7.9 },
  { name: 'rimduff_isle_main', minX: 8.7, maxX: 39.3, minY: 11.9, maxY: 31.6 },
  
  // Lavalto Island (volcanic)
  { name: 'lavalto_island', minX: 47.7, maxX: 63.7, minY: 48.7, maxY: 68.4 },
  
  // Mainland kingdoms (ships cannot cross land)
  { name: 'kluimont_mainland', minX: 21, maxX: 70.6, minY: 15.9, maxY: 50.1 },
  { name: 'braewood_interior', minX: 43, maxX: 86, minY: 25, maxY: 75 },
  { name: 'islefield_interior', minX: 8, maxX: 45, minY: 50, maxY: 90 },
];

module.exports = { WATER_REGIONS, VIABLE_SHIP_NODES, FORBIDDEN_SHIP_ZONES };
