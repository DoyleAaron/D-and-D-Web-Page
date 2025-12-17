/**
 * DAYNER ROAD NETWORK - Complete Connection Data
 * All roads properly connected to settlements or intersections
 * Used for pathfinding between settlements
 */

const ROAD_NETWORK = {
  // All settlements with their coordinates
  settlements: {
    'braewood-city': { name: 'Braewood City', x: 80.2, y: 42.9 },
    'eaveton': { name: 'Eaveton', x: 76.9, y: 66.3 },
    'mortling-stronghold': { name: 'Mortling Stronghold', x: 68.3, y: 40.5 },
    'phine': { name: 'Phine', x: 53.8, y: 16.4 },
    'barge': { name: 'Barge', x: 71.5, y: 24.6 },
    'sheyton': { name: 'Sheyton', x: 69.5, y: 53.3 },
    'strane': { name: 'Strane', x: 46.5, y: 4.2 },
    'kadena': { name: 'Kadena', x: 56.2, y: 74.3 },
    'cleamond': { name: 'Cleamond', x: 72.6, y: 46.1 },
    'borugham': { name: 'Borugham', x: 75.9, y: 13.6 },
    'ardismouth': { name: 'Ardismouth', x: 86.7, y: 32.5 },
    'gitstin': { name: 'Gitstin', x: 66.8, y: 69.6 },
    'osegas': { name: 'Osegas', x: 71.2, y: 75.5 },
    'yotherdon': { name: 'Yotherdon', x: 87.7, y: 15.3 },
    'vorton': { name: 'Vorton', x: 43.9, y: 3.5 },
    'slada': { name: 'Slada', x: 89.3, y: 6.3 },
    'adaham': { name: 'Adaham', x: 72.3, y: 36 },
    'oyard': { name: 'Oyard', x: 91.4, y: 41 },
    'ineross': { name: 'Ineross', x: 75.7, y: 53 },
    'eimgend': { name: 'Eimgend', x: 66.4, y: 57.7 },
    'ioxyhull': { name: 'Ioxyhull', x: 92.9, y: 60.1 },
    'olkgend': { name: 'Olkgend', x: 64.6, y: 73.7 },
    'frore': { name: 'Frore', x: 80.5, y: 80 },
    'dalo': { name: 'Dalo', x: 74.1, y: 83 },
    'trares': { name: 'Trares', x: 65, y: 81.3 },
    'rens': { name: 'Rens', x: 78.3, y: 87.9 },
    'islefield-city': { name: 'Islefield City', x: 22.4, y: 83.1 },
    'rye': { name: 'Rye', x: 48.4, y: 74.5 },
    'esterhull': { name: 'Esterhull', x: 26.2, y: 96.3 },
    'cheling': { name: 'Cheling', x: 14.9, y: 86.3 },
    'antstel': { name: 'Antstel', x: 40.8, y: 74.6 },
    'yhey': { name: 'Yhey', x: 32, y: 44.3 },
    'beyross': { name: 'Beyross', x: 10.9, y: 74.3 },
    'halten': { name: 'Halten', x: 35.7, y: 77.9 },
    'avinin': { name: 'Avinin', x: 42.8, y: 68.8 },
    'slido': { name: 'Slido', x: 18.1, y: 58.9 },
    'cok': { name: 'Cok', x: 15.4, y: 81.7 },
    'stanron': { name: 'Stanron', x: 25.9, y: 91.9 },
    'ulsall': { name: 'Ulsall', x: 15.4, y: 93.8 },
    'praso': { name: 'Praso', x: 22.8, y: 71.5 },
    'eighwood': { name: 'Eighwood', x: 32.6, y: 61 },
    'wrando': { name: 'Wrando', x: 16.8, y: 63 },
    'agosgas': { name: 'Agosgas', x: 6.6, y: 65 },
    'okcaster': { name: 'Okcaster', x: 7.2, y: 56.8 },
    'guatpool': { name: 'Guatpool', x: 13.2, y: 52.3 },
    'resross': { name: 'Resross', x: 28.7, y: 41.8 },
    'sable': { name: 'Sable', x: 39.3, y: 44.7 },
    'kluimont-city': { name: 'Kluimont City', x: 10.7, y: 12.9 },
    'qrey': { name: 'Qrey', x: 7.8, y: 7 },
    'slonmore': { name: 'Slonmore', x: 50.9, y: 27.1 },
    'sord': { name: 'Sord', x: 45.3, y: 31.5 },
    'tarora': { name: 'Tarora', x: 18.5, y: 24.7 },
    'lloy': { name: 'Lloy', x: 20.1, y: 10.1 },
    'aresphia': { name: 'Aresphia', x: 9.2, y: 27.9 },
    'kilson': { name: 'Kilson', x: 11, y: 29.5 },
    'yuosburn': { name: 'Yuosburn', x: 29.8, y: 14.4 },
    'ukrolis': { name: 'Ukrolis', x: 37.4, y: 13.6 },
    'ajag': { name: 'Ajag', x: 39.8, y: 26.9 },
    'ansdale': { name: 'Ansdale', x: 47.9, y: 40.8 },
    'klovine': { name: 'Klovine', x: 56.4, y: 38.3 },
    'dawerton': { name: 'Dawerton', x: 58.8, y: 52.7 },
    'flison': { name: 'Flison', x: 51.7, y: 52.9 },
    'agosron': { name: 'Agosron', x: 50, y: 62.7 },
    // Junction nodes (not visible settlements, just road junctions)
    'adaham-junction': { name: 'Road Junction', x: 75.5, y: 33.7, isJunction: true },
    'olkgend-junction': { name: 'Road Junction', x: 66, y: 70, isJunction: true },
    'okcaster-junction': { name: 'Road Junction', x: 8, y: 56, isJunction: true },
    'slonmore-junction': { name: 'Road Junction', x: 47.5, y: 25, isJunction: true },
    'klovine-junction': { name: 'Road Junction', x: 47.7, y: 37.5, isJunction: true },
    'strane-junction': { name: 'Road Junction', x: 72.2, y: 22, isJunction: true },
    'borugham-junction': { name: 'Road Junction', x: 74, y: 19.7, isJunction: true },
    'ioxyhull-junction': { name: 'Road Junction', x: 84.4, y: 56.9, isJunction: true },
    'yhey-junction': { name: 'Road Junction', x: 33.3, y: 37.6, isJunction: true },
    'eimgend-city': { name: 'Eimgend', x: 28.2, y: 35.4 },
    // Additional port/river settlements for ship routes
    'erymont': { name: 'Erymont', x: 26.4, y: 4.3 },
    'mara': { name: 'Mara', x: 29.8, y: 6.9 },
  },

  // Road segments connecting settlements directly or via junctions
  // Roads are bidirectional - distance in km
  // pathIndex refers to DAYNER_ROADS.roads[index] for drawing the actual road path
  roads: [
    // === ISLEFIELD SOUTHERN ROADS ===
    { id: 1, length: 22, start: 'stanron', end: 'esterhull', pathIndex: 0 },
    { id: 2, length: 40, start: 'esterhull', end: 'ulsall', pathIndex: 1 },
    { id: 3, length: 40, start: 'ulsall', end: 'cheling', pathIndex: 2 },
    { id: 4, length: 26, start: 'cheling', end: 'islefield-city', pathIndex: 3 },
    { id: 5, length: 14, start: 'cheling', end: 'cok', pathIndex: 4 },
    { id: 6, length: 40, start: 'cok', end: 'beyross', pathIndex: 5 },
    { id: 7, length: 58, start: 'beyross', end: 'agosgas', pathIndex: 6 },
    { id: 8, length: 90, start: 'beyross', end: 'praso', pathIndex: 7 },
    
    // === ISLEFIELD CENTRAL ===
    { id: 9, length: 84, start: 'slido', end: 'praso', pathIndex: 8 },
    { id: 10, length: 14, start: 'slido', end: 'wrando', pathIndex: 9 },
    // Wrando ONLY connects to Slido - no other roads
    // Okcaster connects to the agosgas-guatpool road via junction
    { id: 11, length: 20, start: 'agosgas', end: 'okcaster-junction', pathIndex: 10 },
    { id: 12, length: 70, start: 'okcaster-junction', end: 'guatpool', pathIndex: 11 },
    { id: 71, length: 6, start: 'okcaster', end: 'okcaster-junction' },
    // Agosgas to Slido road (western coastal route)
    { id: 83, length: 50, start: 'agosgas', end: 'slido' },
    { id: 14, length: 112, start: 'slido', end: 'eighwood', pathIndex: 13 },
    
    // === PRASO / HALTEN / ANTSTEL ===
    { id: 15, length: 108, start: 'praso', end: 'halten', pathIndex: 14 },
    { id: 16, length: 28, start: 'halten', end: 'antstel', pathIndex: 15 },
    { id: 17, length: 40, start: 'antstel', end: 'rye', pathIndex: 16 },
    
    // === AVININ / RYE ===
    { id: 18, length: 40, start: 'avinin', end: 'rye', pathIndex: 18 },
    
    // === EIGHWOOD CONNECTIONS ===
    { id: 19, length: 80, start: 'eighwood', end: 'avinin', pathIndex: 19 },
    { id: 20, length: 126, start: 'eighwood', end: 'yhey', pathIndex: 20 },
    
    // === YHEY / SABLE / RESROSS ===
    { id: 22, length: 34, start: 'yhey', end: 'sable', pathIndex: 22 },
    { id: 24, length: 54, start: 'yhey', end: 'resross', pathIndex: 21 },
    
    // === SORD / KLUIMONT REGION ===
    // Eimgend-city to Sord road with Yhey junction
    { id: 80, length: 20, start: 'eimgend-city', end: 'yhey-junction', pathIndex: 24 },
    { id: 25, length: 98, start: 'yhey-junction', end: 'sord', pathIndex: 24 },
    { id: 81, length: 30, start: 'yhey', end: 'yhey-junction', pathIndex: 23 },
    // Resross to Sable (not to Sord directly)
    { id: 26, length: 34, start: 'ajag', end: 'sord', pathIndex: 25 },
    // Sord to Phine road with Slonmore junction
    { id: 27, length: 60, start: 'sord', end: 'slonmore-junction', pathIndex: 26 },
    { id: 72, length: 30, start: 'slonmore-junction', end: 'phine', pathIndex: 26 },
    { id: 73, length: 10, start: 'slonmore', end: 'slonmore-junction', pathIndex: 27 },
    // Sord to Ansdale road with Klovine junction
    { id: 28, length: 40, start: 'sord', end: 'klovine-junction', pathIndex: 28 },
    { id: 74, length: 32, start: 'klovine-junction', end: 'ansdale', pathIndex: 28 },
    { id: 29, length: 102, start: 'slonmore', end: 'klovine', pathIndex: 29 },
    { id: 30, length: 88, start: 'klovine', end: 'klovine-junction', pathIndex: 30 },
    { id: 31, length: 88, start: 'klovine', end: 'mortling-stronghold', pathIndex: 31 },
    { id: 32, length: 56, start: 'ansdale', end: 'sable', pathIndex: 32 },
    
    // === KLUIMONT ISLAND ===
    { id: 33, length: 8, start: 'kluimont-city', end: 'aresphia', pathIndex: 33 },
    { id: 34, length: 28, start: 'kluimont-city', end: 'qrey', pathIndex: 34 },
    { id: 35, length: 44, start: 'kluimont-city', end: 'lloy', pathIndex: 35 },
    
    // === STRANE / PHINE / NORTHERN ===
    { id: 36, length: 14, start: 'vorton', end: 'strane', pathIndex: 36 },
    // Strane connects to junction on Barge-Yotherdon road
    { id: 37, length: 142, start: 'strane', end: 'strane-junction', pathIndex: 37 },
    { id: 38, length: 122, start: 'phine', end: 'barge', pathIndex: 38 },
    // Barge-Yotherdon road split by Strane junction and Borugham junction
    { id: 39, length: 20, start: 'barge', end: 'strane-junction', pathIndex: 39 },
    { id: 75, length: 30, start: 'strane-junction', end: 'borugham-junction', pathIndex: 39 },
    { id: 76, length: 90, start: 'borugham-junction', end: 'yotherdon', pathIndex: 39 },
    // Borugham branches off to borugham-junction
    { id: 77, length: 20, start: 'borugham', end: 'borugham-junction', pathIndex: 40 },
    
    // === YOTHERDON / SLADA ===
    { id: 40, length: 58, start: 'slada', end: 'yotherdon', pathIndex: 41 },
    { id: 41, length: 112, start: 'yotherdon', end: 'ardismouth', pathIndex: 42 },
    
    // === BARGE TO BRAEWOOD ===
    // The road from Barge to Braewood has a junction where Adaham connects
    { id: 43, length: 60, start: 'barge', end: 'adaham-junction', pathIndex: 43 },
    { id: 44, length: 10, start: 'adaham', end: 'adaham-junction', pathIndex: 44 },
    { id: 69, length: 58, start: 'adaham-junction', end: 'braewood-city', pathIndex: 43 },
    
    // === BRAEWOOD CITY CONNECTIONS ===
    { id: 45, length: 72, start: 'braewood-city', end: 'oyard', pathIndex: 46 },
    { id: 46, length: 62, start: 'braewood-city', end: 'ardismouth', pathIndex: 45 },
    { id: 47, length: 26, start: 'braewood-city', end: 'cleamond', pathIndex: 47 },
    { id: 48, length: 36, start: 'cleamond', end: 'sheyton', pathIndex: 49 },
    { id: 49, length: 26, start: 'cleamond', end: 'ineross', pathIndex: 50 },
    { id: 82, length: 30, start: 'cleamond', end: 'mortling-stronghold', pathIndex: 48 },
    
    // === BRAEWOOD TO EAVETON ===
    // Road split at ioxyhull-junction (crossroads with Ineross-Ioxyhull road)
    { id: 50, length: 80, start: 'braewood-city', end: 'ioxyhull-junction', pathIndex: 51 },
    { id: 78, length: 98, start: 'ioxyhull-junction', end: 'eaveton', pathIndex: 51 },
    { id: 51, length: 58, start: 'ioxyhull', end: 'ioxyhull-junction', pathIndex: 52 },
    { id: 79, length: 40, start: 'ineross', end: 'ioxyhull-junction', pathIndex: 53 },
    
    // === SHEYTON / EIMGEND ===
    { id: 52, length: 84, start: 'sheyton', end: 'eimgend', pathIndex: 55 },
    { id: 53, length: 92, start: 'eimgend', end: 'gitstin', pathIndex: 56 },
    { id: 54, length: 54, start: 'gitstin', end: 'eaveton', pathIndex: 57 },
    { id: 55, length: 50, start: 'gitstin', end: 'osegas', pathIndex: 58 },
    
    // === KADENA / GITSTIN with OLKGEND JUNCTION ===
    // The road from Kadena to Gitstin has a junction where Olkgend connects
    { id: 56, length: 60, start: 'kadena', end: 'olkgend-junction', pathIndex: 60 },
    { id: 57, length: 12, start: 'olkgend-junction', end: 'gitstin', pathIndex: 60 },
    { id: 70, length: 10, start: 'olkgend', end: 'olkgend-junction', pathIndex: 61 },
    { id: 58, length: 72, start: 'kadena', end: 'trares', pathIndex: 62 },
    { id: 59, length: 44, start: 'trares', end: 'frore', pathIndex: 63 },
    
    // === OSEGAS / RENS / FRORE / DALO ===
    { id: 60, length: 108, start: 'osegas', end: 'rens', pathIndex: 65 },
    { id: 61, length: 18, start: 'dalo', end: 'frore', pathIndex: 64 },
    { id: 62, length: 32, start: 'dalo', end: 'rens', pathIndex: 67 },
    
    // === LAVALTO ===
    { id: 63, length: 34, start: 'dawerton', end: 'flison', pathIndex: 68 },
    
    // === GRAND SPAN BRIDGE (Kadena to Rye) ===
    { id: 64, length: 80, start: 'kadena', end: 'rye' },
    
    // === MORTLING TO BRAEWOOD ===
    { id: 65, length: 40, start: 'mortling-stronghold', end: 'braewood-city', pathIndex: 48 },
    

    // === EIMGEND / INEROSS / SHEYTON CONNECTIONS ===
    { id: 68, length: 36, start: 'sheyton', end: 'ineross', pathIndex: 53 },

    // ===========================================
    // WATER ROUTES - Using waterPathIndex to reference DAYNER_WATER_ROUTES
    // Generated: December 17, 2025
    // All routes follow actual water paths (rivers, lakes, ocean)
    // waterPathIndex references DAYNER_WATER_ROUTES.routes[index]
    // ===========================================

    // === MAIN BRAEWOOD-ISLEFIELD WATER ROUTE (12 stops) ===
    // Route: Braewood City â†’ Eaveton â†’ Gitstin â†’ Kadena â†’ Rye â†’ 
    //        Antstel â†’ Halten â†’ Praso â†’ Beyross â†’ Cok â†’ Cheling â†’ Islefield City
    
    { id: 'ship-braewood-eaveton', length: 60, start: 'braewood-city', end: 'eaveton', isShipRoute: true, waterPathIndex: 0 },
    { id: 'ship-eaveton-gitstin', length: 30, start: 'eaveton', end: 'gitstin', isShipRoute: true, waterPathIndex: 1 },
    { id: 'ship-gitstin-kadena', length: 35, start: 'gitstin', end: 'kadena', isShipRoute: true, waterPathIndex: 2 },
    { id: 'ship-kadena-rye', length: 20, start: 'kadena', end: 'rye', isShipRoute: true, waterPathIndex: 3 },
    { id: 'ship-rye-antstel', length: 20, start: 'rye', end: 'antstel', isShipRoute: true, waterPathIndex: 4 },
    { id: 'ship-antstel-halten', length: 15, start: 'antstel', end: 'halten', isShipRoute: true, waterPathIndex: 5 },
    { id: 'ship-halten-praso', length: 40, start: 'halten', end: 'praso', isShipRoute: true, waterPathIndex: 6 },
    { id: 'ship-praso-beyross', length: 35, start: 'praso', end: 'beyross', isShipRoute: true, waterPathIndex: 7 },
    { id: 'ship-beyross-cok', length: 25, start: 'beyross', end: 'cok', isShipRoute: true, waterPathIndex: 8 },
    { id: 'ship-cok-cheling', length: 20, start: 'cok', end: 'cheling', isShipRoute: true, waterPathIndex: 9 },
    { id: 'ship-cheling-islefield', length: 25, start: 'cheling', end: 'islefield-city', isShipRoute: true, waterPathIndex: 10 },

    // === EAST COAST OCEAN ROUTES ===
    { id: 'ship-slada-borugham', length: 40, start: 'slada', end: 'borugham', isShipRoute: true, waterPathIndex: 11 },
    { id: 'ship-borugham-ardismouth', length: 60, start: 'borugham', end: 'ardismouth', isShipRoute: true, waterPathIndex: 12 },
    { id: 'ship-ardismouth-oyard', length: 25, start: 'ardismouth', end: 'oyard', isShipRoute: true, waterPathIndex: 13 },
    { id: 'ship-oyard-ioxyhull', length: 50, start: 'oyard', end: 'ioxyhull', isShipRoute: true, waterPathIndex: 14 },
    { id: 'ship-ioxyhull-rens', length: 80, start: 'ioxyhull', end: 'rens', isShipRoute: true, waterPathIndex: 15 },

    // === SOUTH COAST ROUTES ===
    { id: 'ship-rens-trares', length: 30, start: 'rens', end: 'trares', isShipRoute: true, waterPathIndex: 16 },
    { id: 'ship-trares-dalo', length: 25, start: 'trares', end: 'dalo', isShipRoute: true, waterPathIndex: 17 },
    { id: 'ship-dalo-frore', length: 20, start: 'dalo', end: 'frore', isShipRoute: true, waterPathIndex: 18 },
    { id: 'ship-rens-esterhull', length: 160, start: 'rens', end: 'esterhull', isShipRoute: true, waterPathIndex: 19 },
    { id: 'ship-esterhull-ulsall', length: 35, start: 'esterhull', end: 'ulsall', isShipRoute: true, waterPathIndex: 20 },
    { id: 'ship-ulsall-cheling', length: 25, start: 'ulsall', end: 'cheling', isShipRoute: true, waterPathIndex: 21 },

    // === BRAEWOOD RIVER SYSTEM ===
    { id: 'ship-braewood-mortling', length: 35, start: 'braewood-city', end: 'mortling-stronghold', isShipRoute: true, waterPathIndex: 22 },
    { id: 'ship-mortling-adaham', length: 15, start: 'mortling-stronghold', end: 'adaham', isShipRoute: true, waterPathIndex: 23 },
    { id: 'ship-adaham-sheyton', length: 45, start: 'adaham', end: 'sheyton', isShipRoute: true, waterPathIndex: 24 },
    { id: 'ship-sheyton-dawerton', length: 30, start: 'sheyton', end: 'dawerton', isShipRoute: true, waterPathIndex: 25 },
    { id: 'ship-dawerton-flison', length: 20, start: 'dawerton', end: 'flison', isShipRoute: true, waterPathIndex: 26 },
    { id: 'ship-flison-agosron', length: 30, start: 'flison', end: 'agosron', isShipRoute: true, waterPathIndex: 27 },
    { id: 'ship-agosron-avinin', length: 25, start: 'agosron', end: 'avinin', isShipRoute: true, waterPathIndex: 28 },
    { id: 'ship-avinin-antstel', length: 20, start: 'avinin', end: 'antstel', isShipRoute: true, waterPathIndex: 29 },

    // === LAKE ROUTES (Lavalto Lake) ===
    { id: 'ship-eaveton-dawerton', length: 50, start: 'eaveton', end: 'dawerton', isShipRoute: true, waterPathIndex: 30 },
    { id: 'ship-gitstin-agosron', length: 45, start: 'gitstin', end: 'agosron', isShipRoute: true, waterPathIndex: 31 },

    // === KLUIMONT RIVER SYSTEM ===
    { id: 'ship-vorton-strane', length: 8, start: 'vorton', end: 'strane', isShipRoute: true, waterPathIndex: 32 },
    { id: 'ship-vorton-slonmore', length: 70, start: 'vorton', end: 'slonmore', isShipRoute: true, waterPathIndex: 33 },
    { id: 'ship-slonmore-ajag', length: 30, start: 'slonmore', end: 'ajag', isShipRoute: true, waterPathIndex: 34 },
    { id: 'ship-kluimont-tarora', length: 40, start: 'kluimont-city', end: 'tarora', isShipRoute: true, waterPathIndex: 35 },
    { id: 'ship-tarora-aresphia', length: 30, start: 'tarora', end: 'aresphia', isShipRoute: true, waterPathIndex: 36 },
    { id: 'ship-kluimont-qrey', length: 20, start: 'kluimont-city', end: 'qrey', isShipRoute: true, waterPathIndex: 37 },
    { id: 'ship-kluimont-eimgend', length: 60, start: 'kluimont-city', end: 'eimgend-city', isShipRoute: true, waterPathIndex: 38 },
    { id: 'ship-eimgend-resross', length: 20, start: 'eimgend-city', end: 'resross', isShipRoute: true, waterPathIndex: 39 },

    // === WEST COAST ROUTES ===
    { id: 'ship-agosgas-okcaster', length: 25, start: 'agosgas', end: 'okcaster', isShipRoute: true, waterPathIndex: 40 },
    { id: 'ship-okcaster-beyross', length: 50, start: 'okcaster', end: 'beyross', isShipRoute: true, waterPathIndex: 41 },
    { id: 'ship-agosgas-beyross', length: 30, start: 'agosgas', end: 'beyross', isShipRoute: true, waterPathIndex: 42 },
  ],

  // Travel speeds in km per day
  // Multiple pace options for different travel styles
  TRAVEL_SPEEDS: {
    road: {
      slow: 20,      // Cautious/stealthy, can use stealth
      normal: 30,    // Standard walking pace
      fast: 40       // Forced march, -5 passive perception
    },
    ship: {
      slow: 40,      // Keelboat, river barge, cautious sailing
      normal: 50,    // Standard sailing ship
      fast: 70       // Longship, favorable winds, galley
    }
  },

  // Get all settlements that have ship routes (ports)
  getPortSettlements: function() {
    const ports = new Set();
    this.roads.forEach(road => {
      if (road.isShipRoute) {
        ports.add(road.start);
        ports.add(road.end);
      }
    });
    return ports;
  },

  // Check if a settlement is a port
  isPort: function(settlementId) {
    return this.roads.some(road => 
      road.isShipRoute && (road.start === settlementId || road.end === settlementId)
    );
  },

  // Find nearest port to a settlement (by road travel time)
  findNearestPort: function(settlementId, options = {}) {
    const ports = this.getPortSettlements();
    
    // If already a port, return self with 0 distance
    if (ports.has(settlementId)) {
      return { port: settlementId, distance: 0, travelTime: 0, path: [settlementId], roadIds: [] };
    }
    
    // Find path to each port and return the one with shortest travel time
    let nearestPort = null;
    let shortestTime = Infinity;
    
    const landOptions = { mode: 'land-only', roadPace: options.roadPace || 'normal' };
    
    for (const port of ports) {
      const result = this.findPathDirect(settlementId, port, landOptions);
      if (result && result.travelTime < shortestTime) {
        shortestTime = result.travelTime;
        nearestPort = {
          port: port,
          distance: result.distance,
          travelTime: result.travelTime,
          path: result.path,
          roadIds: result.roadIds
        };
      }
    }
    
    return nearestPort;
  },

  // Build adjacency list for pathfinding
  // Options: { roadPace: 'slow'|'normal'|'fast', shipPace: 'slow'|'normal'|'fast', 
  //            mode: 'any'|'land-only'|'sea-only' }
  buildGraph: function(options = {}) {
    const roadPace = options.roadPace || 'normal';
    const shipPace = options.shipPace || 'normal';
    const mode = options.mode || 'any';
    
    const roadSpeed = this.TRAVEL_SPEEDS.road[roadPace];
    const shipSpeed = this.TRAVEL_SPEEDS.ship[shipPace];
    
    const graph = {};
    
    // Initialize all settlement nodes
    Object.keys(this.settlements).forEach(id => {
      graph[id] = [];
    });
    
    // Add road connections - convert distance to travel time
    this.roads.forEach(road => {
      // Filter by travel mode
      if (mode === 'land-only' && road.isShipRoute) return;
      if (mode === 'sea-only' && !road.isShipRoute) return;
      
      if (!graph[road.start]) graph[road.start] = [];
      if (!graph[road.end]) graph[road.end] = [];
      
      // Calculate travel time based on whether it's a ship route or road
      const speed = road.isShipRoute ? shipSpeed : roadSpeed;
      const travelTime = road.length / speed; // Time in days
      
      graph[road.start].push({ 
        to: road.end, 
        distance: road.length,
        travelTime: travelTime,
        roadId: road.id,
        isShipRoute: road.isShipRoute || false
      });
      graph[road.end].push({ 
        to: road.start, 
        distance: road.length,
        travelTime: travelTime,
        roadId: road.id,
        isShipRoute: road.isShipRoute || false
      });
    });
    
    return graph;
  },

  // Internal Dijkstra's algorithm - direct pathfinding without special sea-only handling
  findPathDirect: function(startId, endId, options = {}) {
    const graph = this.buildGraph(options);
    
    if (!graph[startId] || !graph[endId]) {
      return null;
    }
    
    const travelTimes = {};  // Track travel time (what we optimize)
    const totalDistances = {}; // Track actual distance traveled
    const previous = {};
    const previousRoad = {}; // Track which road was used
    const visited = new Set();
    const queue = [];
    
    Object.keys(graph).forEach(node => {
      travelTimes[node] = Infinity;
      totalDistances[node] = 0;
    });
    travelTimes[startId] = 0;
    totalDistances[startId] = 0;
    queue.push({ node: startId, time: 0 });
    
    while (queue.length > 0) {
      queue.sort((a, b) => a.time - b.time);
      const current = queue.shift();
      
      if (visited.has(current.node)) continue;
      visited.add(current.node);
      
      if (current.node === endId) {
        const path = [];
        const roadIds = [];
        let node = endId;
        while (node !== startId) {
          path.unshift(node);
          if (previousRoad[node]) {
            roadIds.unshift(previousRoad[node]);
          }
          node = previous[node];
        }
        path.unshift(startId);
        
        return {
          distance: Math.round(totalDistances[endId]),
          travelTime: Math.round(travelTimes[endId] * 10) / 10, // Round to 1 decimal (days)
          path: path,
          roadIds: roadIds
        };
      }
      
      const neighbors = graph[current.node] || [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor.to)) continue;
        
        // Use travelTime for pathfinding optimization
        const newTime = travelTimes[current.node] + neighbor.travelTime;
        if (newTime < travelTimes[neighbor.to]) {
          travelTimes[neighbor.to] = newTime;
          totalDistances[neighbor.to] = totalDistances[current.node] + neighbor.distance;
          previous[neighbor.to] = current.node;
          previousRoad[neighbor.to] = neighbor.roadId;
          queue.push({ node: neighbor.to, time: newTime });
        }
      }
    }
    
    return null;
  },

  // Main pathfinding function with special handling for sea-only mode with landlocked settlements
  // For sea-only: if start/end is landlocked, find nearest port and travel by land to/from it
  findPath: function(startId, endId, options = {}) {
    const mode = options.mode || 'any';
    
    // For non-sea-only modes, use direct pathfinding
    if (mode !== 'sea-only') {
      return this.findPathDirect(startId, endId, options);
    }
    
    // Sea-only mode: handle landlocked settlements
    const startIsPort = this.isPort(startId);
    const endIsPort = this.isPort(endId);
    
    // If both are ports, just find sea route directly
    if (startIsPort && endIsPort) {
      return this.findPathDirect(startId, endId, options);
    }
    // AARON INVESTIGATE: This needs to change as this isnt correct, shouldnt go land only if both are ports
    
    // Find nearest ports for landlocked settlements
    const startPort = startIsPort ? 
      { port: startId, distance: 0, travelTime: 0, path: [startId], roadIds: [] } : 
      this.findNearestPort(startId, options);
    
    const endPort = endIsPort ? 
      { port: endId, distance: 0, travelTime: 0, path: [endId], roadIds: [] } : 
      this.findNearestPort(endId, options);
    
    if (!startPort || !endPort) {
      return null; // Can't reach any port
    }
    
    // Find sea route between ports (if different ports)
    let seaRoute = null;
    if (startPort.port !== endPort.port) {
      seaRoute = this.findPathDirect(startPort.port, endPort.port, { 
        mode: 'sea-only', 
        shipPace: options.shipPace || 'normal' 
      });
      if (!seaRoute) {
        return null; // No sea connection between ports
      }
    } else {
      // Same port - just land travel
      seaRoute = { distance: 0, travelTime: 0, path: [], roadIds: [] };
    }
    
    // Combine: land to start port + sea route + land from end port
    const combinedPath = [];
    const combinedRoadIds = [];
    let totalDistance = 0;
    let totalTravelTime = 0;
    
    // Add start land segment (if not already at port)
    if (!startIsPort) {
      combinedPath.push(...startPort.path);
      combinedRoadIds.push(...startPort.roadIds);
      totalDistance += startPort.distance;
      totalTravelTime += startPort.travelTime;
    }
    
    // Add sea segment (skip first node if it would duplicate)
    if (seaRoute.path.length > 0) {
      const seaPathStart = (combinedPath.length > 0 && seaRoute.path[0] === combinedPath[combinedPath.length - 1]) ? 1 : 0;
      combinedPath.push(...seaRoute.path.slice(seaPathStart));
      combinedRoadIds.push(...seaRoute.roadIds);
      totalDistance += seaRoute.distance;
      totalTravelTime += seaRoute.travelTime;
    }
    
    // Add end land segment (if destination is not a port)
    if (!endIsPort) {
      // Path from end port to destination - need to reverse the path
      const endLandPath = [...endPort.path].reverse();
      const endLandRoadIds = [...endPort.roadIds].reverse();
      
      // Skip first node if it would duplicate
      const endPathStart = (combinedPath.length > 0 && endLandPath[0] === combinedPath[combinedPath.length - 1]) ? 1 : 0;
      combinedPath.push(...endLandPath.slice(endPathStart));
      combinedRoadIds.push(...endLandRoadIds);
      totalDistance += endPort.distance;
      totalTravelTime += endPort.travelTime;
    }
    
    return {
      distance: Math.round(totalDistance),
      travelTime: Math.round(totalTravelTime * 10) / 10,
      path: combinedPath,
      roadIds: combinedRoadIds,
      // Extra info for debugging
      _startPort: startPort.port,
      _endPort: endPort.port,
      _usedLandToPort: !startIsPort,
      _usedLandFromPort: !endIsPort
    };
  },

  // Helper to get distance with options
  getDistance: function(fromId, toId, options = {}) {
    const result = this.findPath(fromId, toId, options);
    return result ? result.distance : null;
  },
  
  // Get travel time in days with options
  getTravelTime: function(fromId, toId, options = {}) {
    const result = this.findPath(fromId, toId, options);
    return result ? result.travelTime : null;
  },
  
  // Compare all travel options between two points
  compareRoutes: function(fromId, toId) {
    const results = {};
    
    // Land only (normal pace)
    const landOnly = this.findPath(fromId, toId, { mode: 'land-only', roadPace: 'normal' });
    if (landOnly) {
      results.landOnly = {
        distance: landOnly.distance,
        days: landOnly.travelTime,
        path: landOnly.path
      };
    }
    
    // Sea only (normal pace)
    const seaOnly = this.findPath(fromId, toId, { mode: 'sea-only', shipPace: 'normal' });
    if (seaOnly) {
      results.seaOnly = {
        distance: seaOnly.distance,
        days: seaOnly.travelTime,
        path: seaOnly.path
      };
    }
    
    // Mixed - fastest (fast walk + fast ship)
    const fastest = this.findPath(fromId, toId, { mode: 'any', roadPace: 'fast', shipPace: 'fast' });
    if (fastest) {
      results.fastest = {
        distance: fastest.distance,
        days: fastest.travelTime,
        path: fastest.path
      };
    }
    
    // Mixed - normal pace
    const normal = this.findPath(fromId, toId, { mode: 'any', roadPace: 'normal', shipPace: 'normal' });
    if (normal) {
      results.normal = {
        distance: normal.distance,
        days: normal.travelTime,
        path: normal.path
      };
    }
    
    // Mixed - slow (for stealth/caution)
    const slow = this.findPath(fromId, toId, { mode: 'any', roadPace: 'slow', shipPace: 'slow' });
    if (slow) {
      results.slow = {
        distance: slow.distance,
        days: slow.travelTime,
        path: slow.path
      };
    }
    
    return results;
  },
  
  // Get a road by its ID
  getRoadById: function(roadId) {
    return this.roads.find(r => r.id === roadId) || null;
  },
  
  // Helper: find the index of the point on a path closest to a given coordinate
  findClosestPointIndex: function(path, x, y) {
    let closestIndex = 0;
    let closestDist = Infinity;
    
    for (let i = 0; i < path.length; i++) {
      const dist = Math.sqrt(
        Math.pow(path[i].x - x, 2) + 
        Math.pow(path[i].y - y, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
    return closestIndex;
  },
  
  // Get coordinates for drawing a path
  // Returns array of {x, y} points including waypoints from DAYNER_ROADS
  getPathCoordinates: function(pathResult) {
    if (!pathResult || !pathResult.path || pathResult.path.length < 2) {
      return [];
    }
    
    const coords = [];
    const path = pathResult.path;
    const roadIds = pathResult.roadIds || [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const fromId = path[i];
      const toId = path[i + 1];
      const roadId = roadIds[i];
      
      // Get start and end nodes
      const fromNode = this.settlements[fromId];
      const toNode = this.settlements[toId];
      
      // Add start point if this is the first segment
      if (fromNode && coords.length === 0) {
        coords.push({ x: fromNode.x, y: fromNode.y, isNode: true, nodeId: fromId });
      }
      
      // If road has pathIndex, get waypoints from DAYNER_ROADS, or check for ship route waypoints
      if (roadId && fromNode && toNode) {
        const road = this.getRoadById(roadId);
        if (road) {
          // Check if this is a ship route with waterPathIndex (new water routes system)
          if (road.isShipRoute && typeof road.waterPathIndex === 'number' && typeof DAYNER_WATER_ROUTES !== 'undefined') {
            // Get waypoints from DAYNER_WATER_ROUTES
            const waterPath = DAYNER_WATER_ROUTES.routes[road.waterPathIndex];
            if (waterPath && waterPath.length > 0) {
              // Find the closest points on the water route to both start and end nodes
              const startIdx = this.findClosestPointIndex(waterPath, fromNode.x, fromNode.y);
              const endIdx = this.findClosestPointIndex(waterPath, toNode.x, toNode.y);
              
              // Extract only the portion of the route between these points
              let waypoints;
              if (startIdx <= endIdx) {
                waypoints = waterPath.slice(startIdx, endIdx + 1);
              } else {
                // Reverse direction
                waypoints = waterPath.slice(endIdx, startIdx + 1).reverse();
              }
              
              // Add waypoints (skip if too close to start/end nodes)
              waypoints.forEach(wp => {
                const distToFrom = Math.sqrt(Math.pow(wp.x - fromNode.x, 2) + Math.pow(wp.y - fromNode.y, 2));
                const distToTo = Math.sqrt(Math.pow(wp.x - toNode.x, 2) + Math.pow(wp.y - toNode.y, 2));
                // Only add if not too close to the settlement nodes (avoid duplicates)
                if (distToFrom > 0.5 && distToTo > 0.5) {
                  coords.push({ x: wp.x, y: wp.y, isNode: false });
                }
              });
            }
          } else if (road.isShipRoute && road.waypoints && road.waypoints.length > 0) {
            // Ship routes have waypoints stored directly on the road object
            // Determine if we need to reverse based on which settlement we're coming from
            let waypoints = road.waypoints;
            
            // Check if we're going in the reverse direction (end -> start)
            if (road.end === fromId) {
              waypoints = waypoints.slice().reverse();
            }
            
            // Add all waypoints
            waypoints.forEach(wp => {
              const distToFrom = Math.sqrt(Math.pow(wp.x - fromNode.x, 2) + Math.pow(wp.y - fromNode.y, 2));
              const distToTo = Math.sqrt(Math.pow(wp.x - toNode.x, 2) + Math.pow(wp.y - toNode.y, 2));
              // Only add if not too close to the settlement nodes (avoid duplicates)
              if (distToFrom > 0.5 && distToTo > 0.5) {
                coords.push({ x: wp.x, y: wp.y, isNode: false });
              }
            });
          } else if (typeof road.pathIndex === 'number' && typeof DAYNER_ROADS !== 'undefined') {
            // Regular road - get waypoints from DAYNER_ROADS
            const roadPath = DAYNER_ROADS.roads[road.pathIndex];
            if (roadPath && roadPath.length > 0) {
              // Find the closest points on the road to both start and end nodes
              const startIdx = this.findClosestPointIndex(roadPath, fromNode.x, fromNode.y);
              const endIdx = this.findClosestPointIndex(roadPath, toNode.x, toNode.y);
              
              // Extract only the portion of the road between these points
              let waypoints;
              if (startIdx <= endIdx) {
                waypoints = roadPath.slice(startIdx, endIdx + 1);
              } else {
                // Reverse direction
                waypoints = roadPath.slice(endIdx, startIdx + 1).reverse();
              }
              
              // Add waypoints (skip if too close to start/end nodes)
              waypoints.forEach(wp => {
                const distToFrom = Math.sqrt(Math.pow(wp.x - fromNode.x, 2) + Math.pow(wp.y - fromNode.y, 2));
                const distToTo = Math.sqrt(Math.pow(wp.x - toNode.x, 2) + Math.pow(wp.y - toNode.y, 2));
                // Only add if not too close to the settlement nodes (avoid duplicates)
                if (distToFrom > 1 && distToTo > 1) {
                  coords.push({ x: wp.x, y: wp.y, isNode: false });
                }
              });
            }
          }
        }
      }
      
      // Add end point
      if (toNode) {
        coords.push({ x: toNode.x, y: toNode.y, isNode: true, nodeId: toId });
      }
    }
    
    return coords;
  }
};

// ===========================================
// INTEGRATE SHIP ROUTES FROM DAYNER_SHIP_ROUTES
// This merges the comprehensive ship routes into the road network
// ===========================================
(function() {
  if (typeof DAYNER_SHIP_ROUTES !== 'undefined' && DAYNER_SHIP_ROUTES.routes) {
    console.log('Integrating ship routes from DAYNER_SHIP_ROUTES...');
    
    // Track existing ship route IDs to avoid duplicates
    const existingShipRoutes = new Set();
    ROAD_NETWORK.roads.forEach(road => {
      if (road.isShipRoute) {
        existingShipRoutes.add(road.id);
        // Also track by start-end key
        existingShipRoutes.add(`${road.start}-to-${road.end}`);
        existingShipRoutes.add(`${road.end}-to-${road.start}`);
      }
    });
    
    // Add ports as settlements if they don't exist
    if (DAYNER_SHIP_ROUTES.ports) {
      Object.entries(DAYNER_SHIP_ROUTES.ports).forEach(([id, port]) => {
        if (!ROAD_NETWORK.settlements[id]) {
          ROAD_NETWORK.settlements[id] = {
            name: port.name,
            x: port.x,
            y: port.y,
            isPort: true
          };
        }
      });
    }
    
    // Add new ship routes
    let addedCount = 0;
    Object.values(DAYNER_SHIP_ROUTES.routes).forEach(route => {
      // Check if this route already exists (in either direction)
      const key1 = `${route.start}-to-${route.end}`;
      const key2 = `${route.end}-to-${route.start}`;
      
      if (!existingShipRoutes.has(route.id) && 
          !existingShipRoutes.has(key1) && 
          !existingShipRoutes.has(key2)) {
        // Add the route
        ROAD_NETWORK.roads.push({
          id: route.id,
          length: route.length || 50, // Default distance if not set
          start: route.start,
          end: route.end,
          isShipRoute: true,
          waypoints: route.waypoints || []
        });
        existingShipRoutes.add(route.id);
        existingShipRoutes.add(key1);
        addedCount++;
      }
    });
    
    console.log(`Added ${addedCount} new ship routes from DAYNER_SHIP_ROUTES`);
    console.log(`Total roads/routes: ${ROAD_NETWORK.roads.length}`);
    console.log(`Total ports: ${ROAD_NETWORK.getPortSettlements().size}`);
  } else {
    console.log('DAYNER_SHIP_ROUTES not found - using built-in ship routes only');
  }
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROAD_NETWORK;
}
