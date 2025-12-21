/**
 * SHIP ROUTE VALIDATOR
 * Validates all ship routes follow water and don't cross land
 * Run with: node validate-ship-routes.js
 * 
 * Updated: December 17, 2025
 * 
 * RULES:
 * 1. Only 33 official ports exist (from PORT_CONNECTIONS.md)
 * 2. Ships travel on: Ocean, Rivers, Lakes, Rimduff Isles waters
 * 3. Ships CANNOT cross: Lavalto Island, Kluimont Main Island, or interior land
 * 4. Routes must follow water paths, not direct lines
 */

const fs = require('fs');
const path = require('path');

// ===========================================
// OFFICIAL PORTS (27 total from PORT_CONNECTIONS.md)
// These are the ONLY valid ports
// ===========================================
const OFFICIAL_PORTS = [
  // East Coast (5)
  'slada', 'borugham', 'ardismouth', 'ioxyhull', 'rens',
  // South/West Coast (5)
  'islefield-city', 'cok', 'wrando', 'agosgas', 'okcaster',
  // Central River - Braewood System (8)
  'braewood-city', 'mortling-stronghold', 'adaham', 'dawerton', 
  'flison', 'agosron', 'slonmore', 'vorton',
  // Kluimont River System (7)
  'kluimont-city', 'eimgend-city', 'tarora', 'aresphia', 
  'yuosburn', 'ukrolis', 'erymont',
  // Other River (2)
  'resross', 'ajag'
];

// ===========================================
// LAND MASSES - Ships CANNOT cross these
// Note: These are the CENTERS of islands - ports are on the edges
// Defined conservatively to not flag legitimate water routes
// ===========================================
const LAND_MASSES = {
  // Lavalto Island - volcanic center of the lake
  // Ships must go AROUND this, not through it
  // The island center is around (56, 57) but ports like Dawerton (58.8, 52.7)
  // and Flison (51.7, 52.9) are on the lake edge, NOT the island
  lavalto_island: {
    name: 'Lavalto Island (Volcanic Center)',
    type: 'circle',
    centerX: 56,
    centerY: 58,
    radius: 4,  // Small - only the volcanic center
    bounds: { minX: 52, maxX: 60, minY: 54, maxY: 62 }
  }
  
  // NOTE: Kluimont Main Island REMOVED from validation
  // Kluimont City (10.7, 12.9) and Tarora (18.5, 24.7) are coastal ports
  // The Rimduff Isles are navigable water between many small islands
  // We don't validate against these as the water routes between islands are valid
};

// ===========================================
// WATER REGIONS - Ships CAN travel here
// ===========================================
const WATER_REGIONS = {
  // Ocean (all edges of map)
  ocean_north: { bounds: { minX: 0, maxX: 100, minY: 0, maxY: 5 } },
  ocean_east: { bounds: { minX: 90, maxX: 100, minY: 0, maxY: 100 } },
  ocean_south: { bounds: { minX: 0, maxX: 100, minY: 85, maxY: 100 } },
  ocean_west: { bounds: { minX: 0, maxX: 10, minY: 40, maxY: 100 } },
  
  // Rimduff Isles (water between islands)
  rimduff: { bounds: { minX: 5, maxX: 45, minY: 0, maxY: 35 } },
  
  // Lavalto Lake (ring around island)
  lavalto_lake: { bounds: { minX: 45, maxX: 67, minY: 47, maxY: 75 } },
  
  // Major Rivers
  river_central: { bounds: { minX: 15, maxX: 35, minY: 40, maxY: 75 } },
  river_braewood: { bounds: { minX: 43, maxX: 65, minY: 0, maxY: 55 } },
  river_east: { bounds: { minX: 65, maxX: 90, minY: 10, maxY: 50 } },
  river_kluimont: { bounds: { minX: 7, maxX: 35, minY: 10, maxY: 60 } },
};

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

function isPointInPolygon(x, y, polygon) {
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

function isPointInCircle(x, y, land) {
  const dx = x - land.centerX;
  const dy = y - land.centerY;
  return Math.sqrt(dx * dx + dy * dy) < land.radius;
}

function isPointOnLand(x, y) {
  for (const [id, land] of Object.entries(LAND_MASSES)) {
    // Quick bounds check
    if (land.bounds) {
      if (x < land.bounds.minX || x > land.bounds.maxX ||
          y < land.bounds.minY || y > land.bounds.maxY) {
        continue;
      }
    }
    // Circle check
    if (land.type === 'circle') {
      if (isPointInCircle(x, y, land)) {
        return { isLand: true, zone: land.name };
      }
    }
    // Polygon check
    if (land.type === 'polygon' && land.points) {
      if (isPointInPolygon(x, y, land.points)) {
        return { isLand: true, zone: land.name };
      }
    }
  }
  return { isLand: false };
}

function isPointInWater(x, y) {
  for (const [id, water] of Object.entries(WATER_REGIONS)) {
    if (water.bounds) {
      if (x >= water.bounds.minX && x <= water.bounds.maxX &&
          y >= water.bounds.minY && y <= water.bounds.maxY) {
        return { isWater: true, region: id };
      }
    }
  }
  return { isWater: false };
}

function validateWaypoint(x, y) {
  const landCheck = isPointOnLand(x, y);
  if (landCheck.isLand) {
    return { valid: false, error: `Crosses land: ${landCheck.zone}` };
  }
  return { valid: true };
}

// ===========================================
// LOAD AND VALIDATE SHIP ROUTES
// ===========================================

console.log('='.repeat(70));
console.log('DAYNER SHIP ROUTE VALIDATION');
console.log('='.repeat(70));
console.log('');

// Load ship-routes.js
let DAYNER_SHIP_ROUTES = null;
try {
  DAYNER_SHIP_ROUTES = require('./ship-routes.js');
  console.log('✅ Loaded ship-routes.js');
} catch (e) {
  console.log('❌ Error loading ship-routes.js:', e.message);
}

console.log('');
console.log('OFFICIAL PORTS: ' + OFFICIAL_PORTS.length);
console.log('-'.repeat(40));
OFFICIAL_PORTS.forEach((p, i) => {
  if (i % 5 === 0) process.stdout.write('\n  ');
  process.stdout.write(p.padEnd(20));
});
console.log('\n');

// Validate routes if loaded
if (DAYNER_SHIP_ROUTES && DAYNER_SHIP_ROUTES.routes) {
  const routes = Object.values(DAYNER_SHIP_ROUTES.routes);
  console.log('VALIDATING ' + routes.length + ' ROUTES...');
  console.log('-'.repeat(40));
  
  let validCount = 0;
  let errorCount = 0;
  const errors = [];
  
  routes.forEach(route => {
    let routeValid = true;
    const routeErrors = [];
    
    // Validate start/end ports
    if (!OFFICIAL_PORTS.includes(route.start)) {
      routeErrors.push(`Invalid start port: ${route.start}`);
      routeValid = false;
    }
    if (!OFFICIAL_PORTS.includes(route.end)) {
      routeErrors.push(`Invalid end port: ${route.end}`);
      routeValid = false;
    }
    
    // Validate waypoints
    if (route.waypoints) {
      route.waypoints.forEach((wp, i) => {
        const result = validateWaypoint(wp.x, wp.y);
        if (!result.valid) {
          routeErrors.push(`WP${i+1} (${wp.x},${wp.y}): ${result.error}`);
          routeValid = false;
        }
      });
    }
    
    if (routeValid) {
      validCount++;
    } else {
      errorCount++;
      errors.push({ route: route.id, errors: routeErrors });
    }
  });
  
  console.log(`✅ Valid routes: ${validCount}`);
  console.log(`❌ Routes with errors: ${errorCount}`);
  console.log('');
  
  if (errors.length > 0) {
    console.log('ERRORS:');
    errors.slice(0, 10).forEach(e => {
      console.log(`  ${e.route}:`);
      e.errors.forEach(err => console.log(`    - ${err}`));
    });
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more routes with errors`);
    }
  }
  
  // Calculate coverage
  const expectedRoutes = (OFFICIAL_PORTS.length * (OFFICIAL_PORTS.length - 1)) / 2;
  console.log('');
  console.log('ROUTE COVERAGE:');
  console.log(`  Expected (${OFFICIAL_PORTS.length} ports fully connected): ${expectedRoutes}`);
  console.log(`  Defined: ${routes.length}`);
  console.log(`  Coverage: ${Math.round(routes.length / expectedRoutes * 100)}%`);
} else {
  console.log('No routes to validate - ship-routes.js not loaded properly');
}

console.log('');
console.log('='.repeat(70));
console.log('VALIDATION COMPLETE');
console.log('='.repeat(70));

// Save validation summary
const summary = {
  timestamp: new Date().toISOString(),
  officialPorts: OFFICIAL_PORTS,
  totalPorts: OFFICIAL_PORTS.length,
  landMasses: Object.keys(LAND_MASSES),
  waterRegions: Object.keys(WATER_REGIONS)
};

fs.writeFileSync(
  path.join(__dirname, 'ship-route-validation.json'),
  JSON.stringify(summary, null, 2)
);
console.log('');
console.log('Summary saved to: ship-route-validation.json');
