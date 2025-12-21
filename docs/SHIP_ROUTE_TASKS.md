# Ship Route Rebuild Task List
**Created: December 17, 2025**

## Overview
Rebuild all ship routes properly by:
1. Aligning water boundaries to land boundaries
2. Identifying valid ship nodes
3. Creating proper routes between ports

---

## Phase 1: Boundary Alignment ⬜
- [x] 1.1 Extract land boundaries from map-coordinates.js (Braewood, Islefield, Kluimont, Lavalto)
- [x] 1.2 Run boundary analysis - DONE, found issues:

### ISSUES FOUND:
**Settlements INSIDE ocean (should be on land):**
- frore (80.5, 80) - inside ocean_south
- kadena (56.2, 74.3) - inside ocean_south  
- olkgend (64.6, 73.7) - inside ocean_south
- antstel (40.8, 74.6) - inside ocean_south
- halten (35.7, 77.9) - inside ocean_south

**Lavalto Lake boundary issues:**
- dawerton (58.8, 52.7) - NOT in lake polygon (should be on edge)
- flison (51.7, 52.9) - NOT in lake polygon (should be on edge)
- sheyton (69.5, 53.3) - NOT in lake polygon (should be on edge)
- agosron (50, 62.7) - IS in lake polygon ✓

### BOUNDARY BOUNDS:
- ocean_east: x(86.6-99.3) y(19.5-81.1)
- ocean_south: x(27.4-87.9) y(68.8-80.5) ← TOO FAR INLAND
- ocean_west: x(0.4-17.4) y(32.7-80.9)
- ocean_north: x(0.4-87.0) y(19.0-32.4)
- lavalto_lake: x(45.5-66.1) y(46.6-63.5) ← NEEDS EXPANSION

- [ ] 1.3 Fix ocean_south - move northern boundary further south (below y:74)
- [ ] 1.4 Fix lavalto_lake - expand to include Dawerton, Flison, Sheyton
- [ ] 1.5 Update map-coordinates.js with corrected water regions

## Phase 2: Identify Ship Nodes ⬜
- [ ] 2.1 Extract all coastal points from corrected ocean boundaries
- [ ] 2.2 Identify key waypoint nodes for navigation
- [ ] 2.3 Create SHIP_NODES array with navigable water coordinates

## Phase 3: Identify Ports ⬜
- [ ] 3.1 List all settlements that are ports (on coast/lake/river)
- [ ] 3.2 Verify each port location against water boundaries
- [ ] 3.3 Create PORT_SETTLEMENTS array

## Phase 4: Create Ship Routes ⬜
- [ ] 4.1 For each port, create routes to adjacent ports using ship nodes
- [ ] 4.2 Ensure routes follow water boundaries (no land crossing)
- [ ] 4.3 Update road-network.js with new ship routes
- [ ] 4.4 Run validation to confirm all routes are valid

---

## Current Status
**Phase:** 1 - Boundary Alignment
**Current Task:** 1.1 - Extract land boundaries

## Data Sources
- **Land boundaries:** map-coordinates.js (Braewood, Islefield, Kluimont, Lavalto)
- **Water boundaries:** User-provided DAYNER_REGIONS (ocean_east, ocean_south, ocean_west, ocean_north, lavalto_lake)
- **Settlements:** road-network.js settlements object

## Key Principle
**LAND SUPERSEDES WATER** - If boundaries overlap, move water. If they don't meet, extend water to meet land.
