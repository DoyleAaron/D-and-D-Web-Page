# Ship Routes Rebuild Task
**Created:** December 17, 2025

## RULES (DO NOT BREAK)

### 1. Land Takes Priority Over Water
- Kingdom borders (Braewood, Islefield, Kluimont, Lavalto) are the SOURCE OF TRUTH
- If water boundaries overlap with land, **move the water boundary**
- If water boundaries don't meet land, **extend water to meet land**
- NEVER move or adjust settlement positions
- NEVER move or adjust road positions

### 2. Water Regions to Define
- **Ocean North** - north of mainland, around Rimduff Isles
- **Ocean East** - east coast of Braewood
- **Ocean South** - south coast between Braewood and Islefield
- **Ocean West** - west coast of Islefield
- **Lavalto Lake** - ring-shaped lake with volcanic island in center
- **Major Rivers** - already defined in map-coordinates.js

### 3. Land Masses
- **Braewood** - eastern kingdom (map-coordinates.js: braewood)
- **Islefield** - southwestern kingdom (map-coordinates.js: islefield)
- **Kluimont** - northern/central kingdom (map-coordinates.js: kluimont)
- **Lavalto** - volcanic island in Lavalto Lake (map-coordinates.js: lavalto)
- **Rimduff Isles** - islands in ocean north (part of Kluimont border)

### 4. Ship Route Rules
- Ships can ONLY travel through: ocean, lakes, rivers
- Ships CANNOT cross: land (kingdom interiors, islands)
- Routes must follow coastlines, not cut across land
- Lavalto Lake ships must go AROUND the volcanic island, not through it

---

## TASK LIST

### Phase 1: Analyze Land Boundaries ✅ COMPLETE
- [x] Extract coastal points from Braewood border
- [x] Extract coastal points from Islefield border  
- [x] Extract coastal points from Kluimont border (including Rimduff Isles)
- [x] Extract Lavalto Island boundary (the volcanic island)
- [x] Identify which parts of each kingdom border touch ocean/water

**FINDINGS:**
```
Kingdom Bounds:
- Braewood: x(43-94.6), y(1.9-90)
- Islefield: x(2.4-51), y(40.1-99.9)
- Kluimont: x(3.8-70.6), y(1.4-50.1)
- Lavalto Island: x(47.7-63.7), y(48.7-68.4)

Kluimont has 4 SEPARATE land masses:
1. Rimduff Isle NW: x(3.8-20.6), y(4.3-21.4) - 27 points
2. Rimduff Isle N: x(25.1-27.8), y(1.4-7.9) - 12 points
3. Rimduff Isle Main: x(8.7-39.3), y(11.9-31.6) - 64 points
4. Kluimont Mainland: x(21.0-70.6), y(15.9-50.1) - 88 points

Lavalto Lake outer edge (kingdoms):
- Braewood: (63.8-65.5, 48.7-68.9)
- Islefield: (45.5-47.9, 48-69.3)
- Kluimont: (46-49.1, 48.5-50.1)

Coastal Edges:
- Braewood east: x > 86, y from 4.4 to 76.5
- Braewood south: x 56-90, y 76-90
- Islefield west: x < 8, y 51-92
- Islefield south: x 7-31, y > 90
```

### Phase 2: Fix Water Boundaries
- [ ] Compare ocean_east to Braewood east coast - make flush
- [ ] Compare ocean_south to Braewood south + Islefield south - make flush
- [ ] Compare ocean_west to Islefield west coast - make flush
- [ ] Compare ocean_north to Braewood north + Kluimont coast - make flush
- [ ] Define Rimduff Isles water (ocean between the islands)
- [ ] Fix lavalto_lake to match Lavalto kingdom border (outer ring = water, inner = island)

### Phase 3: Identify Valid Ship Nodes
- [ ] List all points where ships can travel (ocean coastline points)
- [ ] List all lake ports (settlements on Lavalto Lake edge)
- [ ] List all river ports (settlements on major rivers)
- [ ] Create VIABLE_SHIP_NODES array with all valid water coordinates

### Phase 4: Identify Port Settlements
- [ ] Ocean ports - settlements directly on ocean coast
- [ ] Lake ports - settlements on Lavalto Lake
- [ ] River ports - settlements on navigable rivers
- [ ] Create PORT_SETTLEMENTS list

### Phase 5: Create Ship Routes
- [ ] For each port, create routes to adjacent ports following water
- [ ] Routes must use ONLY coordinates from VIABLE_SHIP_NODES
- [ ] Validate no route crosses land
- [ ] Test pathfinding works between all ports

---

## CURRENT STATUS

### Completed
- [x] Basic ocean regions defined (need adjustment)
- [x] Lavalto Lake region defined (need adjustment)
- [x] Kluimont Islands marked as land

### In Progress
- [ ] Phase 1: Analyze land boundaries

### Blocked
- Nothing currently blocked

---

## DATA SOURCES

### Land Borders (SOURCE OF TRUTH)
File: `map-coordinates.js`
- `MAP_COORDINATES.braewood` - 82 points
- `MAP_COORDINATES.islefield` - 72 points
- `MAP_COORDINATES.kluimont` - 191 points (includes Rimduff Isles as separate island shapes)
- `MAP_COORDINATES.lavalto` - 27 points (the volcanic island)

### Water Regions (TO BE ADJUSTED)
File: `map-coordinates.js` (add new section)
- `WATER_REGIONS.ocean_east`
- `WATER_REGIONS.ocean_south`
- `WATER_REGIONS.ocean_west`
- `WATER_REGIONS.ocean_north`
- `WATER_REGIONS.lavalto_lake`
- `WATER_REGIONS.rimduff_sea` (between the Rimduff Isles)

### Rivers
File: `map-coordinates.js`
- `MAP_COORDINATES.river_major` - 234 points

---

## KEY COORDINATES REFERENCE

### Kingdom Bounds (from map-coordinates.js comments)
- Braewood: x(43-94.6), y(1.9-90)
- Islefield: x(2.4-51), y(40.1-99.9)
- Kluimont: x(3.8-70.6), y(1.4-50.1)
- Lavalto Island: x(47.7-63.7), y(48.7-68.4)

### Rimduff Isles (part of Kluimont border)
The Kluimont border includes several disconnected island polygons - these are the Rimduff Isles.
Ships can travel BETWEEN these islands but not THROUGH them.

---

## NOTES
- The pathfinding system uses Dijkstra's algorithm
- Ship routes need waypoints arrays that define the visual path
- Shorter adjacent-port routes are better - let pathfinder chain them
