# Dayner Geography Reference for Ship Routes

This file helps track what's water vs land on the Dayner map for ship route validation.

## Key Rule
**The first 69 ship routes are ALWAYS CORRECT** - even if they appear to cross land, they follow rivers or waterways that may not be visible on the map.

---

## RIVERS (Mapped Coordinates)

### River 1 (Northwest - near coordinates 4-13, y: 13-19)
Flows from around (13, 18.9) down to (4.2, 13.7)
```
{ x: 13, y: 18.9 } → { x: 12.4, y: 18.3 } → { x: 11.3, y: 18.2 } → { x: 10.6, y: 18 } →
{ x: 9.8, y: 17.9 } → { x: 9, y: 17.4 } → { x: 8.1, y: 17.1 } → { x: 7.3, y: 16.6 } →
{ x: 6.6, y: 15.8 } → { x: 6.4, y: 15.2 } → { x: 6.3, y: 13.9 } → { x: 5.8, y: 13.1 } →
{ x: 5, y: 13.4 } → { x: 4.2, y: 13.7 }
```

### River 2 (Southwest - Rens/Islefield area, y: 78-92)
Flows from (8.1, 92.3) up to (29.5, 79.6) - connects Rens area to inner lands
```
{ x: 8.1, y: 92.3 } → { x: 9.1, y: 91.3 } → { x: 10, y: 89.7 } → { x: 10.3, y: 88.3 } →
{ x: 11.3, y: 87.1 } → { x: 11.6, y: 85.3 } → { x: 12.2, y: 83.5 } → { x: 13, y: 81.9 } →
{ x: 13.6, y: 80.9 } → { x: 15.9, y: 80 } → { x: 17.2, y: 79.8 } → { x: 18.6, y: 79.6 } →
{ x: 19.9, y: 79.6 } → { x: 20.6, y: 79.6 } → { x: 21.7, y: 79.6 } → { x: 23.3, y: 79.1 } →
{ x: 24.6, y: 78.5 } → { x: 25.9, y: 78 } → { x: 27.7, y: 78.1 } → { x: 29, y: 78.3 } →
{ x: 29.5, y: 79.6 }
```

### River 3 (Central-West - Major river system, y: 40-78)
Large river system flowing from (18.1, 78.3) up through central lands to (21.3, 50.1)
Branch also connects to (18.2, 40.8)
```
{ x: 18.1, y: 78.3 } → { x: 17.1, y: 77.1 } → { x: 16.4, y: 75.7 } → { x: 15.9, y: 74.3 } →
{ x: 15.4, y: 72 } → { x: 15.2, y: 70 } → { x: 15.8, y: 67.9 } → { x: 16.3, y: 66.3 } →
{ x: 16.8, y: 65.2 } → { x: 17.5, y: 63.9 } → { x: 18.4, y: 62.4 } → { x: 19.3, y: 61.7 } →
{ x: 20.4, y: 62 } → { x: 21.5, y: 63.4 } → { x: 22, y: 65 } → { x: 22.6, y: 67 } →
{ x: 23.4, y: 67.5 } → { x: 24.6, y: 67.8 } → { x: 25.7, y: 67.8 } → { x: 26.6, y: 67.4 } →
{ x: 27.4, y: 66.1 } → { x: 28, y: 64.9 } → { x: 28.5, y: 64.1 } → { x: 29.4, y: 63.1 } →
{ x: 30.2, y: 62.6 } → { x: 30.2, y: 61.5 } → { x: 30.3, y: 59.9 } → { x: 30.2, y: 58.5 } →
{ x: 29.2, y: 57.8 } → { x: 27.7, y: 57.8 } → { x: 26.4, y: 57.5 } → { x: 25.3, y: 57.4 } →
{ x: 24.8, y: 56.6 } → { x: 23.5, y: 55.4 } → { x: 22.3, y: 53.8 } → { x: 21.9, y: 52.6 } →
{ x: 21.7, y: 51.5 } → { x: 18.2, y: 40.8 } → { x: 18.8, y: 42.9 } → { x: 19.2, y: 43.8 } →
{ x: 20.1, y: 45.3 } → { x: 20.7, y: 46.9 } → { x: 21, y: 48.6 } → { x: 21.3, y: 50.1 }
```

### River 4 (Central - connects to Eimgend area, y: 39-51)
Flows from (20.4, 41) east to (47.1, 50.5)
```
{ x: 20.4, y: 41 } → { x: 22.9, y: 40.9 } → { x: 24.3, y: 40.2 } → { x: 25.6, y: 39.6 } →
{ x: 27.3, y: 39.7 } → { x: 29.1, y: 39.7 } → { x: 30.8, y: 40.3 } → { x: 32.7, y: 40.9 } →
{ x: 34.3, y: 41.1 } → { x: 36, y: 41 } → { x: 38.2, y: 41.3 } → { x: 39.4, y: 41.9 } →
{ x: 40.4, y: 43.1 } → { x: 41.3, y: 44.2 } → { x: 42.2, y: 44.7 } → { x: 43.8, y: 45.1 } →
{ x: 44.7, y: 46.1 } → { x: 45.8, y: 47.6 } → { x: 46.4, y: 49.2 } → { x: 47.1, y: 50.5 }
```

### River 5 (Central-East - Braewood area, y: 16-45)
Major river from (61.3, 45.3) north to (45.7, 16.7)
```
{ x: 61.3, y: 45.3 } → { x: 61.7, y: 42.9 } → { x: 62.5, y: 42.7 } → { x: 64.8, y: 40.8 } →
{ x: 63.9, y: 41.4 } → { x: 66.5, y: 38.9 } → { x: 68.3, y: 37 } → { x: 69.1, y: 36.3 } →
{ x: 70.1, y: 35.2 } → { x: 70.8, y: 33.8 } → { x: 71.4, y: 31.7 } → { x: 70.6, y: 31 } →
{ x: 68.9, y: 31.4 } → { x: 67.3, y: 30.8 } → { x: 66.3, y: 31.3 } → { x: 65.1, y: 32.1 } →
{ x: 63.8, y: 32.1 } → { x: 62.2, y: 32.9 } → { x: 60.6, y: 31.9 } → { x: 59.7, y: 31.5 } →
{ x: 58.1, y: 31.4 } → { x: 57.6, y: 30.6 } → { x: 59.3, y: 28 } → { x: 58.3, y: 28.9 } →
{ x: 59.7, y: 25.8 } → { x: 59.9, y: 23.9 } → { x: 58.1, y: 22.9 } → { x: 56.8, y: 22.1 } →
{ x: 55.4, y: 21.8 } → { x: 54.6, y: 21.9 } → { x: 53.7, y: 21.8 } → { x: 52.7, y: 21.6 } →
{ x: 51.5, y: 21 } → { x: 50.1, y: 20.3 } → { x: 49, y: 19.9 } → { x: 46.9, y: 19 } →
{ x: 46.1, y: 17.6 } → { x: 45.7, y: 16.7 }
```

### River 6 (East - connects River 5 to eastern coast, y: 37-47)
Flows from (70.3, 37) east to (93.3, 46.2)
```
{ x: 70.3, y: 37 } → { x: 70.8, y: 38.5 } → { x: 71.4, y: 39.6 } → { x: 72.9, y: 40.1 } →
{ x: 73.6, y: 40.7 } → { x: 74.7, y: 41.7 } → { x: 75.9, y: 42.4 } → { x: 76.6, y: 42.9 } →
{ x: 78.7, y: 43.3 } → { x: 80.7, y: 44.2 } → { x: 82.9, y: 45.2 } → { x: 84.1, y: 45.7 } →
{ x: 85.6, y: 45.4 } → { x: 86.7, y: 44.4 } → { x: 87.9, y: 44.1 } → { x: 89.6, y: 45 } →
{ x: 90.7, y: 47.2 } → { x: 91.8, y: 47.4 } → { x: 93.3, y: 46.2 }
```

### River 7 (East - flows south from River 6, y: 46-81)
Flows from (83.1, 46.5) south to (86.5, 80.6)
```
{ x: 83.1, y: 46.5 } → { x: 82.7, y: 47.2 } → { x: 82.2, y: 48.3 } → { x: 81.7, y: 49.1 } →
{ x: 80.7, y: 50.1 } → { x: 80.5, y: 51.3 } → { x: 80.8, y: 51.8 } → { x: 81.8, y: 51.9 } →
{ x: 82.8, y: 52.4 } → { x: 83.5, y: 53.2 } → { x: 83.6, y: 54.2 } → { x: 83.6, y: 55.5 } →
{ x: 83.6, y: 57 } → { x: 83.7, y: 58.2 } → { x: 84.3, y: 59.3 } → { x: 84, y: 61.9 } →
{ x: 83.9, y: 63.8 } → { x: 83.7, y: 64.9 } → { x: 83.6, y: 66.6 } → { x: 84.1, y: 69.2 } →
{ x: 84.7, y: 70.5 } → { x: 85.1, y: 71.3 } → { x: 85.6, y: 72.4 } → { x: 85.9, y: 73.4 } →
{ x: 86.1, y: 74.8 } → { x: 86.1, y: 75.8 } → { x: 86.1, y: 77.3 } → { x: 86.2, y: 79.1 } →
{ x: 86.5, y: 80.6 }
```

### River 8 (Northeast - small river, y: 4-15)
Small river around (78-80, 4-15)
```
{ x: 78.7, y: 15.3 } → { x: 79.4, y: 14.9 } → { x: 79.9, y: 14.5 } → { x: 80.2, y: 13.7 } →
{ x: 79.9, y: 12.2 } → { x: 79.3, y: 11.4 } → { x: 79.1, y: 10.6 } → { x: 78.7, y: 9.8 } →
{ x: 78.1, y: 8.8 } → { x: 77.9, y: 7.2 } → { x: 77.8, y: 5.3 } → { x: 78.4, y: 4.2 } →
{ x: 78.2, y: 15.2 }
```

### River 9 (Central - small river near Eimgend, y: 27-30)
Small river from (34.2, 27.9) to (40.9, 28.3)
```
{ x: 34.2, y: 27.9 } → { x: 34.7, y: 28.6 } → { x: 35.3, y: 29.6 } → { x: 36.6, y: 30.4 } →
{ x: 37.2, y: 29.8 } → { x: 38.4, y: 29.1 } → { x: 39.6, y: 28.9 } → { x: 40.9, y: 28.3 }
```

### River 10 - LAVALTO LAKE (Central, y: 47-80)
**This is a LAKE, not a river** - roughly circular body of water
```
{ x: 49, y: 51.5 } → { x: 48.2, y: 52.2 } → { x: 47.4, y: 54.3 } → { x: 47.2, y: 57.5 } →
{ x: 46.7, y: 61.6 } → { x: 47, y: 59.5 } → { x: 46.9, y: 64 } → { x: 47.2, y: 65.3 } →
{ x: 47.7, y: 66.2 } → { x: 49, y: 67.6 } → { x: 50.7, y: 68.4 } → { x: 51.5, y: 70.4 } →
{ x: 52.3, y: 71.6 } → { x: 53, y: 74.2 } → { x: 53, y: 76.2 } → { x: 52.9, y: 79.3 } →
{ x: 54.3, y: 70.5 } → { x: 57, y: 69.8 } → { x: 60.1, y: 69.4 } → { x: 62, y: 67.9 } →
{ x: 62.7, y: 64.9 } → { x: 63.4, y: 62.8 } → { x: 64, y: 60 } → { x: 63.8, y: 56.5 } →
{ x: 63.7, y: 53.6 } → { x: 63, y: 51.3 } → { x: 61.7, y: 49.3 } → { x: 60.1, y: 47.6 } →
{ x: 58, y: 47.3 } → { x: 56.2, y: 47.3 } → { x: 54.5, y: 47.4 } → { x: 53, y: 47.7 } →
{ x: 51.6, y: 48.8 } → { x: 49.8, y: 50.2 }
```

---

## Kingdoms & Regions

### Kluimont (Northwest)
- **Rimduff Isles**: Archipelago between Aresphia and Eimgend - WATER AREA
  - Routes through here are VALID (e.g., ship-aresphia-eimgend)
- Kluimont City, Tarora, Aresphia, Erymont, Yuosburn, Ukrolis are all connected by water

### Braewood (East/Central)
- Major rivers connect:
  - Mortling → Eimgend (Kluimont River system)
  - Mortling → Dawerton → Flison → Agosron (river system)
  - Braewood City connected to river system
  - Adaham on river
- **River 5** runs through Braewood territory

### Islefield (Southwest)  
- Islefield City, Cok, Wrando, Agosgas connected by rivers/coast
- **River 2** connects this area to the coast

### Coast
- East Coast: Slada → Borugham → Ardismouth → Ioxyhull → Rens
- South Coast: Rens → Islefield → Cok → Agosgas

### Central Region
- **Lavalto Lake (River 10)**: Large central lake around coordinates (47-64, 47-80)
- **River 3** and **River 4** provide major water access through central lands

## What Is Water (Summary)
- **Lavalto Lake**: Central lake (x: 47-64, y: 47-80)
- **River 1**: Northwest (x: 4-13, y: 13-19)
- **River 2**: Southwest/Rens area (x: 8-30, y: 78-92)
- **River 3**: Central-West major system (x: 15-30, y: 40-78)
- **River 4**: Central connecting to lake (x: 20-47, y: 39-51)
- **River 5**: Central-East Braewood (x: 45-71, y: 16-45)
- **River 6**: Eastern connection to coast (x: 70-93, y: 37-47)
- **River 7**: Eastern north-south river (x: 80-86, y: 46-81)
- **River 8**: Northeast small (x: 77-80, y: 4-15)
- **River 9**: Central small near Eimgend (x: 34-41, y: 27-30)
- **Rimduff Isles**: Between Aresphia (9.2, 27.9) and Eimgend (28.2, 35.4)

---

## Routes I Removed But Should NOT Have
These were in the original correct routes:
- ship-vorton-eimgend
- ship-vorton-kluimont
- ship-vorton-slonmore
- ship-slonmore-eimgend
- ship-slonmore-kluimont
- ship-mortling-tarora
- ship-mortling-aresphia
- ship-braewood-tarora
- ship-braewood-aresphia
- ship-agosron-eimgend
- ship-agosron-kluimont
- ship-ajag-eimgend

## Coordinate Reference (% of map)
- Eimgend: x: 28.2, y: 35.4
- Kluimont City: x: 10.7, y: 12.9
- Aresphia: x: 9.2, y: 27.9
- Tarora: x: 18.5, y: 24.7
- Vorton: x: 43.9, y: 3.5
- Slonmore: x: 50.9, y: 27.1
- Mortling: x: 68.3, y: 40.5
- Braewood City: x: 80.2, y: 42.9
- Agosron: x: 50, y: 62.7
- Ajag: x: 39.8, y: 26.9
