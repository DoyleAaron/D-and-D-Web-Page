/**
 * DAYNER MAP SCALE REFERENCE
 * ==========================
 * This file provides scale calculations for the Dayner world map.
 * 
 * REFERENCE MEASUREMENTS (provided by DM):
 * ----------------------------------------
 * CAPITAL-TO-CAPITAL (most reliable):
 * 1. Islefield City to Braewood City: 330km
 * 2. Braewood City to Kluimont City: 368km
 * 3. Kluimont City to Islefield City: 272km
 * 
 * OTHER REFERENCES:
 * 4. Kadena to Rye: 40km (Grand Span bridge is 20km)
 * 5. Lavalto Lake top to bottom: 70km
 * 6. Rens to Slada (straight line): 312km
 * 7. Sheyton is ~20km from Lavalto Lake
 * 8. Gitstin is ~16km from Lavalto Lake
 */

const MAP_SCALE = {
  // Reference points with known distances
  referencePoints: {
    // PRIMARY REFERENCES - Capital to Capital
    islefieldToBraewood: {
      from: { name: 'Islefield City', x: 22.4, y: 83.1 },
      to: { name: 'Braewood City', x: 80.2, y: 42.9 },
      realDistanceKm: 330,
      percentDistance: 70.4, // sqrt((80.2-22.4)² + (42.9-83.1)²)
      impliedScale: 4.69,    // 330/70.4
      notes: 'Capital to capital - reliable'
    },
    braewoodToKluimont: {
      from: { name: 'Braewood City', x: 80.2, y: 42.9 },
      to: { name: 'Kluimont City', x: 10.7, y: 12.9 },
      realDistanceKm: 368,
      percentDistance: 75.7, // sqrt((10.7-80.2)² + (12.9-42.9)²)
      impliedScale: 4.86,    // 368/75.7
      notes: 'Capital to capital - reliable'
    },
    kluimontToIslefield: {
      from: { name: 'Kluimont City', x: 10.7, y: 12.9 },
      to: { name: 'Islefield City', x: 22.4, y: 83.1 },
      realDistanceKm: 272,
      percentDistance: 71.1, // sqrt((22.4-10.7)² + (83.1-12.9)²)
      impliedScale: 3.83,    // 272/71.1
      notes: 'Capital to capital - reliable'
    },
    // SECONDARY REFERENCES
    kadenaToRye: {
      from: { name: 'Kadena', x: 56.2, y: 74.3 },
      to: { name: 'Rye', x: 48.4, y: 74.5 },
      realDistanceKm: 40,
      notes: 'Grand Span bridge itself is 20km across the lake'
    },
    rensToSlada: {
      from: { name: 'Rens', x: 78.3, y: 87.9 },
      to: { name: 'Slada', x: 89.3, y: 6.3 },
      realDistanceKm: 312,
      notes: 'Longest reference - straight line across Braewood'
    },
    lavaltoHeight: {
      from: { name: 'Lavalto Lake Top', x: 55, y: 45 },
      to: { name: 'Lavalto Lake Bottom', x: 55, y: 73 },
      realDistanceKm: 70,
      notes: 'Vertical height of the ring lake'
    }
  },

  // Calculated scales from capital-to-capital references
  calculatedScales: {
    // Islefield to Braewood: 70.4% = 330km → 4.69 km/1%
    islefieldBraewoodScale: 4.69,
    // Braewood to Kluimont: 75.7% = 368km → 4.86 km/1%
    braewoodKluimontScale: 4.86,
    // Kluimont to Islefield: 71.1% = 272km → 3.83 km/1%
    kluimontIslefieldScale: 3.83,
    // Average of the three capital measurements
    capitalAverage: 4.46
  },

  // PRIMARY SCALE: Average of capital-to-capital measurements
  // (4.69 + 4.86 + 3.83) / 3 = 4.46 km per 1%
  primaryScale: 4.46, // km per 1% of map
  
  /**
   * Calculate straight-line distance between two points
   * @param {number} x1 - First point X coordinate (%)
   * @param {number} y1 - First point Y coordinate (%)
   * @param {number} x2 - Second point X coordinate (%)
   * @param {number} y2 - Second point Y coordinate (%)
   * @returns {number} Distance in kilometers
   */
  calculateDistance(x1, y1, x2, y2) {
    const percentDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return Math.round(percentDistance * this.primaryScale);
  },

  /**
   * Calculate distance between two named settlements
   * @param {string} from - Name of starting settlement
   * @param {string} to - Name of destination settlement
   * @returns {object} Distance info
   */
  distanceBetween(from, to) {
    const settlement1 = this.findSettlement(from);
    const settlement2 = this.findSettlement(to);
    
    if (!settlement1 || !settlement2) {
      return { error: 'Settlement not found' };
    }
    
    const percentDist = Math.sqrt(
      (settlement2.x - settlement1.x) ** 2 + 
      (settlement2.y - settlement1.y) ** 2
    );
    
    const km = Math.round(percentDist * this.primaryScale);
    
    return {
      from: settlement1.name,
      to: settlement2.name,
      percentDistance: percentDist.toFixed(2),
      straightLineKm: km,
      travelEstimate: {
        walking: `${Math.round(km / 25)} days (25km/day)`,
        horse: `${Math.round(km / 50)} days (50km/day)`,
        fastHorse: `${Math.round(km / 80)} days (80km/day)`
      }
    };
  },

  findSettlement(name) {
    const searchName = name.toLowerCase();
    for (const settlement of this.allSettlements) {
      if (settlement.name.toLowerCase().includes(searchName)) {
        return settlement;
      }
    }
    return null;
  },

  // All settlements with coordinates
  allSettlements: [
    // BRAEWOOD
    { name: 'Braewood City', kingdom: 'Braewood', x: 80.2, y: 42.9, type: 'capital' },
    { name: 'Eaveton', kingdom: 'Braewood', x: 76.9, y: 66.3, type: 'large-city' },
    { name: 'Mortling Stronghold', kingdom: 'Braewood', x: 68.3, y: 40.5, type: 'large-city' },
    { name: 'Phine', kingdom: 'Braewood', x: 53.8, y: 16.4, type: 'large-city' },
    { name: 'Barge', kingdom: 'Braewood', x: 71.5, y: 24.6, type: 'medium-city' },
    { name: 'Sheyton', kingdom: 'Braewood', x: 69.5, y: 53.3, type: 'medium-city' },
    { name: 'Strane', kingdom: 'Braewood', x: 46.5, y: 4.2, type: 'medium-city' },
    { name: 'Kadena', kingdom: 'Braewood', x: 56.2, y: 74.3, type: 'medium-city' },
    { name: 'Cleamond', kingdom: 'Braewood', x: 72.6, y: 46.1, type: 'town' },
    { name: 'Borugham', kingdom: 'Braewood', x: 75.9, y: 13.6, type: 'town' },
    { name: 'Ardismouth', kingdom: 'Braewood', x: 86.7, y: 32.5, type: 'town' },
    { name: 'Gitstin', kingdom: 'Braewood', x: 66.8, y: 69.6, type: 'town' },
    { name: 'Osegas', kingdom: 'Braewood', x: 71.2, y: 75.5, type: 'town' },
    { name: 'Yotherdon', kingdom: 'Braewood', x: 87.7, y: 15.3, type: 'town' },
    { name: 'Vorton', kingdom: 'Braewood', x: 43.9, y: 3.5, type: 'village' },
    { name: 'Slada', kingdom: 'Braewood', x: 89.3, y: 6.3, type: 'village' },
    { name: 'Adaham', kingdom: 'Braewood', x: 72.3, y: 36, type: 'village' },
    { name: 'Oyard', kingdom: 'Braewood', x: 91.4, y: 41, type: 'village' },
    { name: 'Ineross', kingdom: 'Braewood', x: 75.7, y: 53, type: 'village' },
    { name: 'Eimgend', kingdom: 'Braewood', x: 66.4, y: 57.7, type: 'village' },
    { name: 'Ioxyhull', kingdom: 'Braewood', x: 92.9, y: 60.1, type: 'village' },
    { name: 'Olkgend', kingdom: 'Braewood', x: 64.6, y: 73.7, type: 'village' },
    { name: 'Frore', kingdom: 'Braewood', x: 80.5, y: 80, type: 'village' },
    { name: 'Dalo', kingdom: 'Braewood', x: 74.1, y: 83, type: 'village' },
    { name: 'Trares', kingdom: 'Braewood', x: 65, y: 81.3, type: 'village' },
    { name: 'Rens', kingdom: 'Braewood', x: 78.3, y: 87.9, type: 'village' },
    
    // ISLEFIELD
    { name: 'Islefield City', kingdom: 'Islefield', x: 22.4, y: 83.1, type: 'capital' },
    { name: 'Rye', kingdom: 'Islefield', x: 48.4, y: 74.5, type: 'large-city' },
    { name: 'Esterhull', kingdom: 'Islefield', x: 26.2, y: 96.3, type: 'medium-city' },
    { name: 'Cheling', kingdom: 'Islefield', x: 14.9, y: 86.3, type: 'medium-city' },
    { name: 'Antstel', kingdom: 'Islefield', x: 40.8, y: 74.6, type: 'medium-city' },
    { name: 'Yhey', kingdom: 'Islefield', x: 32, y: 44.3, type: 'medium-city' },
    { name: 'Beyross', kingdom: 'Islefield', x: 10.9, y: 74.3, type: 'town' },
    { name: 'Halten', kingdom: 'Islefield', x: 35.7, y: 77.9, type: 'town' },
    { name: 'Avinin', kingdom: 'Islefield', x: 42.8, y: 68.8, type: 'town' },
    { name: 'Slido', kingdom: 'Islefield', x: 18.1, y: 58.9, type: 'town' },
    { name: 'Cok', kingdom: 'Islefield', x: 15.4, y: 81.7, type: 'village' },
    { name: 'Stanron', kingdom: 'Islefield', x: 25.9, y: 91.9, type: 'village', destroyed: true },
    { name: 'Ulsall', kingdom: 'Islefield', x: 15.4, y: 93.8, type: 'village' },
    { name: 'Praso', kingdom: 'Islefield', x: 22.8, y: 71.5, type: 'village' },
    { name: 'Eighwood', kingdom: 'Islefield', x: 32.6, y: 61, type: 'village' },
    { name: 'Wrando', kingdom: 'Islefield', x: 16.8, y: 63, type: 'village' },
    { name: 'Okcaster', kingdom: 'Islefield', x: 7.2, y: 56.8, type: 'village' },
    { name: 'Guatpool', kingdom: 'Islefield', x: 13.2, y: 52.3, type: 'village' },
    { name: 'Resross', kingdom: 'Islefield', x: 28.7, y: 41.8, type: 'village' },
    { name: 'Sable', kingdom: 'Islefield', x: 39.3, y: 44.7, type: 'village' },
    
    // KLUIMONT
    { name: 'Kluimont City', kingdom: 'Kluimont', x: 10.7, y: 12.9, type: 'capital' },
    { name: 'Eimgend (Kluimont)', kingdom: 'Kluimont', x: 28.2, y: 35.4, type: 'large-city' },
    { name: 'Qrey', kingdom: 'Kluimont', x: 7.8, y: 7, type: 'medium-city' },
    { name: 'Slonmore', kingdom: 'Kluimont', x: 50.9, y: 27.1, type: 'medium-city' },
    { name: 'Sord', kingdom: 'Kluimont', x: 45.3, y: 31.5, type: 'town' },
    { name: 'Tarora', kingdom: 'Kluimont', x: 18.5, y: 24.7, type: 'town' },
    { name: 'Lloy', kingdom: 'Kluimont', x: 20.1, y: 10.1, type: 'village', destroyed: true },
    { name: 'Aresphia', kingdom: 'Kluimont', x: 9.2, y: 27.9, type: 'village' },
    { name: 'Kilson', kingdom: 'Kluimont', x: 11, y: 29.5, type: 'village' },
    { name: 'Yuosburn', kingdom: 'Kluimont', x: 29.8, y: 14.4, type: 'village' },
    { name: 'Ukrolis', kingdom: 'Kluimont', x: 37.4, y: 13.6, type: 'village' },
    { name: 'Ajag', kingdom: 'Kluimont', x: 39.8, y: 26.9, type: 'village' },
    { name: 'Ansdale', kingdom: 'Kluimont', x: 47.9, y: 40.8, type: 'village' },
    { name: 'Klovine', kingdom: 'Kluimont', x: 36.2, y: 38.7, type: 'village' },
    
    // LAVALTO
    { name: 'Lavalto', kingdom: 'Lavalto', x: 55.7, y: 58.6, type: 'capital' }
  ],

  // Key geographic features with distances
  geographicFeatures: {
    lavaltoLake: {
      center: { x: 55.7, y: 58.6 },
      heightKm: 70,
      widthKm: 50, // estimated from proportions
      type: 'ring lake surrounding volcanic island'
    },
    grandSpan: {
      location: { x: 53, y: 75 },
      lengthKm: 20,
      connects: ['Kadena (Braewood)', 'Rye (Islefield)']
    },
    rimduffIsles: {
      center: { x: 12, y: 12 },
      contains: ['Kluimont City', 'Qrey', 'Lloy'],
      notes: 'Main island archipelago of Kluimont'
    }
  },

  // World dimensions (approximate)
  worldDimensions: {
    // Based on capital-to-capital average of 4.46 km per 1%
    fullMapWidthKm: Math.round(100 * 4.46),  // ~446km
    fullMapHeightKm: Math.round(100 * 4.46), // ~446km
    notes: 'The continent of Dayner is roughly 450km x 450km'
  }
};

// Quick distance lookup examples
const DISTANCE_EXAMPLES = {
  'Cleamond to Braewood City': MAP_SCALE.distanceBetween('Cleamond', 'Braewood City'),
  'Islefield City to Rye': MAP_SCALE.distanceBetween('Islefield City', 'Rye'),
  'Kluimont City to Braewood City': MAP_SCALE.distanceBetween('Kluimont City', 'Braewood City')
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MAP_SCALE, DISTANCE_EXAMPLES };
}
