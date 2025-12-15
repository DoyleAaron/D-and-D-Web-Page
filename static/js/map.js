/**
 * Interactive Map Module
 * Dayner D&D Website
 */

const MapModule = (function() {
  'use strict';

  // ========================================
  // SETTLEMENT DATA
  // ========================================
  const KINGDOMS = {
    braewood: {
      name: 'Braewood',
      color: '#e94560',
      description: 'Militaristic human-majority monarchy with the largest army',
      // Bounding box for focus view (x1, y1, x2, y2 as percentages)
      bounds: { x1: 43, y1: 0, x2: 95, y2: 90 },
      center: { x: 75, y: 45 }
    },
    islefield: {
      name: 'Islefield',
      color: '#4caf50',
      description: 'Elven-led wealthy kingdom focused on trade and diplomacy',
      bounds: { x1: 0, y1: 40, x2: 50, y2: 100 },
      center: { x: 22, y: 75 }
    },
    kluimont: {
      name: 'Kluimont',
      color: '#9c27b0',
      description: 'Secretive arcane island kingdom',
      bounds: { x1: 0, y1: 0, x2: 60, y2: 45 },
      center: { x: 25, y: 22 }
    },
    lavalto: {
      name: 'Lavalto',
      color: '#ff5722',
      description: 'Independent volcanic isle, rumored to be vampire-ruled',
      bounds: { x1: 48, y1: 45, x2: 62, y2: 68 },
      center: { x: 55, y: 55 }
    }
  };

  // Settlement data with coordinates (percentages of map image)
  // Coordinates updated from marker-tool measurements
  const SETTLEMENTS = {
    braewood: {
      capitals: [
        {
          id: 'braewood-city',
          name: 'Braewood City',
          type: 'capital',
          population: 220000,
          leader: 'King Tarvin Braeden IV',
          leaderTitle: 'King of Braewood',
          wealth: 5,
          military: 5,
          happiness: 4,
          description: 'The grand capital of Braewood, seat of King Tarvin Braeden IV. A massive walled city that serves as the military, political, and economic heart of the kingdom.',
          file: 'Kingdoms/Braewood/Capital/Braewood City.md',
          x: 80.2, y: 42.9
        }
      ],
      largeCities: [
        {
          id: 'eaveton',
          name: 'Eaveton',
          type: 'large-city',
          population: 95000,
          leader: 'Lord-Regent Hallovar Greythorne',
          leaderTitle: 'Lord-Regent',
          wealth: 4,
          military: 4,
          happiness: 3.5,
          description: 'A major administrative hub in southern Braewood, known for its merchant courts and strategic position.',
          file: 'Kingdoms/Braewood/Large Cities/Eaveton.md',
          x: 76.9, y: 66.3
        },
        {
          id: 'mortling-stronghold',
          name: 'Mortling Stronghold',
          type: 'large-city',
          population: 80000,
          leader: 'Lord-Marshal Caelric Ironward',
          leaderTitle: 'Lord-Marshal',
          wealth: 3.5,
          military: 5,
          happiness: 3,
          description: 'The military heart of Braewood, home to the War College and the kingdom\'s largest standing garrison.',
          file: 'Kingdoms/Braewood/Large Cities/Mortling Stronghold.md',
          x: 68.3, y: 40.5
        },
        {
          id: 'phine',
          name: 'Phine',
          type: 'large-city',
          population: 90000,
          leader: 'Lord-Governor Callum Westmarch',
          leaderTitle: 'Lord-Governor',
          wealth: 4.5,
          military: 3.5,
          happiness: 4,
          description: 'A prosperous bridge city controlling vital crossings, known for trade and diplomacy with Kluimont.',
          file: 'Kingdoms/Braewood/Large Cities/Phine.md',
          x: 53.8, y: 16.4
        }
      ],
      mediumCities: [
        {
          id: 'barge',
          name: 'Barge',
          type: 'medium-city',
          population: 14000,
          leader: 'Magistrate Vorn Hallas',
          leaderTitle: 'Magistrate',
          wealth: 3.5,
          military: 4.5,
          happiness: 2.5,
          description: 'Northern checkpoint city guarding the Iron Gate. A hard frontier town with strong dwarven influence.',
          file: 'Kingdoms/Braewood/Medium City/Barge.md',
          x: 71.5, y: 24.6
        },
        {
          id: 'sheyton',
          name: 'Sheyton',
          type: 'medium-city',
          population: 22000,
          leader: 'Lord-Mayor Vellan Harcrow',
          leaderTitle: 'Lord-Mayor',
          wealth: 4.5,
          military: 3.5,
          happiness: 3,
          description: 'Major trade crossroads between the capital and southern settlements. Home to the mysterious Red Scarves.',
          file: 'Kingdoms/Braewood/Medium City/Sheyton.md',
          x: 69.5, y: 53.3
        },
        {
          id: 'strane',
          name: 'Strane',
          type: 'medium-city',
          population: 11000,
          leader: 'Lord-Warden Cassian Velthorpe',
          leaderTitle: 'Lord-Warden',
          wealth: 3,
          military: 3,
          happiness: 3.5,
          description: 'Peninsula hub on Lake Strane with ancient Tharnic ruins. Home to the Arcanist\'s Lodge.',
          file: 'Kingdoms/Braewood/Medium City/Strane.md',
          x: 46.5, y: 4.2
        },
        {
          id: 'kadena',
          name: 'Kadena',
          type: 'medium-city',
          population: 28000,
          leader: 'Bridge-Warden Elara Thornguard',
          leaderTitle: 'Bridge-Warden',
          wealth: 5,
          military: 4,
          happiness: 4,
          description: 'The largest medium city, home to the Grand Span bridge. A joint Crown administration with Islefield.',
          file: 'Kingdoms/Braewood/Medium City/Kadena.md',
          x: 56.2, y: 74.3
        }
      ],
      towns: [
        {
          id: 'cleamond',
          name: 'Cleamond',
          type: 'town',
          population: 12000,
          leader: 'Warden-Mayor Lysa Thorne',
          leaderTitle: 'Warden-Mayor',
          wealth: 3.5,
          military: 3,
          happiness: 4,
          description: 'Trade crossroads on the Golden Route, known for its lantern tradition and River Vael ferries.',
          file: 'Kingdoms/Braewood/Town/Cleamond.md',
          x: 72.6, y: 46.1
        },
        {
          id: 'borugham',
          name: 'Borugham',
          type: 'town',
          population: 3200,
          leader: 'Thane Aldric Borugh',
          leaderTitle: 'Thane',
          wealth: 3,
          military: 2.5,
          happiness: 2.5,
          description: 'Insular dwarven town with hereditary leadership. Known for xenophobia and old customs.',
          file: 'Kingdoms/Braewood/Town/Borugham.md',
          x: 75.9, y: 13.6
        },
        {
          id: 'ardismouth',
          name: 'Ardismouth',
          type: 'town',
          population: 4200,
          leader: 'Portreeve Garrett Dunholm',
          leaderTitle: 'Portreeve',
          wealth: 3,
          military: 2.5,
          happiness: 2,
          description: 'Coastal trade town with rising dwarven nationalist tensions. Gateway to Yotherdon.',
          file: 'Kingdoms/Braewood/Town/Ardismouth.md',
          x: 86.7, y: 32.5
        },
        {
          id: 'gitstin',
          name: 'Gitstin',
          type: 'town',
          population: 5200,
          leader: 'Reeve Arton Fellmark',
          leaderTitle: 'Reeve',
          wealth: 3.5,
          military: 3,
          happiness: 4,
          description: 'Connector town between Kadena and Eaveton. Known for its hospitality and the Seven Bells Inn.',
          file: 'Kingdoms/Braewood/Town/Gitstin.md',
          x: 66.8, y: 69.6
        },
        {
          id: 'osegas',
          name: 'Osegas',
          type: 'town',
          population: 4000,
          leader: 'High Steward Merylla Davross',
          leaderTitle: 'High Steward',
          wealth: 2.5,
          military: 2,
          happiness: 4.5,
          description: 'Heart of the south, religious pilgrimage hub. Protected four nearby villages during the Plague Years.',
          file: 'Kingdoms/Braewood/Town/Osegas.md',
          x: 71.2, y: 75.5
        },
        {
          id: 'yotherdon',
          name: 'Yotherdon',
          type: 'town',
          population: 4800,
          leader: 'High Elder Korrin Steelhand',
          leaderTitle: 'High Elder',
          wealth: 4,
          military: 3,
          happiness: 3,
          description: 'Dwarven mining town with elected leadership. Rich iron and copper deposits.',
          file: 'Kingdoms/Braewood/Town/Yotherdon.md',
          x: 87.7, y: 15.3
        }
      ],
      villages: [
        {
          id: 'vorton',
          name: 'Vorton',
          type: 'village',
          population: 1200,
          leader: 'Harbormaster Edric Salthollow',
          leaderTitle: 'Harbormaster',
          wealth: 2,
          military: 1.5,
          happiness: 3,
          description: 'Westernmost village on the northern peninsula. Ancient Tharnic watchtower overlooks mysterious eastern lights.',
          file: 'Kingdoms/Braewood/Village/Vorton.md',
          x: 43.9, y: 3.5
        },
        {
          id: 'slada',
          name: 'Slada',
          type: 'village',
          population: 900,
          leader: 'Elder Grunhild Chainbreaker',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 2,
          happiness: 3.5,
          description: 'Extreme dwarven republican village on the coastal heel. Seven generations of Chainbreaker leadership.',
          file: 'Kingdoms/Braewood/Village/Slada.md',
          x: 89.3, y: 6.3
        },
        {
          id: 'adaham',
          name: 'Adaham',
          type: 'village',
          population: 1100,
          leader: 'Harbor-Warden Colm Ravencroft',
          leaderTitle: 'Harbor-Warden',
          wealth: 2.5,
          military: 3,
          happiness: 2.5,
          description: 'Ghost docks village housing elite Crown sailors. Strategic river split location.',
          file: 'Kingdoms/Braewood/Village/Adaham.md',
          x: 72.3, y: 36
        },
        {
          id: 'oyard',
          name: 'Oyard',
          type: 'village',
          population: 900,
          leader: 'Warden-Captain Halvard Grimstone',
          leaderTitle: 'Warden-Captain',
          wealth: 1.5,
          military: 4,
          happiness: 1.5,
          description: 'Isolated prison village holding Debourg survivors. The mad Prisoner 7 whispers of ancient horrors.',
          file: 'Kingdoms/Braewood/Village/Oyard.md',
          x: 91.4, y: 41
        },
        {
          id: 'ineross',
          name: 'Ineross',
          type: 'village',
          population: 340,
          leader: 'Elder Mira Fell',
          leaderTitle: 'Elder (Compromised)',
          wealth: 1,
          military: 0.5,
          happiness: 1,
          description: 'Horror village with standing stones. Something ancient claims the villagers one by one.',
          file: 'Kingdoms/Braewood/Village/Ineross.md',
          x: 75.7, y: 53
        },
        {
          id: 'eimgend',
          name: 'Eimgend',
          type: 'village',
          population: 950,
          leader: 'Watch-Keeper Jareth Dunwald',
          leaderTitle: 'Watch-Keeper',
          wealth: 2,
          military: 3,
          happiness: 3,
          description: 'Crown surveillance village watching Lavalto Lake. Signal fires report directly to the Queen.',
          file: 'Kingdoms/Braewood/Village/Eimgend.md',
          x: 66.4, y: 57.7
        },
        {
          id: 'ioxyhull',
          name: 'Ioxyhull',
          type: 'village',
          population: 820,
          leader: 'Knight-Commander Cedric Hallam',
          leaderTitle: 'Knight-Commander',
          wealth: 2.5,
          military: 4,
          happiness: 3.5,
          description: 'The Queen\'s Escape - a knight training village that always has a ship ready for royal evacuation.',
          file: 'Kingdoms/Braewood/Village/Ioxyhull.md',
          x: 92.9, y: 60.1
        },
        {
          id: 'olkgend',
          name: 'Olkgend',
          type: 'village',
          population: 2000,
          leader: 'Drill-Master Vance Korrath',
          leaderTitle: 'Drill-Master',
          wealth: 2,
          military: 4.5,
          happiness: 3,
          description: 'Military training village supplying Span Wardens for the Grand Span bridge.',
          file: 'Kingdoms/Braewood/Village/Olkgend.md',
          x: 64.6, y: 73.7
        },
        {
          id: 'frore',
          name: 'Frore',
          type: 'village',
          population: 850,
          leader: 'Root-Mother Yseult Greenbough',
          leaderTitle: 'Root-Mother',
          wealth: 2,
          military: 1,
          happiness: 4.5,
          description: 'Herbalism and healing village with the Root-Mother tradition. Saved by Osegas during the Plague Years.',
          file: 'Kingdoms/Braewood/Village/Frore.md',
          x: 80.5, y: 80
        },
        {
          id: 'dalo',
          name: 'Dalo',
          type: 'village',
          population: 950,
          leader: 'Headman Cotter Marsh',
          leaderTitle: 'Headman',
          wealth: 2,
          military: 1.5,
          happiness: 3.5,
          description: 'Fishing and salt village on the coast. Saved by Osegas during the Plague Years.',
          file: 'Kingdoms/Braewood/Village/Dalo.md',
          x: 74.1, y: 83
        },
        {
          id: 'trares',
          name: 'Trares',
          type: 'village',
          population: 1100,
          leader: 'Elder Maeven Shawl',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Shepherding and wool village with the Gratitude Stone commemorating Osegas\'s aid.',
          file: 'Kingdoms/Braewood/Village/Trares.md',
          x: 65, y: 81.3
        },
        {
          id: 'rens',
          name: 'Rens',
          type: 'village',
          population: 1100,
          leader: 'Harbor-Elder Brennan Cole',
          leaderTitle: 'Harbor-Elder',
          wealth: 2,
          military: 2,
          happiness: 3.5,
          description: 'Southernmost village in Braewood, end of the road. Saved by Osegas during the Plague Years.',
          file: 'Kingdoms/Braewood/Village/Rens.md',
          x: 78.3, y: 87.9
        }
      ],
      pois: [
        {
          id: 'grand-span',
          name: 'The Grand Span',
          type: 'poi',
          description: 'Ancient Tharnic bridge spanning the Vael, originally called Pontem inter Mundos. The largest bridge in Dayner.',
          file: 'Kingdoms/Braewood/POI/The Grand Span.md',
          x: 53, y: 75.1
        },
        {
          id: 'buchrior-hollows',
          name: 'Buchrior Hollows',
          type: 'poi',
          description: 'Ancient dwarven tomb complex in the northern mountains, guarded by Keeper Thana Ironvow.',
          file: 'Kingdoms/Braewood/POI/Buchrior Hollows.md',
          x: 83.4, y: 8.8
        },
        {
          id: 'debourg-grotto',
          name: 'Debourg Grotto',
          type: 'poi',
          description: 'Sealed underground complex where something terrible happened. Survivors imprisoned in Oyard.',
          file: 'Kingdoms/Braewood/POI/Debourg Grotto.md',
          x: 81.6, y: 26.1
        },
        {
          id: 'meriver-mountains',
          name: 'Meriver Mountains',
          type: 'poi',
          description: 'Northern mountain range rich in iron and precious metals. Dwarven mining heartland.',
          file: 'Kingdoms/Braewood/POI/Meriver Mountains.md',
          x: 91.8, y: 13
        },
        {
          id: 'plalisle-den',
          name: 'Plalisle Den',
          type: 'poi',
          description: 'Mysterious cavern system in the eastern hills. Rumors of strange creatures within.',
          file: 'Kingdoms/Braewood/POI/Plalisle Den.md',
          x: 62.8, y: 5.8
        },
        {
          id: 'wynlants-cavity',
          name: 'Wynlants Cavity',
          type: 'poi',
          description: 'Deep sinkhole in the central plains, said to connect to underground rivers.',
          file: 'Kingdoms/Braewood/POI/Wynlants Cavity.md',
          x: 71.3, y: 7.2
        }
      ]
    },
    islefield: {
      capitals: [
        {
          id: 'islefield-city',
          name: 'Islefield City',
          type: 'capital',
          population: 200000,
          leader: 'Queen Atheliana Aeristel',
          leaderTitle: 'Queen of Islefield',
          wealth: 5,
          military: 3.5,
          happiness: 4.5,
          description: 'The elegant elven capital, known for its soaring architecture, grand libraries, and diplomatic influence.',
          file: 'Kingdoms/Islefield/Capital/Islefield City.md',
          x: 22.4, y: 83.1
        }
      ],
      largeCities: [
        {
          id: 'rye',
          name: 'Rye',
          type: 'large-city',
          population: 105000,
          leader: 'Unknown',
          leaderTitle: 'Governor',
          wealth: 4.5,
          military: 3,
          happiness: 4,
          description: 'Major bridge city on the Islefield side of the Grand Span. Twin to Kadena.',
          file: 'Kingdoms/Islefield/Large Cities/Rye.md',
          x: 48.4, y: 74.5
        }
      ],
      mediumCities: [
        {
          id: 'esterhull',
          name: 'Esterhull',
          type: 'medium-city',
          population: 14000,
          leader: 'Unknown',
          leaderTitle: 'Port Master',
          wealth: 4,
          military: 3,
          happiness: 3.5,
          description: 'Southern port city, major maritime trade hub.',
          file: 'Kingdoms/Islefield/Medium Cities/Esterhull.md',
          x: 26.2, y: 96.3
        },
        {
          id: 'cheling',
          name: 'Cheling',
          type: 'medium-city',
          population: 12000,
          leader: 'Unknown',
          leaderTitle: 'Trade Master',
          wealth: 4,
          military: 2.5,
          happiness: 4,
          description: 'Inland trade hub known for craft markets and merchant guilds.',
          file: 'Kingdoms/Islefield/Medium Cities/Cheling.md',
          x: 14.9, y: 86.3
        },
        {
          id: 'antstel',
          name: 'Antstel',
          type: 'medium-city',
          population: 10000,
          leader: 'Unknown',
          leaderTitle: 'Archscribe',
          wealth: 3.5,
          military: 2,
          happiness: 4,
          description: 'City of elven scribes and scholars, home to great archives.',
          file: 'Kingdoms/Islefield/Medium Cities/Antstel.md',
          x: 40.8, y: 74.6
        },
        {
          id: 'yhey',
          name: 'Yhey',
          type: 'medium-city',
          population: 9000,
          leader: 'Unknown',
          leaderTitle: 'Border Warden',
          wealth: 3,
          military: 3.5,
          happiness: 3,
          description: 'Border city near the desert regions, guards against southern threats.',
          file: 'Kingdoms/Islefield/Medium Cities/Yhey.md',
          x: 32, y: 44.3
        }
      ],
      towns: [
        {
          id: 'beyross',
          name: 'Beyross',
          type: 'town',
          population: 3500,
          leader: 'Unknown',
          leaderTitle: 'Town Elder',
          wealth: 3,
          military: 2.5,
          happiness: 4,
          description: 'Coastal town with fishing traditions and scenic harbors.',
          file: null,
          x: 10.9, y: 74.3
        },
        {
          id: 'halten',
          name: 'Halten',
          type: 'town',
          population: 4200,
          leader: 'Unknown',
          leaderTitle: 'Mayor',
          wealth: 3.5,
          military: 2,
          happiness: 4,
          description: 'Market town known for agricultural trade and festivals.',
          file: null,
          x: 35.7, y: 77.9
        },
        {
          id: 'avinin',
          name: 'Avinin',
          type: 'town',
          population: 3800,
          leader: 'Unknown',
          leaderTitle: 'Town Warden',
          wealth: 3,
          military: 3,
          happiness: 3.5,
          description: 'Town near the Grand Span, serves as waypoint for travelers.',
          file: null,
          x: 42.8, y: 68.8
        },
        {
          id: 'slido',
          name: 'Slido',
          type: 'town',
          population: 2800,
          leader: 'Unknown',
          leaderTitle: 'Reeve',
          wealth: 2.5,
          military: 2,
          happiness: 4,
          description: 'Quiet lakeside town with elven heritage.',
          file: null,
          x: 18.1, y: 58.9
        }
      ],
      villages: [
        {
          id: 'cok',
          name: 'Cok',
          type: 'village',
          population: 800,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Small fishing village on the coast.',
          file: null,
          x: 15.4, y: 81.7
        },
        {
          id: 'stanron',
          name: 'Stanron (Destroyed)',
          type: 'village',
          population: 0,
          leader: 'None',
          leaderTitle: 'Abandoned',
          wealth: 0,
          military: 0,
          happiness: 0,
          description: 'Destroyed village, now ruins. Once a thriving settlement.',
          file: null,
          x: 25.9, y: 91.9
        },
        {
          id: 'ulsall',
          name: 'Ulsall',
          type: 'village',
          population: 650,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1.5,
          happiness: 3.5,
          description: 'Southern coastal village with fishing traditions.',
          file: null,
          x: 15.4, y: 93.8
        },
        {
          id: 'praso',
          name: 'Praso',
          type: 'village',
          population: 720,
          leader: 'Unknown',
          leaderTitle: 'Headman',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Woodland village known for herbalism.',
          file: null,
          x: 22.8, y: 71.5
        },
        {
          id: 'eighwood',
          name: 'Eighwood',
          type: 'village',
          population: 550,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Forest village surrounded by ancient trees.',
          file: null,
          x: 32.6, y: 61
        },
        {
          id: 'wrando',
          name: 'Wrando',
          type: 'village',
          population: 480,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 1.5,
          military: 1,
          happiness: 3.5,
          description: 'Remote village near the western coast.',
          file: null,
          x: 16.8, y: 63
        },
        {
          id: 'okcaster',
          name: 'Okcaster',
          type: 'village',
          population: 600,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1.5,
          happiness: 3.5,
          description: 'Coastal village with a small harbor.',
          file: null,
          x: 7.2, y: 56.8
        },
        {
          id: 'guatpool',
          name: 'Guatpool',
          type: 'village',
          population: 520,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Village by a natural pool, known for its mineral springs.',
          file: null,
          x: 13.2, y: 52.3
        },
        {
          id: 'resross',
          name: 'Resross',
          type: 'village',
          population: 680,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2.5,
          military: 1.5,
          happiness: 4,
          description: 'Crossroads village near the Kluimont border.',
          file: null,
          x: 28.7, y: 41.8
        },
        {
          id: 'sable',
          name: 'Sable',
          type: 'village',
          population: 590,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Quiet village in the central woodlands.',
          file: null,
          x: 39.3, y: 44.7
        }
      ],
      pois: [
        {
          id: 'prairie-kingfisher-grove',
          name: 'Prairie Kingfisher Grove',
          type: 'poi',
          description: 'Sacred grove known for its vibrant kingfisher population and elven shrines.',
          file: null,
          x: 20.3, y: 91.9
        },
        {
          id: 'parrneau-hollow',
          name: 'Parrneau Hollow',
          type: 'poi',
          description: 'Mysterious hollow with ancient stone circles and druidic connections.',
          file: null,
          x: 5.3, y: 74.1
        },
        {
          id: 'iroware-heights',
          name: 'Iroware Heights',
          type: 'poi',
          description: 'Elevated plateau with panoramic views and old watchtowers.',
          file: null,
          x: 20.6, y: 47.8
        },
        {
          id: 'shercam-woods',
          name: 'Shercam Woods',
          type: 'poi',
          description: 'Dense forest with ancient trees and rumored fey inhabitants.',
          file: null,
          x: 39.8, y: 54
        }
      ]
    },
    kluimont: {
      capitals: [
        {
          id: 'kluimont-city',
          name: 'Kluimont City',
          type: 'capital',
          population: 180000,
          leader: 'High Archon Lysanthe Kilmora',
          leaderTitle: 'High Archon',
          wealth: 4,
          military: 4,
          happiness: 3,
          description: 'The secretive arcane capital, shrouded in magical mists. Home to the Archon\'s Tower.',
          file: 'Kingdoms/Kluimont/Capital/Kluimont City.md',
          x: 10.7, y: 12.9
        }
      ],
      largeCities: [
        {
          id: 'eimgend-city',
          name: 'Eimgend',
          type: 'large-city',
          population: 75000,
          leader: 'Unknown',
          leaderTitle: 'Archmage',
          wealth: 4,
          military: 3.5,
          happiness: 3.5,
          description: 'Major city of Kluimont, known for its arcane academies.',
          file: null,
          x: 28.2, y: 35.4
        }
      ],
      mediumCities: [
        {
          id: 'qrey',
          name: 'Qrey',
          type: 'medium-city',
          population: 12000,
          leader: 'Unknown',
          leaderTitle: 'Magister',
          wealth: 3.5,
          military: 3,
          happiness: 3,
          description: 'Northern city near the capital with strong magical traditions.',
          file: null,
          x: 7.8, y: 7
        },
        {
          id: 'slonmore',
          name: 'Slonmore',
          type: 'medium-city',
          population: 15000,
          leader: 'Unknown',
          leaderTitle: 'Warden',
          wealth: 3,
          military: 3.5,
          happiness: 3,
          description: 'Eastern border city guarding approaches to Kluimont.',
          file: null,
          x: 50.9, y: 27.1
        }
      ],
      towns: [
        {
          id: 'sord',
          name: 'Sord',
          type: 'town',
          population: 3200,
          leader: 'Unknown',
          leaderTitle: 'Town Mage',
          wealth: 3,
          military: 2.5,
          happiness: 3.5,
          description: 'Central town with a notable mage tower.',
          file: null,
          x: 45.3, y: 31.5
        },
        {
          id: 'tarora',
          name: 'Tarora',
          type: 'town',
          population: 2800,
          leader: 'Unknown',
          leaderTitle: 'Steward',
          wealth: 2.5,
          military: 2,
          happiness: 4,
          description: 'Peaceful town known for its orchards and quiet life.',
          file: null,
          x: 18.5, y: 24.7
        }
      ],
      villages: [
        {
          id: 'lloy',
          name: 'Lloy (Destroyed)',
          type: 'village',
          population: 0,
          leader: 'None',
          leaderTitle: 'Abandoned',
          wealth: 0,
          military: 0,
          happiness: 0,
          description: 'Destroyed village, now in ruins. The cause of its destruction remains a mystery.',
          file: null,
          x: 20.1, y: 10.1
        },
        {
          id: 'aresphia',
          name: 'Aresphia',
          type: 'village',
          population: 450,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Small village with herbal gardens and healers.',
          file: null,
          x: 9.2, y: 27.9
        },
        {
          id: 'kilson',
          name: 'Kilson',
          type: 'village',
          population: 520,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1.5,
          happiness: 3.5,
          description: 'Mining village extracting rare minerals.',
          file: null,
          x: 11, y: 29.5
        },
        {
          id: 'yuosburn',
          name: 'Yuosburn',
          type: 'village',
          population: 680,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2.5,
          military: 1,
          happiness: 4,
          description: 'Farming village with fertile lands.',
          file: null,
          x: 29.8, y: 14.4
        },
        {
          id: 'ukrolis',
          name: 'Ukrolis',
          type: 'village',
          population: 590,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Forest village with woodworking traditions.',
          file: null,
          x: 37.4, y: 13.6
        },
        {
          id: 'ajag',
          name: 'Ajag',
          type: 'village',
          population: 420,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 3.5,
          description: 'Remote village on the plains.',
          file: null,
          x: 39.8, y: 26.9
        },
        {
          id: 'ansdale',
          name: 'Ansdale',
          type: 'village',
          population: 550,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2.5,
          military: 1.5,
          happiness: 4,
          description: 'Valley village with scenic surroundings.',
          file: null,
          x: 47.9, y: 40.8
        },
        {
          id: 'klovine',
          name: 'Klovine',
          type: 'village',
          population: 480,
          leader: 'Unknown',
          leaderTitle: 'Elder',
          wealth: 2,
          military: 1,
          happiness: 4,
          description: 'Eastern village near the border with Braewood.',
          file: null,
          x: 56.4, y: 38.3
        }
      ],
      pois: [
        {
          id: 'tempawa-forest',
          name: 'Tempawa Forest',
          type: 'poi',
          description: 'Ancient magical forest with strange phenomena and arcane ley lines.',
          file: null,
          x: 6.1, y: 12.6
        },
        {
          id: 'rimduff-isles',
          name: 'Rimduff Isles',
          type: 'poi',
          description: 'Mysterious islands with ancient ruins and magical artifacts.',
          file: null,
          x: 26.6, y: 25.2
        },
        {
          id: 'erymont',
          name: 'Erymont',
          type: 'poi',
          description: 'Northern mountain with rumored dragon sightings.',
          file: null,
          x: 26.4, y: 4.3
        },
        {
          id: 'the-flat-den',
          name: 'The Flat Den',
          type: 'poi',
          description: 'Unusual flat region with underground caves.',
          file: null,
          x: 36.6, y: 34
        },
        {
          id: 'gray-toad-woods',
          name: 'Gray Toad Woods',
          type: 'poi',
          description: 'Dense forest named for its abundant toad population, used for alchemical ingredients.',
          file: null,
          x: 65.1, y: 34.6
        },
        {
          id: 'the-graveyard-arcana',
          name: 'The Graveyard Arcana',
          type: 'poi',
          description: 'Ancient burial ground with powerful magical residue and forbidden knowledge.',
          file: null,
          x: 16.1, y: 10.4
        }
      ]
    },
    lavalto: {
      capitals: [],
      largeCities: [
        {
          id: 'dawerton',
          name: 'Dawerton',
          type: 'large-city',
          population: 85000,
          leader: 'Lord Adrian Silwynn',
          leaderTitle: 'Lord of Lavalto',
          wealth: 3.5,
          military: 4,
          happiness: 2,
          description: 'The dark heart of Lavalto, secretly ruled by vampires. Blood taxes fund eternal night.',
          file: 'Kingdoms/Lavalto/Large Cities/Dawerton.md',
          x: 58.8, y: 52.7
        }
      ],
      mediumCities: [
        {
          id: 'flison',
          name: 'Flison',
          type: 'medium-city',
          population: 12000,
          leader: 'Unknown',
          leaderTitle: 'Mayor',
          wealth: 3,
          military: 3,
          happiness: 2.5,
          description: 'Secondary city of Lavalto, under the shadow of the volcano.',
          file: null,
          x: 51.7, y: 52.9
        }
      ],
      towns: [
        {
          id: 'agosron',
          name: 'Agosron',
          type: 'town',
          population: 2500,
          leader: 'Unknown',
          leaderTitle: 'Overseer',
          wealth: 2.5,
          military: 2.5,
          happiness: 2,
          description: 'Southern town near the volcano, known for obsidian mining.',
          file: null,
          x: 50, y: 62.7
        }
      ],
      villages: [],
      pois: [
        {
          id: 'lavalto-volcano',
          name: 'Lavalto Volcano',
          type: 'poi',
          description: 'Active volcano at the heart of Lavalto Island. Source of both fear and obsidian wealth.',
          file: null,
          x: 55, y: 60.1
        },
        {
          id: 'lavalto-lake',
          name: 'Lavalto Lake',
          type: 'poi',
          description: 'Volcanic lake with hot springs and rumored mystical properties.',
          file: null,
          x: 56.8, y: 47.1
        },
        {
          id: 'darford-cavity',
          name: 'Darford Cavity',
          type: 'poi',
          description: 'Deep underground cavern system with volcanic vents and ancient ruins.',
          file: null,
          x: 54.7, y: 50.4
        }
      ]
    }
  };

  // ========================================
  // STATE
  // ========================================
  let currentKingdom = 'all'; // Start with all kingdoms visible
  let currentSettlement = null;
  let mapScale = 1;
  let mapX = 0;
  let mapY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  // ========================================
  // DOM ELEMENTS
  // ========================================
  let mapContainer, mapWrapper, mapImage, settlementPanel;

  // ========================================
  // INITIALIZATION
  // ========================================
  function init() {
    mapContainer = document.getElementById('map-container');
    mapWrapper = document.getElementById('map-wrapper');
    mapImage = document.getElementById('map-image');
    settlementPanel = document.getElementById('settlement-panel');

    if (!mapContainer) return;

    setupRegionTabs();
    setupMapControls();
    setupMapInteraction();
    renderSettlements();
    updateSettlementList();
  }

  // ========================================
  // REGION TABS
  // ========================================
  function setupRegionTabs() {
    const tabs = document.querySelectorAll('.region-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const kingdom = tab.dataset.kingdom;
        if (kingdom === currentKingdom) return;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentKingdom = kingdom;
        
        closePanel();
        renderSettlements();
        updateSettlementList();
        focusOnKingdom(kingdom);
      });
    });
  }

  // ========================================
  // FOCUS ON KINGDOM
  // ========================================
  function focusOnKingdom(kingdomId) {
    // If "all", reset to full world view
    if (kingdomId === 'all') {
      resetView();
      return;
    }
    
    const kingdom = KINGDOMS[kingdomId];
    if (!kingdom || !kingdom.bounds || !mapContainer) return;

    const bounds = kingdom.bounds;
    const containerRect = mapContainer.getBoundingClientRect();
    
    // Calculate the center of the kingdom bounds
    const centerX = (bounds.x1 + bounds.x2) / 2;
    const centerY = (bounds.y1 + bounds.y2) / 2;
    
    // Calculate the size of the kingdom region
    const boundsWidth = bounds.x2 - bounds.x1;
    const boundsHeight = bounds.y2 - bounds.y1;
    
    // Calculate scale to fit the kingdom with some padding
    const padding = 0.15; // 15% padding
    const scaleX = containerRect.width / (containerRect.width * (boundsWidth / 100) * (1 + padding));
    const scaleY = containerRect.height / (containerRect.height * (boundsHeight / 100) * (1 + padding));
    
    // Use the smaller scale to ensure the kingdom fits
    mapScale = Math.min(scaleX, scaleY, 2.5); // Cap at 2.5x zoom
    mapScale = Math.max(mapScale, 0.8); // Minimum 0.8x zoom
    
    // Calculate pan to center the kingdom
    // The map is positioned from its center, so we need to offset
    const mapWidth = mapImage ? mapImage.naturalWidth || mapImage.width : containerRect.width;
    const mapHeight = mapImage ? mapImage.naturalHeight || mapImage.height : containerRect.height;
    
    // Convert percentage center to pixel offset from map center
    const offsetX = (50 - centerX) / 100 * containerRect.width * mapScale;
    const offsetY = (50 - centerY) / 100 * containerRect.height * mapScale;
    
    mapX = offsetX;
    mapY = offsetY;
    
    updateMapTransform();
    updateZoomDisplay();
  }
  
  // Focus on a specific settlement (zoom and center)
  function focusOnSettlement(settlement) {
    if (!settlement || !mapContainer) return;
    
    const containerRect = mapContainer.getBoundingClientRect();
    
    // Zoom in to see the settlement
    mapScale = 1.8;
    
    // Calculate pan to center the settlement
    const offsetX = (50 - settlement.x) / 100 * containerRect.width * mapScale;
    const offsetY = (50 - settlement.y) / 100 * containerRect.height * mapScale;
    
    mapX = offsetX;
    mapY = offsetY;
    
    updateMapTransform();
    updateZoomDisplay();
  }

  // ========================================
  // MAP CONTROLS (Zoom, Pan)
  // ========================================
  function setupMapControls() {
    const zoomIn = document.getElementById('map-zoom-in');
    const zoomOut = document.getElementById('map-zoom-out');
    const zoomReset = document.getElementById('map-zoom-reset');

    if (zoomIn) zoomIn.addEventListener('click', () => zoom(0.2));
    if (zoomOut) zoomOut.addEventListener('click', () => zoom(-0.2));
    if (zoomReset) zoomReset.addEventListener('click', resetView);

    // Mouse wheel zoom
    if (mapContainer) {
      mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        zoom(delta);
      }, { passive: false });
    }
  }

  function zoom(delta) {
    mapScale = Math.max(0.5, Math.min(3, mapScale + delta));
    updateMapTransform();
    updateZoomDisplay();
  }

  function resetView() {
    mapScale = 1;
    mapX = 0;
    mapY = 0;
    updateMapTransform();
    updateZoomDisplay();
  }

  function updateMapTransform() {
    if (mapWrapper) {
      mapWrapper.style.transform = `translate(${mapX}px, ${mapY}px) scale(${mapScale})`;
    }
  }

  function updateZoomDisplay() {
    const display = document.getElementById('zoom-level');
    if (display) {
      display.textContent = Math.round(mapScale * 100) + '%';
    }
  }

  // ========================================
  // MAP INTERACTION (Pan/Drag)
  // ========================================
  function setupMapInteraction() {
    if (!mapContainer) return;

    mapContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch support
    mapContainer.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
  }

  function startDrag(e) {
    if (e.target.closest('.settlement-marker') || e.target.closest('.map-control-btn')) return;
    
    isDragging = true;
    mapWrapper?.classList.add('dragging');
    
    const point = e.touches ? e.touches[0] : e;
    dragStartX = point.clientX - mapX;
    dragStartY = point.clientY - mapY;
    
    if (e.type === 'touchstart') e.preventDefault();
  }

  function drag(e) {
    if (!isDragging) return;
    
    const point = e.touches ? e.touches[0] : e;
    mapX = point.clientX - dragStartX;
    mapY = point.clientY - dragStartY;
    
    updateMapTransform();
    if (e.type === 'touchmove') e.preventDefault();
  }

  function endDrag() {
    isDragging = false;
    mapWrapper?.classList.remove('dragging');
  }

  // ========================================
  // SETTLEMENT MARKERS
  // ========================================
  function renderSettlements() {
    // Remove existing markers
    document.querySelectorAll('.settlement-marker').forEach(m => m.remove());

    if (!mapWrapper) return;

    let allSettlements = [];
    
    if (currentKingdom === 'all') {
      // Show all settlements from all kingdoms
      Object.keys(SETTLEMENTS).forEach(kingdomId => {
        const kingdomData = SETTLEMENTS[kingdomId];
        if (!kingdomData) return;
        
        const settlements = [
          ...(kingdomData.capitals || []),
          ...(kingdomData.largeCities || []),
          ...(kingdomData.mediumCities || []),
          ...(kingdomData.towns || []),
          ...(kingdomData.villages || []),
          ...(kingdomData.pois || [])
        ].map(s => ({ ...s, kingdom: kingdomId }));
        
        allSettlements = allSettlements.concat(settlements);
      });
    } else {
      const kingdomData = SETTLEMENTS[currentKingdom];
      if (!kingdomData) return;

      allSettlements = [
        ...(kingdomData.capitals || []),
        ...(kingdomData.largeCities || []),
        ...(kingdomData.mediumCities || []),
        ...(kingdomData.towns || []),
        ...(kingdomData.villages || []),
        ...(kingdomData.pois || [])
      ].map(s => ({ ...s, kingdom: currentKingdom }));
    }

    allSettlements.forEach(settlement => {
      const marker = createMarker(settlement);
      mapWrapper.appendChild(marker);
    });
  }

  function createMarker(settlement) {
    const marker = document.createElement('div');
    marker.className = 'settlement-marker';
    marker.style.left = settlement.x + '%';
    marker.style.top = settlement.y + '%';
    marker.dataset.id = settlement.id;

    const dot = document.createElement('div');
    dot.className = `marker-dot ${settlement.type}`;
    marker.appendChild(dot);

    const label = document.createElement('div');
    label.className = 'marker-label';
    label.textContent = settlement.name;
    marker.appendChild(label);

    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      selectSettlement(settlement);
    });

    return marker;
  }

  // ========================================
  // SETTLEMENT LIST (Sidebar/Mobile)
  // ========================================
  function updateSettlementList() {
    const list = document.getElementById('settlement-list');
    if (!list) return;

    let allSettlements = [];
    
    if (currentKingdom === 'all') {
      // Show all settlements from all kingdoms
      Object.keys(SETTLEMENTS).forEach(kingdomId => {
        const kingdomData = SETTLEMENTS[kingdomId];
        if (!kingdomData) return;
        
        const settlements = [
          ...(kingdomData.capitals || []),
          ...(kingdomData.largeCities || []),
          ...(kingdomData.mediumCities || []),
          ...(kingdomData.towns || []),
          ...(kingdomData.villages || [])
        ].map(s => ({ ...s, kingdom: kingdomId }));
        
        allSettlements = allSettlements.concat(settlements);
      });
    } else {
      const kingdomData = SETTLEMENTS[currentKingdom];
      if (!kingdomData) return;

      allSettlements = [
        ...(kingdomData.capitals || []),
        ...(kingdomData.largeCities || []),
        ...(kingdomData.mediumCities || []),
        ...(kingdomData.towns || []),
        ...(kingdomData.villages || [])
      ].map(s => ({ ...s, kingdom: currentKingdom }));
    }

    list.innerHTML = allSettlements.map(s => `
      <div class="settlement-list-item" data-id="${s.id}" data-kingdom="${s.kingdom}">
        <div class="marker-dot ${s.type}"></div>
        <div class="settlement-list-info">
          <div class="settlement-list-name">${s.name}</div>
          <div class="settlement-list-type">${formatType(s.type)}${currentKingdom === 'all' ? ' • ' + KINGDOMS[s.kingdom].name : ''} • Pop: ${formatNumber(s.population)}</div>
        </div>
        <i class="fas fa-chevron-right" style="color: var(--text-muted);"></i>
      </div>
    `).join('');

    list.querySelectorAll('.settlement-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const settlement = allSettlements.find(s => s.id === item.dataset.id);
        if (settlement) selectSettlement(settlement);
      });
    });
  }

  // ========================================
  // SETTLEMENT PANEL
  // ========================================
  function selectSettlement(settlement) {
    currentSettlement = settlement;

    // Update marker states
    document.querySelectorAll('.settlement-marker').forEach(m => {
      m.classList.toggle('active', m.dataset.id === settlement.id);
    });

    // Zoom to the settlement
    focusOnSettlement(settlement);

    // Update panel content
    updatePanel(settlement);
    openPanel();
  }

  function updatePanel(settlement) {
    if (!settlementPanel) return;

    const titleEl = settlementPanel.querySelector('.panel-title');
    const subtitleEl = settlementPanel.querySelector('.panel-subtitle');
    const contentEl = settlementPanel.querySelector('.panel-content');
    const linkEl = settlementPanel.querySelector('.panel-link');

    // Get kingdom name from settlement or current kingdom
    const settlementKingdom = settlement.kingdom || currentKingdom;
    const kingdomName = KINGDOMS[settlementKingdom] ? KINGDOMS[settlementKingdom].name : 'Unknown';

    if (titleEl) titleEl.textContent = settlement.name;
    if (subtitleEl) {
      subtitleEl.innerHTML = `
        <span class="panel-type-badge ${settlement.type}">${formatType(settlement.type)}</span>
        <span>${kingdomName}</span>
      `;
    }

    if (contentEl) {
      const isPOI = settlement.type === 'poi';
      const hasFile = !!settlement.file;
      
      // If no file exists yet, show minimal info
      if (!hasFile) {
        contentEl.innerHTML = `
          <div class="panel-section">
            <div class="panel-section-title"><i class="fas fa-map-marker-alt"></i> Location</div>
            <p class="panel-description">${settlement.name} is a ${formatType(settlement.type).toLowerCase()} in ${kingdomName}.</p>
          </div>
          <div class="panel-section" style="background: rgba(233, 69, 96, 0.1); border-radius: 8px; padding: 15px; border-left: 3px solid #e94560;">
            <div class="panel-section-title" style="color: #e94560;"><i class="fas fa-hourglass-half"></i> Coming Soon</div>
            <p class="panel-description" style="color: #aaa; font-style: italic;">Detailed lore for this location has not been written yet. Check back later!</p>
          </div>
        `;
      } else {
        contentEl.innerHTML = `
          ${!isPOI ? `
          <div class="panel-section">
            <div class="panel-section-title"><i class="fas fa-chart-bar"></i> Statistics</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${formatNumber(settlement.population)}</div>
                <div class="stat-label">Population</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${formatType(settlement.type)}</div>
                <div class="stat-label">Type</div>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <div class="panel-section-title"><i class="fas fa-star"></i> Ratings</div>
            <div class="rating-row">
              <span class="rating-label">Wealth</span>
              ${renderStars(settlement.wealth)}
            </div>
            <div class="rating-row">
              <span class="rating-label">Military</span>
              ${renderStars(settlement.military)}
            </div>
            <div class="rating-row">
              <span class="rating-label">Happiness</span>
              ${renderStars(settlement.happiness)}
            </div>
          </div>

          <div class="panel-section">
            <div class="panel-section-title"><i class="fas fa-crown"></i> Leadership</div>
            <div class="leader-card">
              <div class="leader-avatar"><i class="fas fa-user"></i></div>
              <div class="leader-info">
                <div class="leader-name">${settlement.leader}</div>
                <div class="leader-title">${settlement.leaderTitle}</div>
              </div>
            </div>
          </div>
          ` : ''}

          <div class="panel-section">
            <div class="panel-section-title"><i class="fas fa-scroll"></i> Description</div>
            <p class="panel-description">${settlement.description}</p>
          </div>
        `;
      }
    }

    if (linkEl) {
      if (settlement.file) {
        linkEl.style.display = '';
        linkEl.disabled = false;
        linkEl.innerHTML = '<i class="fas fa-book-open"></i> View Full Details';
        linkEl.onclick = () => {
          // Navigate to the file using the main site's loadContent
          if (window.opener && window.opener.loadContent) {
            window.opener.loadContent(settlement.file);
          } else {
            // If standalone, redirect to main site with file parameter
            window.location.href = `index.html?file=${encodeURIComponent(settlement.file)}`;
          }
        };
      } else {
        // No file available yet
        linkEl.innerHTML = '<i class="fas fa-file-alt"></i> Lore File: N/A';
        linkEl.style.opacity = '0.5';
        linkEl.style.cursor = 'not-allowed';
        linkEl.onclick = (e) => {
          e.preventDefault();
          alert('Detailed lore for this location has not been written yet.');
        };
      }
    }
  }

  function openPanel() {
    if (settlementPanel) settlementPanel.classList.add('open');
  }

  function closePanel() {
    if (settlementPanel) settlementPanel.classList.remove('open');
    document.querySelectorAll('.settlement-marker').forEach(m => m.classList.remove('active'));
    currentSettlement = null;
  }

  // ========================================
  // UTILITIES
  // ========================================
  function formatType(type) {
    const types = {
      'capital': 'Capital',
      'large-city': 'Large City',
      'medium-city': 'Medium City',
      'town': 'Town',
      'village': 'Village',
      'poi': 'Point of Interest'
    };
    return types[type] || type;
  }

  function formatNumber(num) {
    if (!num) return '—';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  }

  function renderStars(rating) {
    if (rating === undefined) return '<span class="rating-stars">—</span>';
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('<i class="fas fa-star filled"></i>');
      } else if (rating >= i - 0.5) {
        stars.push('<i class="fas fa-star-half-alt filled"></i>');
      } else {
        stars.push('<i class="far fa-star empty"></i>');
      }
    }
    return `<div class="rating-stars">${stars.join('')}</div>`;
  }

  // ========================================
  // PUBLIC API
  // ========================================
  
  // Get all settlements as a flat array with kingdom info
  function getAllSettlements() {
    const all = [];
    Object.keys(SETTLEMENTS).forEach(kingdom => {
      Object.keys(SETTLEMENTS[kingdom]).forEach(type => {
        SETTLEMENTS[kingdom][type].forEach(s => {
          all.push({
            ...s,
            kingdom: kingdom,
            type: type
          });
        });
      });
    });
    return all;
  }

  // Focus on a specific settlement (by name string or settlement object)
  function focusOnSettlement(settlementOrName) {
    let settlement;
    
    if (typeof settlementOrName === 'string') {
      const settlements = getAllSettlements();
      settlement = settlements.find(s => 
        s.name.toLowerCase() === settlementOrName.toLowerCase()
      );
    } else {
      // It's already a settlement object
      settlement = settlementOrName;
    }
    
    if (settlement) {
      // Switch to the correct kingdom tab if needed
      if (settlement.kingdom && currentKingdom !== settlement.kingdom && currentKingdom !== 'all') {
        currentKingdom = settlement.kingdom;
        renderTabs();
        renderSettlements();
      }
      
      // Focus on the settlement coordinates
      const coords = settlement.coords;
      if (coords) {
        const targetX = -coords.x * mapScale + window.innerWidth / 2;
        const targetY = -coords.y * mapScale + window.innerHeight / 2;
        mapX = targetX;
        mapY = targetY;
        mapScale = 2; // Zoom in
        updateMapTransform();
        updateZoomDisplay();
        
        // Show the settlement panel
        currentSettlement = settlement;
        showPanel(settlement);
      }
    }
  }

  // Check URL params for settlement navigation
  function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const settlementName = params.get('settlement');
    if (settlementName) {
      // Small delay to ensure map is ready
      setTimeout(() => focusOnSettlement(settlementName), 500);
    }
  }

  return {
    init,
    closePanel,
    focusOnKingdom,
    focusOnSettlement,
    getAllSettlements,
    getKingdoms: () => KINGDOMS,
    getSettlements: () => SETTLEMENTS,
    getCurrentKingdom: () => currentKingdom,
    getCurrentSettlement: () => currentSettlement,
    checkURLParams,
    resetView: () => {
      mapScale = 1;
      mapX = 0;
      mapY = 0;
      updateMapTransform();
      updateZoomDisplay();
    }
  };

})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  MapModule.init();
  MapModule.checkURLParams();
});
