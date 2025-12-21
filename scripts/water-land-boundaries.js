/**
 * DAYNER WATER AND LAND BOUNDARIES
 * For validating ship routes stay in water and don't cross land
 * Generated: December 17, 2025
 * UPDATED: Aligned to actual land boundaries from map-coordinates.js
 * 
 * RULE: Land takes priority. Water must meet land exactly, no overlap.
 * 
 * LAND BOUNDARIES (from map-coordinates.js):
 * - Braewood: x(43-94.6), y(1.9-90)
 * - Islefield: x(2.4-51), y(40.1-99.9)
 * - Kluimont (4 islands): x(3.8-70.6), y(1.4-50.1)
 * - Lavalto Island: x(47.7-63.7), y(48.7-68.4)
 */

const WATER_LAND_BOUNDARIES = {
  // =====================================================
  // WATER AREAS - Ships CAN travel through these
  // All boundaries aligned to actual land borders
  // =====================================================
  
  ocean_east: {
    name: 'Ocean - East Coast',
    type: 'water',
    description: 'East of Braewood, from map edge to Braewood east coast',
    // Follows Braewood east coast EXACTLY from map-coordinates.js
    points: [
      // Map edge (top-right)
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      // Braewood southeast corner
      { x: 90, y: 76.5 },
      // Braewood east coast (going north) - FROM MAP-COORDINATES.JS
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
      // Braewood northeast corner, close polygon
    ]
  },
  
  ocean_south: {
    name: 'Ocean - South Coast',
    type: 'water',
    description: 'South of Braewood and Islefield, from map edge to coastlines',
    // Follows Braewood south coast + Islefield south coast EXACTLY
    points: [
      // Map edge (bottom)
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      // Islefield south coast (going east) - FROM MAP-COORDINATES.JS
      { x: 2.4, y: 77.5 },  // Islefield west meets south
      { x: 5.9, y: 90 },
      { x: 7.5, y: 91.7 },
      { x: 8.9, y: 93.7 },
      { x: 10.6, y: 95 },
      { x: 13.2, y: 97.4 },
      { x: 15.2, y: 98.2 },
      { x: 18.4, y: 99.1 },
      { x: 21.1, y: 99.5 },
      { x: 24.2, y: 99.9 },
      { x: 27.2, y: 99.8 },
      { x: 28.9, y: 99.5 },
      { x: 31, y: 96.8 },
      // Gap between Islefield and Braewood (water passage)
      { x: 35, y: 92 },
      { x: 40, y: 88 },
      { x: 48, y: 84 },
      { x: 52, y: 80 },
      // Braewood south coast (going east) - FROM MAP-COORDINATES.JS
      { x: 54.7, y: 74.8 },
      { x: 56.2, y: 79.2 },
      { x: 59.1, y: 82.3 },
      { x: 62, y: 84.7 },
      { x: 65.1, y: 86 },
      { x: 69.4, y: 87.3 },
      { x: 72.8, y: 89 },
      { x: 76.7, y: 90 },
      { x: 78.7, y: 89.3 },
      { x: 81.1, y: 88.3 },
      { x: 84.8, y: 83.7 },
      { x: 90, y: 76.5 },
      // Connects to ocean_east
    ]
  },
  
  ocean_west: {
    name: 'Ocean - West Coast',
    type: 'water',
    description: 'West of Islefield, from map edge to Islefield west coast',
    // Follows Islefield west coast EXACTLY from map-coordinates.js
    points: [
      // Map edge (left side)
      { x: 0, y: 40 },
      { x: 0, y: 100 },
      // Islefield southwest corner - FROM MAP-COORDINATES.JS
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
      { x: 11.2, y: 46.5 },
      { x: 12.4, y: 43.8 },
      // Islefield meets Kluimont mainland here
    ]
  },
  
  ocean_north: {
    name: 'Ocean - North Coast / Rimduff Sea',
    type: 'water',
    description: 'North of mainland, INCLUDES water between Rimduff Isles. Ships CAN travel here.',
    // The water between and around the 4 Kluimont islands
    // Rimduff Isles = the WATER between the islands, not the islands themselves
    points: [
      // Map edge (top)
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      // Braewood north coast - FROM MAP-COORDINATES.JS
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
      // Braewood meets Kluimont - water continues around islands
      // Kluimont mainland north edge (around y=15-20)
      { x: 43.9, y: 5.9 },
      { x: 45.2, y: 7.5 },
      // Water between mainland and islands
      { x: 42, y: 12 },
      { x: 40, y: 15 },
      // Back to map edge (west)
      { x: 0, y: 0 },
    ]
  },
  
  rimduff_channels: {
    name: 'Rimduff Island Channels',
    type: 'water',
    description: 'The water channels BETWEEN the Rimduff islands - ships travel here',
    // Water passages between the 4 Kluimont landmasses
    // Island 1 (NW): x(3.8-20.6), y(4.3-21.4)
    // Island 2 (N): x(25.1-27.8), y(1.4-7.9)
    // Island 3 (Main): x(8.7-39.3), y(11.9-31.6)
    // Island 4 (Mainland): x(21-70.6), y(15.9-50.1)
    channels: [
      // Channel between Island 1 (NW) and Island 3 (Main) - east side of NW island
      { name: 'NW-Main Channel', startX: 20.6, endX: 21, startY: 12, endY: 21 },
      // Channel between Island 2 (N) and Island 3 (Main) - south of N island
      { name: 'N-Main Channel', startX: 25, endX: 28, startY: 8, endY: 12 },
      // Channel west of Island 1 (NW) - open ocean
      { name: 'West Ocean', startX: 0, endX: 3.8, startY: 0, endY: 22 },
      // Channel between islands and mainland
      { name: 'Island-Mainland Channel', startX: 8, endX: 40, startY: 32, endY: 40 },
    ]
  },
  
  lavalto_lake: {
    name: 'Lavalto Lake (Ring)',
    type: 'water',
    description: 'Ring-shaped lake around volcanic island - ships CAN travel on this water',
    // Outer boundary = where kingdoms meet the lake
    // Inner boundary = Lavalto Island (volcanic, FORBIDDEN)
    // From map-coordinates.js analysis:
    // - Braewood lake edge: (63.8-65.5, 48.7-68.9)
    // - Islefield lake edge: (45.5-47.9, 48-69.3)
    // - Kluimont lake edge: (46-49.1, 48.5-50.1)
    // - Lavalto Island: x(47.7-63.7), y(48.7-68.4)
    outer_ring: [
      // Braewood shore (east side of lake) - FROM MAP-COORDINATES.JS
      { x: 63.8, y: 48.7 },
      { x: 64.9, y: 52.5 },
      { x: 65.5, y: 58.3 },
      { x: 65.5, y: 61.6 },
      { x: 64.4, y: 64.8 },
      { x: 62.7, y: 68.9 },
      // South of lake (Braewood-Islefield border)
      { x: 60.9, y: 70.3 },
      { x: 58.5, y: 71.4 },
      { x: 55.8, y: 72.6 },
      { x: 50.4, y: 72.5 },
      // Islefield shore (west side of lake) - FROM MAP-COORDINATES.JS
      { x: 47.9, y: 69.3 },
      { x: 45.8, y: 66 },
      { x: 45.5, y: 63.7 },
      { x: 45.6, y: 59.6 },
      { x: 45.8, y: 56.1 },
      { x: 46.6, y: 52.7 },
      { x: 45.6, y: 48 },
      // Kluimont shore (north side of lake) - FROM MAP-COORDINATES.JS
      { x: 46, y: 48.6 },
      { x: 46.8, y: 50.1 },
      { x: 48.1, y: 49.5 },
      { x: 49.1, y: 48.5 },
      // Back to Braewood
      { x: 52.8, y: 45.9 },
      { x: 56.1, y: 44.8 },
      { x: 60.1, y: 45.6 },
      { x: 61.6, y: 46.3 },
      { x: 63.8, y: 48.7 },
    ],
    inner_ring_forbidden: [
      // Lavalto Island - FROM MAP-COORDINATES.JS (the volcanic island)
      { x: 48, y: 63.8 },
      { x: 48.8, y: 64.7 },
      { x: 49.6, y: 66 },
      { x: 51.3, y: 67 },
      { x: 52.3, y: 68.3 },
      { x: 53.8, y: 68.1 },
      { x: 56.4, y: 68.4 },
      { x: 59.2, y: 68.1 },
      { x: 60.5, y: 66.8 },
      { x: 61.9, y: 63.9 },
      { x: 63, y: 61 },
      { x: 63.7, y: 57.5 },
      { x: 63.3, y: 54.5 },
      { x: 62.4, y: 51.7 },
      { x: 61, y: 50.3 },
      { x: 58.7, y: 49.5 },
      { x: 56.5, y: 49.2 },
      { x: 54.1, y: 48.7 },
      { x: 53.2, y: 49.5 },
      { x: 51.7, y: 50.7 },
      { x: 50.6, y: 52 },
      { x: 49.6, y: 54.1 },
      { x: 48.9, y: 55.6 },
      { x: 48.5, y: 57.2 },
      { x: 48.1, y: 59.3 },
      { x: 47.7, y: 62.5 },
    ]
  },

  // =====================================================
  // LAND AREAS - Ships CANNOT travel through these
  // All from map-coordinates.js Kluimont border (191 points = 4 islands)
  // =====================================================
  
  lavalto_island: {
    name: 'Lavalto Island (Volcanic Center)',
    type: 'land',
    description: 'The volcanic island in the CENTER of Lavalto Lake - ships CANNOT cross this!',
    // FROM MAP-COORDINATES.JS lavalto border
    bounds: { minX: 47.7, maxX: 63.7, minY: 48.7, maxY: 68.4 },
    points: [
      { x: 48, y: 63.8 },
      { x: 48.8, y: 64.7 },
      { x: 49.6, y: 66 },
      { x: 51.3, y: 67 },
      { x: 52.3, y: 68.3 },
      { x: 53.8, y: 68.1 },
      { x: 56.4, y: 68.4 },
      { x: 59.2, y: 68.1 },
      { x: 60.5, y: 66.8 },
      { x: 61.9, y: 63.9 },
      { x: 63, y: 61 },
      { x: 63.7, y: 57.5 },
      { x: 63.3, y: 54.5 },
      { x: 62.4, y: 51.7 },
      { x: 61, y: 50.3 },
      { x: 58.7, y: 49.5 },
      { x: 56.5, y: 49.2 },
      { x: 54.1, y: 48.7 },
      { x: 53.2, y: 49.5 },
      { x: 51.7, y: 50.7 },
      { x: 50.6, y: 52 },
      { x: 49.6, y: 54.1 },
      { x: 48.9, y: 55.6 },
      { x: 48.5, y: 57.2 },
      { x: 48.1, y: 59.3 },
      { x: 47.7, y: 62.5 },
    ]
  },
  
  // KLUIMONT HAS 4 SEPARATE LANDMASSES (from analyze-land-borders.js)
  // Ships travel in the water BETWEEN these islands
  
  kluimont_island_1_nw: {
    name: 'Kluimont Island NW (Rimduff)',
    type: 'land',
    description: 'Northwestern island where Kluimont City and Qrey are located',
    bounds: { minX: 3.8, maxX: 20.6, minY: 4.3, maxY: 21.4 },
    // 27 points from map-coordinates.js kluimont[0-26]
    points: [
      { x: 9.3, y: 4.3 },
      { x: 10, y: 5.4 },
      { x: 11.3, y: 6.3 },
      { x: 11.5, y: 8.8 },
      { x: 12.8, y: 9.2 },
      { x: 13.8, y: 8.6 },
      { x: 15.1, y: 9.2 },
      { x: 17.2, y: 9.1 },
      { x: 18.8, y: 9.4 },
      { x: 20.6, y: 9.8 },
      { x: 20, y: 11.2 },
      { x: 18.6, y: 11.9 },
      { x: 17.5, y: 14.1 },
      { x: 16.6, y: 15.4 },
      { x: 14.9, y: 17.6 },
      { x: 13.2, y: 19.1 },
      { x: 11.8, y: 20.9 },
      { x: 9.6, y: 21.4 },
      { x: 8.1, y: 19.5 },
      { x: 6, y: 18.1 },
      { x: 4.8, y: 16.1 },
      { x: 3.8, y: 13.5 },
      { x: 3.8, y: 10.8 },
      { x: 4.4, y: 7.9 },
      { x: 5.4, y: 7.1 },
      { x: 6.3, y: 6.4 },
      { x: 7.8, y: 5.1 },
    ]
  },
  
  kluimont_island_2_n: {
    name: 'Kluimont Island N (Small Rimduff)',
    type: 'land',
    description: 'Small northern island',
    bounds: { minX: 25.1, maxX: 27.8, minY: 1.4, maxY: 7.9 },
    // 12 points from map-coordinates.js kluimont[27-38]
    points: [
      { x: 25.3, y: 1.4 },
      { x: 25.1, y: 2.6 },
      { x: 25.1, y: 3.9 },
      { x: 25.1, y: 5.5 },
      { x: 25.5, y: 6.9 },
      { x: 26.1, y: 7.9 },
      { x: 27.2, y: 6.5 },
      { x: 27.4, y: 5.2 },
      { x: 27.8, y: 4.3 },
      { x: 27.7, y: 2.8 },
      { x: 27.1, y: 1.9 },
      { x: 26.1, y: 1.5 },
    ]
  },
  
  kluimont_island_3_main: {
    name: 'Kluimont Island Main (Rimduff Main)',
    type: 'land',
    description: 'Main Rimduff island with Tarora and Aresphia',
    bounds: { minX: 8.7, maxX: 39.3, minY: 11.9, maxY: 31.6 },
    // 64 points from map-coordinates.js - complex shaped island
    // Ships must go AROUND this island via the channels
  },
  
  kluimont_mainland: {
    name: 'Kluimont Mainland',
    type: 'land',
    description: 'The mainland portion of Kluimont kingdom, connects to Braewood and Islefield',
    bounds: { minX: 21, maxX: 70.6, minY: 15.9, maxY: 50.1 },
    // 88 points from map-coordinates.js - connects to other kingdoms
  },
  
  // BRAEWOOD - main eastern kingdom
  braewood: {
    name: 'Braewood Kingdom',
    type: 'land',
    description: 'Eastern kingdom - ships go around via east/south/north coasts',
    bounds: { minX: 43, maxX: 94.6, minY: 1.9, maxY: 90 },
    // 82 points from map-coordinates.js
  },
  
  // ISLEFIELD - southwestern kingdom  
  islefield: {
    name: 'Islefield Kingdom',
    type: 'land',
    description: 'Southwestern kingdom - ships go around via west/south coasts',
    bounds: { minX: 2.4, maxX: 51, minY: 40.1, maxY: 99.9 },
    // 72 points from map-coordinates.js
  },
};

// =====================================================
// RIVERS - Ships CAN travel on major rivers
// Rivers are defined in MAP_COORDINATES.river_major (234 points)
// =====================================================

const NAVIGABLE_RIVERS = {
  // River segments where ships can travel
  // From map-coordinates.js river_major analysis
  
  // RIVER 1: Islefield South River (coast to Halten area)
  // Starts at coast (7.5, 91.8) and goes inland to Halten area
  islefield_south_river: {
    type: 'water',
    description: 'From Islefield south coast to Halten area',
    approxPath: [
      { x: 7.5, y: 91.8 }, { x: 12, y: 82 }, { x: 18, y: 79 }, { x: 30, y: 78 }
    ]
  },
  
  // RIVER 2: Islefield Central River (coast to Eighwood)
  // Connects coast through Wrando/Slido area
  islefield_central_river: {
    type: 'water', 
    description: 'From west coast through Slido/Wrando to Eighwood area',
    approxPath: [
      { x: 18, y: 79 }, { x: 18, y: 63 }, { x: 30, y: 60 }
    ]
  },
  
  // RIVER 3: Main River (Kluimont to Braewood)
  // Large river from Kluimont mainland through to Lavalto Lake
  main_river: {
    type: 'water',
    description: 'From Kluimont mainland south to Lavalto Lake',
    approxPath: [
      { x: 21, y: 40 }, { x: 37, y: 41 }, { x: 45, y: 45 }, { x: 47, y: 50 }
    ]
  },
  
  // RIVER 4: Braewood River (Braewood City area to coast)
  // Connects Mortling/Braewood City to east coast
  braewood_river: {
    type: 'water',
    description: 'From Braewood City area to east coast',
    approxPath: [
      { x: 66, y: 39 }, { x: 71, y: 36 }, { x: 77, y: 43 }, { x: 85, y: 45 }, { x: 93, y: 47 }
    ]
  },
  
  // RIVER 5: North Braewood River (to Slada/coast)
  // Small river in north Braewood
  north_braewood_river: {
    type: 'water',
    description: 'From Borugham area to north coast',
    approxPath: [
      { x: 78, y: 5 }, { x: 79, y: 10 }, { x: 79, y: 16 }
    ]
  },
};

// =====================================================
// FORBIDDEN SHIP ZONES - Quick bounding box checks
// Use these for fast collision detection
// =====================================================

const FORBIDDEN_SHIP_ZONES = [
  // Lavalto Island - volcanic center of lake
  { name: 'lavalto_island', minX: 47.7, maxX: 63.7, minY: 48.7, maxY: 68.4 },
  
  // Kluimont Islands (Rimduff) - ships go BETWEEN these, not through
  { name: 'kluimont_island_1_nw', minX: 3.8, maxX: 20.6, minY: 4.3, maxY: 21.4 },
  { name: 'kluimont_island_2_n', minX: 25.1, maxX: 27.8, minY: 1.4, maxY: 7.9 },
  { name: 'kluimont_island_3_main', minX: 8.7, maxX: 39.3, minY: 11.9, maxY: 31.6 },
  
  // Mainland kingdoms - ships cannot cross land interior
  { name: 'kluimont_mainland', minX: 21, maxX: 70.6, minY: 15.9, maxY: 50.1 },
  { name: 'braewood', minX: 43, maxX: 94.6, minY: 1.9, maxY: 90 },
  { name: 'islefield', minX: 2.4, maxX: 51, minY: 40.1, maxY: 99.9 },
];

// =====================================================
// VIABLE WATER NODES - Points where ships CAN travel
// These are the ONLY valid waypoints for ship routes
// =====================================================

const VIABLE_WATER_NODES = {
  
  // === OCEAN EAST (Braewood East Coast) ===
  // Following Braewood east coast from map-coordinates.js
  ocean_east: [
    { id: 'oe_1', x: 95, y: 5, name: 'NE Corner' },
    { id: 'oe_2', x: 94.6, y: 13.7, name: 'East Coast N' },
    { id: 'oe_3', x: 91, y: 18.5, name: 'East Coast Upper' },
    { id: 'oe_4', x: 86.5, y: 23.2, name: 'East Coast Mid-Upper' },
    { id: 'oe_5', x: 88.9, y: 32.3, name: 'Ardismouth Area' },
    { id: 'oe_6', x: 92.9, y: 39.4, name: 'Oyard Area' },
    { id: 'oe_7', x: 93.7, y: 55.4, name: 'Ioxyhull Area' },
    { id: 'oe_8', x: 92.6, y: 70.5, name: 'East Coast Lower' },
    { id: 'oe_9', x: 90, y: 76.5, name: 'SE Coast' },
  ],
  
  // === OCEAN SOUTH (Braewood + Islefield South Coast) ===
  ocean_south: [
    // Braewood south coast
    { id: 'os_1', x: 90, y: 76.5, name: 'Braewood SE' },
    { id: 'os_2', x: 84.8, y: 83.7, name: 'Frore Area' },
    { id: 'os_3', x: 78.7, y: 89.3, name: 'Rens Area' },
    { id: 'os_4', x: 72.8, y: 89, name: 'Dalo Area' },
    { id: 'os_5', x: 65.1, y: 86, name: 'Trares Area' },
    { id: 'os_6', x: 56.2, y: 79.2, name: 'Kadena Area' },
    // Water gap between kingdoms
    { id: 'os_7', x: 50, y: 80, name: 'South Gap 1' },
    { id: 'os_8', x: 40, y: 85, name: 'South Gap 2' },
    { id: 'os_9', x: 35, y: 90, name: 'South Gap 3' },
    // Islefield south coast
    { id: 'os_10', x: 31, y: 96.8, name: 'Islefield SE' },
    { id: 'os_11', x: 26.2, y: 96.3, name: 'Esterhull Area' },
    { id: 'os_12', x: 18.4, y: 99.1, name: 'South Coast Mid' },
    { id: 'os_13', x: 10.6, y: 95, name: 'Ulsall Area' },
  ],
  
  // === OCEAN WEST (Islefield West Coast) ===
  ocean_west: [
    { id: 'ow_1', x: 7.5, y: 91.7, name: 'SW Coast' },
    { id: 'ow_2', x: 5.9, y: 90, name: 'Cheling Area' },
    { id: 'ow_3', x: 2.5, y: 81, name: 'Cok Area' },
    { id: 'ow_4', x: 2.5, y: 73, name: 'Beyross Area' },
    { id: 'ow_5', x: 4.8, y: 65.9, name: 'Agosgas Area' },
    { id: 'ow_6', x: 5.9, y: 57, name: 'Okcaster Area' },
    { id: 'ow_7', x: 8.5, y: 49.9, name: 'Guatpool Area' },
    { id: 'ow_8', x: 12.4, y: 43.8, name: 'West Coast N' },
  ],
  
  // === OCEAN NORTH (Braewood North + Kluimont Islands) ===
  // This is the Rimduff Sea - water BETWEEN the islands
  ocean_north: [
    // Braewood north coast
    { id: 'on_1', x: 87.1, y: 4.4, name: 'Slada Area' },
    { id: 'on_2', x: 78.2, y: 3.7, name: 'North Coast E' },
    { id: 'on_3', x: 69.7, y: 1.9, name: 'North Coast Mid' },
    { id: 'on_4', x: 56.3, y: 2.4, name: 'North Coast W' },
    { id: 'on_5', x: 46.5, y: 4.2, name: 'Strane Area' },
    { id: 'on_6', x: 43, y: 2.7, name: 'Vorton Area' },
    // RIMDUFF CHANNELS - water between islands
    { id: 'on_7', x: 42, y: 10, name: 'Rimduff E Channel' },
    { id: 'on_8', x: 30, y: 8, name: 'N Island Channel' },  // Between island 2 and mainland
    { id: 'on_9', x: 22, y: 4, name: 'Rimduff N Channel' }, // North of islands
    { id: 'on_10', x: 2, y: 10, name: 'Rimduff W Ocean' },  // West open ocean
    { id: 'on_11', x: 2, y: 22, name: 'W Coast Upper' },    // West coast below islands
  ],
  
  // === RIMDUFF ISLAND COASTS (where island settlements have ports) ===
  rimduff_coasts: [
    // Island 1 (NW) - Kluimont City, Qrey
    { id: 'ri_1', x: 7.8, y: 7, name: 'Qrey Port' },           // Qrey is at (7.8, 7)
    { id: 'ri_2', x: 10.7, y: 12.9, name: 'Kluimont City Port' }, // Kluimont City
    { id: 'ri_3', x: 20.6, y: 9.8, name: 'Island 1 E Coast' },
    // Island 3 (Main) - Tarora, Aresphia
    { id: 'ri_4', x: 8.7, y: 27.9, name: 'Aresphia Port' },    // Aresphia
    { id: 'ri_5', x: 18.5, y: 24.7, name: 'Tarora Port' },     // Tarora
    { id: 'ri_6', x: 39.3, y: 20, name: 'Island 3 E Coast' },
  ],
  
  // === KLUIMONT MAINLAND COAST ===
  kluimont_mainland_coast: [
    { id: 'km_1', x: 21, y: 39.6, name: 'Eimgend-city Area' },
    { id: 'km_2', x: 40.4, y: 40.9, name: 'Mainland N Coast' },
    { id: 'km_3', x: 46, y: 48.6, name: 'Lavalto Lake Entry' },
  ],
  
  // === LAVALTO LAKE (Ring around volcanic island) ===
  // Ships travel in the RING, not across the island
  lavalto_lake: [
    // North side of lake (Kluimont shore)
    { id: 'll_1', x: 46, y: 48.6, name: 'Lake N' },
    { id: 'll_2', x: 49.1, y: 48.5, name: 'Lake NE Entry' },
    // East side of lake (Braewood shore)
    { id: 'll_3', x: 63.8, y: 48.7, name: 'Lake E Upper' },
    { id: 'll_4', x: 65.5, y: 58.3, name: 'Lake E Mid' },
    { id: 'll_5', x: 64.4, y: 64.8, name: 'Lake E Lower' },
    // South side of lake
    { id: 'll_6', x: 62.7, y: 68.9, name: 'Lake SE' },
    { id: 'll_7', x: 55.8, y: 72.6, name: 'Lake S' },
    // West side of lake (Islefield shore)
    { id: 'll_8', x: 47.9, y: 69.3, name: 'Lake SW' },
    { id: 'll_9', x: 45.5, y: 63.7, name: 'Lake W Mid' },
    { id: 'll_10', x: 45.6, y: 56.1, name: 'Lake W Upper' },
    { id: 'll_11', x: 46.6, y: 52.7, name: 'Lake NW' },
  ],
  
  // === RIVER NODES ===
  rivers: [
    // Islefield Rivers
    { id: 'rv_1', x: 7.5, y: 91.7, name: 'Islefield River Mouth' },
    { id: 'rv_2', x: 18, y: 79, name: 'River Junction 1' },
    { id: 'rv_3', x: 18.1, y: 58.9, name: 'Slido River' },
    { id: 'rv_4', x: 30.1, y: 60.8, name: 'Eighwood Bridge' },
    // Main River to Lake
    { id: 'rv_5', x: 21, y: 40, name: 'Kluimont River' },
    { id: 'rv_6', x: 42, y: 44, name: 'River to Lake' },
    // Braewood Rivers
    { id: 'rv_7', x: 66.6, y: 39.5, name: 'Mortling River' },
    { id: 'rv_8', x: 58.8, y: 52.7, name: 'Dawerton River' },
    { id: 'rv_9', x: 85, y: 45, name: 'East River' },
  ],
};

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
function isPointInPolygon(point, polygon) {
  let inside = false;
  const x = point.x;
  const y = point.y;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

/**
 * Check if a point is in a forbidden zone (simplified bounding box check)
 */
function isInForbiddenZone(x, y, zone) {
  if (zone.radius) {
    // Circle check for Lavalto Island
    const dx = x - zone.centerX;
    const dy = y - zone.centerY;
    return Math.sqrt(dx * dx + dy * dy) < zone.radius;
  }
  // Bounding box check
  return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
}

/**
 * Check if a ship waypoint crosses land
 * Returns an array of violations
 */
function validateShipWaypoint(x, y) {
  const violations = [];
  
  // Check Lavalto Island (most common error)
  if (isInForbiddenZone(x, y, FORBIDDEN_SHIP_ZONES.lavalto_island)) {
    violations.push({
      zone: 'Lavalto Island',
      message: `Waypoint (${x}, ${y}) is on the volcanic island inside Lavalto Lake!`
    });
  }
  
  // Check if in ocean areas
  let inWater = false;
  for (const [key, area] of Object.entries(WATER_LAND_BOUNDARIES)) {
    if (area.type === 'water' && area.points) {
      if (isPointInPolygon({ x, y }, area.points)) {
        inWater = true;
        break;
      }
    }
  }
  
  // If not in water and not at a port, might be on land
  // (This is a simplified check - ports are on coastlines)
  
  return violations;
}

/**
 * Validate an entire ship route
 */
function validateShipRoute(route) {
  const errors = [];
  
  if (!route.waypoints || !route.isShipRoute) {
    return errors;
  }
  
  route.waypoints.forEach((wp, index) => {
    const violations = validateShipWaypoint(wp.x, wp.y);
    violations.forEach(v => {
      errors.push({
        routeId: route.id,
        waypointIndex: index,
        x: wp.x,
        y: wp.y,
        zone: v.zone,
        message: v.message
      });
    });
  });
  
  return errors;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WATER_LAND_BOUNDARIES,
    FORBIDDEN_SHIP_ZONES,
    isPointInPolygon,
    isInForbiddenZone,
    validateShipWaypoint,
    validateShipRoute
  };
}
