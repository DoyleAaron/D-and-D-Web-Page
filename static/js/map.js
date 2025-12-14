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
      description: 'Militaristic human-majority monarchy with the largest army'
    },
    islefield: {
      name: 'Islefield',
      color: '#4caf50',
      description: 'Elven-led wealthy kingdom focused on trade and diplomacy'
    },
    kluimont: {
      name: 'Kluimont',
      color: '#9c27b0',
      description: 'Secretive arcane island kingdom'
    },
    lavalto: {
      name: 'Lavalto',
      color: '#ff5722',
      description: 'Independent volcanic isle, rumored to be vampire-ruled'
    }
  };

  // Settlement data with coordinates (percentages of map image)
  // Coordinates are approximate and should be adjusted based on actual map
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
          x: 45, y: 55
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
          x: 52, y: 70
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
          x: 40, y: 45
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
          x: 25, y: 50
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
          x: 38, y: 25
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
          x: 48, y: 65
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
          x: 18, y: 15
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
          x: 55, y: 80
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
          x: 42, y: 60
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
          x: 35, y: 30
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
          x: 28, y: 35
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
          x: 50, y: 75
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
          x: 58, y: 88
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
          x: 22, y: 28
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
          x: 12, y: 12
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
          x: 30, y: 40
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
          x: 32, y: 48
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
          x: 25, y: 42
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
          x: 45, y: 35
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
          x: 55, y: 58
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
          x: 60, y: 52
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
          x: 52, y: 82
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
          x: 60, y: 85
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
          x: 65, y: 90
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
          x: 55, y: 92
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
          x: 62, y: 95
        }
      ],
      pois: [
        {
          id: 'grand-span',
          name: 'The Grand Span',
          type: 'poi',
          description: 'Ancient Tharnic bridge spanning the Vael, originally called Pontem inter Mundos. The largest bridge in Dayner.',
          file: 'Kingdoms/Braewood/POI/The Grand Span.md',
          x: 56, y: 81
        },
        {
          id: 'buchrior-hollows',
          name: 'Buchrior Hollows',
          type: 'poi',
          description: 'Ancient dwarven tomb complex in the northern mountains, guarded by Keeper Thana Ironvow.',
          file: 'Kingdoms/Braewood/POI/Buchrior Hollows.md',
          x: 28, y: 22
        },
        {
          id: 'debourg-grotto',
          name: 'Debourg Grotto',
          type: 'poi',
          description: 'Sealed underground complex where something terrible happened. Survivors imprisoned in Oyard.',
          file: 'Kingdoms/Braewood/POI/Debourg Grotto.md',
          x: 23, y: 38
        },
        {
          id: 'meriver-mountains',
          name: 'Meriver Mountains',
          type: 'poi',
          description: 'Northern mountain range rich in iron and precious metals. Dwarven mining heartland.',
          file: 'Kingdoms/Braewood/POI/Meriver Mountains.md',
          x: 30, y: 18
        },
        {
          id: 'plalisle-den',
          name: 'Plalisle Den',
          type: 'poi',
          description: 'Mysterious cavern system in the eastern hills. Rumors of strange creatures within.',
          file: 'Kingdoms/Braewood/POI/Plalisle Den.md',
          x: 48, y: 40
        },
        {
          id: 'wynlants-cavity',
          name: 'Wynlants Cavity',
          type: 'poi',
          description: 'Deep sinkhole in the central plains, said to connect to underground rivers.',
          file: 'Kingdoms/Braewood/POI/Wynlants Cavity.md',
          x: 42, y: 50
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
          x: 70, y: 60
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
          x: 58, y: 78
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
          x: 75, y: 85
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
          x: 72, y: 55
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
          x: 78, y: 65
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
          x: 82, y: 75
        }
      ],
      towns: [],
      villages: [],
      pois: []
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
          x: 15, y: 55
        }
      ],
      largeCities: [],
      mediumCities: [],
      towns: [],
      villages: [],
      pois: []
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
          x: 50, y: 62
        }
      ],
      mediumCities: [],
      towns: [],
      villages: [],
      pois: []
    }
  };

  // ========================================
  // STATE
  // ========================================
  let currentKingdom = 'braewood';
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
      });
    });
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

    const kingdomData = SETTLEMENTS[currentKingdom];
    if (!kingdomData) return;

    const allSettlements = [
      ...(kingdomData.capitals || []),
      ...(kingdomData.largeCities || []),
      ...(kingdomData.mediumCities || []),
      ...(kingdomData.towns || []),
      ...(kingdomData.villages || []),
      ...(kingdomData.pois || [])
    ];

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

    const kingdomData = SETTLEMENTS[currentKingdom];
    if (!kingdomData) return;

    const allSettlements = [
      ...(kingdomData.capitals || []),
      ...(kingdomData.largeCities || []),
      ...(kingdomData.mediumCities || []),
      ...(kingdomData.towns || []),
      ...(kingdomData.villages || [])
    ];

    list.innerHTML = allSettlements.map(s => `
      <div class="settlement-list-item" data-id="${s.id}">
        <div class="marker-dot ${s.type}"></div>
        <div class="settlement-list-info">
          <div class="settlement-list-name">${s.name}</div>
          <div class="settlement-list-type">${formatType(s.type)} • Pop: ${formatNumber(s.population)}</div>
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

    if (titleEl) titleEl.textContent = settlement.name;
    if (subtitleEl) {
      subtitleEl.innerHTML = `
        <span class="panel-type-badge ${settlement.type}">${formatType(settlement.type)}</span>
        <span>${KINGDOMS[currentKingdom].name}</span>
      `;
    }

    if (contentEl) {
      const isPOI = settlement.type === 'poi';
      
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

    if (linkEl) {
      linkEl.onclick = () => {
        if (settlement.file) {
          // Navigate to the file using the main site's loadContent
          if (window.opener && window.opener.loadContent) {
            window.opener.loadContent(settlement.file);
          } else {
            // If standalone, redirect to main site with file parameter
            window.location.href = `index.html?file=${encodeURIComponent(settlement.file)}`;
          }
        }
      };
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
  return {
    init,
    closePanel,
    getKingdoms: () => KINGDOMS,
    getSettlements: () => SETTLEMENTS,
    getCurrentKingdom: () => currentKingdom,
    getCurrentSettlement: () => currentSettlement
  };

})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', MapModule.init);
