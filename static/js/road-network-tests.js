/**
 * ROAD NETWORK PATHFINDING TESTS
 * Tests for travel time calculations, route options, and ship routes
 * Run in browser console after loading road-network.js
 */

const ROAD_NETWORK_TESTS = {
  results: [],
  passed: 0,
  failed: 0,

  // Test assertion helper
  assert: function(condition, testName, details = '') {
    if (condition) {
      this.passed++;
      this.results.push({ status: 'PASS', name: testName });
      console.log(`✅ PASS: ${testName}`);
    } else {
      this.failed++;
      this.results.push({ status: 'FAIL', name: testName, details });
      console.error(`❌ FAIL: ${testName}`, details);
    }
  },

  // Run all tests
  runAll: function() {
    console.log('=== ROAD NETWORK TESTS ===\n');
    this.results = [];
    this.passed = 0;
    this.failed = 0;

    this.testTravelSpeeds();
    this.testBasicPathfinding();
    this.testTravelModes();
    this.testPaceOptions();
    this.testShipRoutes();
    this.testCompareRoutes();
    this.testEdgeCases();
    this.testSeaOnlyLandlocked();
    this.testDirectShipRoutes();

    console.log('\n=== TEST SUMMARY ===');
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);
    
    return { passed: this.passed, failed: this.failed, results: this.results };
  },

  // Test that travel speeds are defined correctly
  testTravelSpeeds: function() {
    console.log('\n--- Travel Speed Tests ---');
    
    const speeds = ROAD_NETWORK.TRAVEL_SPEEDS;
    
    this.assert(speeds !== undefined, 'TRAVEL_SPEEDS exists');
    this.assert(speeds.road !== undefined, 'Road speeds defined');
    this.assert(speeds.ship !== undefined, 'Ship speeds defined');
    
    // Road speeds
    this.assert(speeds.road.slow === 20, 'Road slow speed = 20 km/day');
    this.assert(speeds.road.normal === 30, 'Road normal speed = 30 km/day');
    this.assert(speeds.road.fast === 40, 'Road fast speed = 40 km/day');
    
    // Ship speeds
    this.assert(speeds.ship.slow === 40, 'Ship slow speed = 40 km/day');
    this.assert(speeds.ship.normal === 50, 'Ship normal speed = 50 km/day');
    this.assert(speeds.ship.fast === 70, 'Ship fast speed = 70 km/day');
    
    // Ships should always be faster than walking
    this.assert(speeds.ship.slow >= speeds.road.normal, 'Slow ship >= normal walking');
    this.assert(speeds.ship.normal > speeds.road.fast, 'Normal ship > fast walking');
  },

  // Test basic pathfinding works
  testBasicPathfinding: function() {
    console.log('\n--- Basic Pathfinding Tests ---');
    
    // Test a simple land route exists
    const route1 = ROAD_NETWORK.findPath('braewood-city', 'mortling-stronghold');
    this.assert(route1 !== null, 'Braewood to Mortling path exists');
    this.assert(route1.distance > 0, 'Path has positive distance');
    this.assert(route1.travelTime > 0, 'Path has positive travel time');
    this.assert(route1.path.length >= 2, 'Path has at least 2 nodes');
    this.assert(route1.path[0] === 'braewood-city', 'Path starts correctly');
    this.assert(route1.path[route1.path.length - 1] === 'mortling-stronghold', 'Path ends correctly');
    
    // Test distance helper
    const dist = ROAD_NETWORK.getDistance('braewood-city', 'mortling-stronghold');
    this.assert(dist === route1.distance, 'getDistance matches findPath distance');
    
    // Test travel time helper
    const time = ROAD_NETWORK.getTravelTime('braewood-city', 'mortling-stronghold');
    this.assert(time === route1.travelTime, 'getTravelTime matches findPath travelTime');
  },

  // Test land-only and sea-only modes
  testTravelModes: function() {
    console.log('\n--- Travel Mode Tests ---');
    
    // Test route between two coastal cities
    // Slada to Islefield should have both land and sea options
    const landOnly = ROAD_NETWORK.findPath('slada', 'islefield-city', { mode: 'land-only' });
    const seaOnly = ROAD_NETWORK.findPath('slada', 'islefield-city', { mode: 'sea-only' });
    const any = ROAD_NETWORK.findPath('slada', 'islefield-city', { mode: 'any' });
    
    this.assert(landOnly !== null, 'Slada to Islefield has land route');
    this.assert(seaOnly !== null, 'Slada to Islefield has sea route');
    this.assert(any !== null, 'Slada to Islefield has mixed route');
    
    // Sea route should have ship route IDs
    if (seaOnly) {
      const hasShipRoute = seaOnly.roadIds.some(id => 
        typeof id === 'string' && id.startsWith('ship-')
      );
      this.assert(hasShipRoute, 'Sea-only route uses ship routes');
    }
    
    // Land route should NOT have ship route IDs
    if (landOnly) {
      const hasShipRoute = landOnly.roadIds.some(id => 
        typeof id === 'string' && id.startsWith('ship-')
      );
      this.assert(!hasShipRoute, 'Land-only route has no ship routes');
    }
    
    // Test landlocked to landlocked in sea-only (should now work via nearest ports)
    const inlandRoute = ROAD_NETWORK.findPath('phine', 'sord', { mode: 'sea-only' });
    this.assert(inlandRoute !== null, 'Landlocked sea-only now finds route via ports');
  },

  // Test different pace options affect travel time
  testPaceOptions: function() {
    console.log('\n--- Pace Options Tests ---');
    
    // Same route with different paces
    const slow = ROAD_NETWORK.findPath('braewood-city', 'eaveton', { roadPace: 'slow' });
    const normal = ROAD_NETWORK.findPath('braewood-city', 'eaveton', { roadPace: 'normal' });
    const fast = ROAD_NETWORK.findPath('braewood-city', 'eaveton', { roadPace: 'fast' });
    
    this.assert(slow !== null && normal !== null && fast !== null, 'All pace routes exist');
    
    if (slow && normal && fast) {
      // Slow should take longer than normal, normal longer than fast
      this.assert(slow.travelTime > normal.travelTime, 'Slow pace takes longer than normal');
      this.assert(normal.travelTime > fast.travelTime, 'Normal pace takes longer than fast');
      
      // Distance should be the same regardless of pace
      this.assert(slow.distance === normal.distance, 'Distance same for slow vs normal');
      this.assert(normal.distance === fast.distance, 'Distance same for normal vs fast');
      
      // Verify math: slow (20 km/day) should take 1.5x normal (30 km/day)
      const ratio = slow.travelTime / normal.travelTime;
      this.assert(Math.abs(ratio - 1.5) < 0.1, 'Slow is ~1.5x normal time (20 vs 30 km/day)');
    }
    
    // Test ship pace options
    const slowShip = ROAD_NETWORK.findPath('slada', 'ioxyhull', { mode: 'sea-only', shipPace: 'slow' });
    const fastShip = ROAD_NETWORK.findPath('slada', 'ioxyhull', { mode: 'sea-only', shipPace: 'fast' });
    
    if (slowShip && fastShip) {
      this.assert(slowShip.travelTime > fastShip.travelTime, 'Slow ship takes longer than fast ship');
      this.assert(slowShip.distance === fastShip.distance, 'Ship distance same regardless of pace');
    }
  },

  // Test ship route specific functionality
  testShipRoutes: function() {
    console.log('\n--- Ship Route Tests ---');
    
    // Verify Mortling to Dawerton ship route (user's example: 129km = 1.5 days at 86 km/day)
    // With new speeds: 129km at 50 km/day = 2.58 days
    const mortlingDawerton = ROAD_NETWORK.findPath('mortling-stronghold', 'dawerton', { mode: 'sea-only' });
    this.assert(mortlingDawerton !== null, 'Mortling-Dawerton ship route exists');
    
    if (mortlingDawerton) {
      this.assert(mortlingDawerton.distance === 129, 'Mortling-Dawerton is 129 km');
      // At normal ship speed (50 km/day): 129/50 = 2.58 days
      const expectedTime = 129 / 50;
      this.assert(
        Math.abs(mortlingDawerton.travelTime - expectedTime) < 0.1,
        `Mortling-Dawerton takes ~${expectedTime.toFixed(1)} days at normal ship speed`
      );
    }
    
    // Test that ship routes have waypoints
    const shipRoute = ROAD_NETWORK.roads.find(r => r.id === 'ship-mortling-dawerton');
    this.assert(shipRoute !== undefined, 'Ship route object exists');
    if (shipRoute) {
      this.assert(shipRoute.isShipRoute === true, 'Ship route has isShipRoute flag');
      this.assert(Array.isArray(shipRoute.waypoints), 'Ship route has waypoints array');
      this.assert(shipRoute.waypoints.length > 0, 'Ship route has waypoints');
    }
    
    // Test long sea voyage
    const longRoute = ROAD_NETWORK.findPath('slada', 'agosgas', { mode: 'sea-only' });
    this.assert(longRoute !== null, 'Slada to Agosgas sea route exists');
    if (longRoute) {
      this.assert(longRoute.distance > 1000, 'Long sea route is over 1000 km');
      this.assert(longRoute.travelTime > 20, 'Long sea route takes over 20 days');
    }
  },

  // Test compareRoutes function
  testCompareRoutes: function() {
    console.log('\n--- Compare Routes Tests ---');
    
    const comparison = ROAD_NETWORK.compareRoutes('slada', 'islefield-city');
    
    this.assert(comparison !== undefined, 'compareRoutes returns result');
    this.assert(comparison.landOnly !== undefined, 'Has land-only option');
    this.assert(comparison.seaOnly !== undefined, 'Has sea-only option');
    this.assert(comparison.normal !== undefined, 'Has normal mixed option');
    this.assert(comparison.fastest !== undefined, 'Has fastest option');
    this.assert(comparison.slow !== undefined, 'Has slow option');
    
    // Fastest should be faster than normal
    if (comparison.fastest && comparison.normal) {
      this.assert(
        comparison.fastest.days <= comparison.normal.days,
        'Fastest option is not slower than normal'
      );
    }
    
    // Slow should be slower than normal
    if (comparison.slow && comparison.normal) {
      this.assert(
        comparison.slow.days >= comparison.normal.days,
        'Slow option is not faster than normal'
      );
    }
  },

  // Test edge cases
  testEdgeCases: function() {
    console.log('\n--- Edge Case Tests ---');
    
    // Non-existent settlements
    const badRoute = ROAD_NETWORK.findPath('fake-city', 'another-fake');
    this.assert(badRoute === null, 'Non-existent settlements return null');
    
    // Same start and end
    const sameRoute = ROAD_NETWORK.findPath('braewood-city', 'braewood-city');
    if (sameRoute !== null) {
      this.assert(sameRoute.distance === 0, 'Same start/end has zero distance');
      this.assert(sameRoute.travelTime === 0, 'Same start/end has zero time');
    }
    
    // Junction nodes (should be traversable but not endpoints typically)
    const junctionRoute = ROAD_NETWORK.findPath('braewood-city', 'adaham-junction');
    this.assert(junctionRoute !== null, 'Can path to junction nodes');
    
    // Verify getRoadById works
    const road = ROAD_NETWORK.getRoadById(1);
    this.assert(road !== null, 'getRoadById finds road by number ID');
    
    const shipRoad = ROAD_NETWORK.getRoadById('ship-mortling-dawerton');
    this.assert(shipRoad !== null, 'getRoadById finds road by string ID');
  },

  // Test sea-only mode with landlocked settlements
  testSeaOnlyLandlocked: function() {
    console.log('\n--- Sea-Only Landlocked Tests ---');
    
    // Test port detection
    this.assert(ROAD_NETWORK.isPort('slada'), 'Slada is a port');
    this.assert(ROAD_NETWORK.isPort('mortling-stronghold'), 'Mortling is a port');
    this.assert(!ROAD_NETWORK.isPort('phine'), 'Phine is NOT a port (landlocked)');
    this.assert(!ROAD_NETWORK.isPort('sord'), 'Sord is NOT a port (landlocked)');
    
    // Test findNearestPort
    const nearestToPhine = ROAD_NETWORK.findNearestPort('phine');
    this.assert(nearestToPhine !== null, 'Phine can find a nearest port');
    if (nearestToPhine) {
      console.log(`  → Phine's nearest port: ${nearestToPhine.port} (${nearestToPhine.distance} km, ${nearestToPhine.travelTime} days)`);
      this.assert(nearestToPhine.path.length >= 2, 'Path to port has multiple stops');
      this.assert(nearestToPhine.path[0] === 'phine', 'Path starts at Phine');
      this.assert(ROAD_NETWORK.isPort(nearestToPhine.port), 'Nearest port is actually a port');
    }
    
    // Test sea-only from landlocked to port
    // Phine (landlocked) to Slada (port)
    const phineToSlada = ROAD_NETWORK.findPath('phine', 'slada', { mode: 'sea-only' });
    this.assert(phineToSlada !== null, 'Phine to Slada works in sea-only mode');
    if (phineToSlada) {
      console.log(`  → Phine to Slada: ${phineToSlada.distance} km, ${phineToSlada.travelTime} days`);
      console.log(`    Path: ${phineToSlada.path.join(' → ')}`);
      this.assert(phineToSlada.path[0] === 'phine', 'Path starts at Phine');
      this.assert(phineToSlada.path[phineToSlada.path.length - 1] === 'slada', 'Path ends at Slada');
    }
    
    // Test sea-only from port to landlocked
    // Slada (port) to Sord (landlocked)
    const sladaToSord = ROAD_NETWORK.findPath('slada', 'sord', { mode: 'sea-only' });
    this.assert(sladaToSord !== null, 'Slada to Sord works in sea-only mode');
    if (sladaToSord) {
      console.log(`  → Slada to Sord: ${sladaToSord.distance} km, ${sladaToSord.travelTime} days`);
      console.log(`    Path: ${sladaToSord.path.join(' → ')}`);
      this.assert(sladaToSord.path[0] === 'slada', 'Path starts at Slada');
      this.assert(sladaToSord.path[sladaToSord.path.length - 1] === 'sord', 'Path ends at Sord');
    }
    
    // Test sea-only from landlocked to landlocked
    // Phine (landlocked) to Sord (landlocked) - should go via ports
    const phineToSord = ROAD_NETWORK.findPath('phine', 'sord', { mode: 'sea-only' });
    this.assert(phineToSord !== null, 'Phine to Sord works in sea-only mode');
    if (phineToSord) {
      console.log(`  → Phine to Sord: ${phineToSord.distance} km, ${phineToSord.travelTime} days`);
      console.log(`    Path: ${phineToSord.path.join(' → ')}`);
      console.log(`    Via ports: ${phineToSord._startPort} → ${phineToSord._endPort}`);
      this.assert(phineToSord.path[0] === 'phine', 'Path starts at Phine');
      this.assert(phineToSord.path[phineToSord.path.length - 1] === 'sord', 'Path ends at Sord');
      // Should have sea segment in the middle
      const hasShipRoute = phineToSord.roadIds.some(id => 
        typeof id === 'string' && id.startsWith('ship-')
      );
      this.assert(hasShipRoute, 'Landlocked-to-landlocked sea route uses ships');
    }
    
    // Test that two ports still work directly
    const sladaToIslefield = ROAD_NETWORK.findPath('slada', 'islefield-city', { mode: 'sea-only' });
    this.assert(sladaToIslefield !== null, 'Port to port still works');
    if (sladaToIslefield) {
      const allShipRoutes = sladaToIslefield.roadIds.every(id => 
        typeof id === 'string' && id.startsWith('ship-')
      );
      this.assert(allShipRoutes, 'Port to port is all ship routes');
    }
    
    // Test Adaham to Islefield (Adaham is landlocked, Islefield is port)
    const adahamToIslefield = ROAD_NETWORK.findPath('adaham', 'islefield-city', { mode: 'sea-only' });
    this.assert(adahamToIslefield !== null, 'Adaham to Islefield works in sea-only');
    if (adahamToIslefield) {
      console.log(`  → Adaham to Islefield: ${adahamToIslefield.distance} km, ${adahamToIslefield.travelTime} days`);
      console.log(`    Path: ${adahamToIslefield.path.join(' → ')}`);
      // Adaham IS now a port (has direct ship route to Islefield)
      this.assert(ROAD_NETWORK.isPort('adaham'), 'Adaham is now a port (has ship routes)');
    }
  },

  // Test direct ship routes (no intermediate stops needed)
  testDirectShipRoutes: function() {
    console.log('\n--- Direct Ship Route Tests ---');
    
    // Test that Adaham has direct routes now
    this.assert(ROAD_NETWORK.isPort('adaham'), 'Adaham is a port');
    
    // Adaham to Islefield should be direct (ship route exists)
    const adahamIslefield = ROAD_NETWORK.findPath('adaham', 'islefield-city', { mode: 'sea-only' });
    this.assert(adahamIslefield !== null, 'Adaham-Islefield direct route exists');
    if (adahamIslefield) {
      console.log(`  → Adaham to Islefield: ${adahamIslefield.distance} km (${adahamIslefield.travelTime} days)`);
      // Should be a single hop - check path length is 2
      this.assert(adahamIslefield.path.length === 2, 'Adaham-Islefield is direct (2 stops only)');
    }
    
    // Braewood to Islefield should be direct
    const braewoodIslefield = ROAD_NETWORK.findPath('braewood-city', 'islefield-city', { mode: 'sea-only' });
    this.assert(braewoodIslefield !== null, 'Braewood-Islefield direct route exists');
    if (braewoodIslefield) {
      console.log(`  → Braewood to Islefield: ${braewoodIslefield.distance} km (${braewoodIslefield.travelTime} days)`);
      this.assert(braewoodIslefield.path.length === 2, 'Braewood-Islefield is direct (2 stops only)');
    }
    
    // Mortling to Kluimont should be direct
    const mortlingKluimont = ROAD_NETWORK.findPath('mortling-stronghold', 'kluimont-city', { mode: 'sea-only' });
    this.assert(mortlingKluimont !== null, 'Mortling-Kluimont direct route exists');
    if (mortlingKluimont) {
      console.log(`  → Mortling to Kluimont: ${mortlingKluimont.distance} km (${mortlingKluimont.travelTime} days)`);
      this.assert(mortlingKluimont.path.length === 2, 'Mortling-Kluimont is direct (2 stops only)');
    }
    
    // Vorton to Islefield should be direct
    const vortonIslefield = ROAD_NETWORK.findPath('vorton', 'islefield-city', { mode: 'sea-only' });
    this.assert(vortonIslefield !== null, 'Vorton-Islefield direct route exists');
    if (vortonIslefield) {
      console.log(`  → Vorton to Islefield: ${vortonIslefield.distance} km (${vortonIslefield.travelTime} days)`);
      this.assert(vortonIslefield.path.length === 2, 'Vorton-Islefield is direct (2 stops only)');
    }
    
    // Dawerton to Islefield should be direct
    const dawertonIslefield = ROAD_NETWORK.findPath('dawerton', 'islefield-city', { mode: 'sea-only' });
    this.assert(dawertonIslefield !== null, 'Dawerton-Islefield direct route exists');
    if (dawertonIslefield) {
      console.log(`  → Dawerton to Islefield: ${dawertonIslefield.distance} km (${dawertonIslefield.travelTime} days)`);
      this.assert(dawertonIslefield.path.length === 2, 'Dawerton-Islefield is direct (2 stops only)');
    }
    
    // Slada to Cok (across the entire coast) should be direct
    const sladaCok = ROAD_NETWORK.findPath('slada', 'cok', { mode: 'sea-only' });
    this.assert(sladaCok !== null, 'Slada-Cok direct route exists');
    if (sladaCok) {
      console.log(`  → Slada to Cok: ${sladaCok.distance} km (${sladaCok.travelTime} days)`);
      this.assert(sladaCok.path.length === 2, 'Slada-Cok is direct (2 stops only)');
    }
  }
};

// Auto-run message
console.log('Road Network Tests loaded. Run ROAD_NETWORK_TESTS.runAll() to execute tests.');
