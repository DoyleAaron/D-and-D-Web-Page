// ============================================================
// SHIP ROUTES - Sea Travel Network for Dayner
// Separate from road network - uses ports and navigation nodes
// ============================================================

const SHIP_NETWORK = {
  // Travel speeds in miles per day (by ship)
  TRAVEL_SPEEDS: {
    slow: 24,    // Careful sailing, bad weather
    normal: 48,  // Standard sailing
    fast: 72     // Full sail, good winds
  },

  // Map scale: percentage units to miles
  MAP_SCALE: {
    percentToMiles: 15.45  // 1% of map = ~15.45 miles
  },

  // PORT SETTLEMENTS - Harbors where ships can dock
  PORTS: {
    'port-kluimont': { name: 'Kluimont', x: 10.4, y: 31.3 },
    'port-kilson': { name: 'Kilson', x: 10.9, y: 41 },
    'port-aresphia': { name: 'Aresphia', x: 6.5, y: 37.4 },
    'port-tarora': { name: 'Tarora', x: 18.7, y: 37.3 },
    'port-erymont': { name: 'Erymont', x: 27.3, y: 25.3 },
    'port-yuosburn': { name: 'Yuosburn', x: 30.2, y: 31.2 },
    'port-volton': { name: 'Volton', x: 42.1, y: 23.3 },
    'port-ajag': { name: 'Ajag', x: 40.3, y: 37.3 },
    'port-eimgend': { name: 'Eimgend', x: 25.7, y: 40.1 },
    'port-slonmore': { name: 'Slonmore', x: 51, y: 35.5 },
    'port-okcaster': { name: 'Okcaster', x: 5.4, y: 53.7 },
    'port-agosgas': { name: 'Agosgas', x: 4.1, y: 58.6 },
    'port-islefield': { name: 'Islefield', x: 28.4, y: 69.8 },
    'port-dawerton': { name: 'Dawerton', x: 61.4, y: 49.8 },
    'port-flison': { name: 'Flison', x: 51.7, y: 50.4 },
    'port-agosron': { name: 'Agosron', x: 49.3, y: 58.9 },
    'port-rens': { name: 'Rens', x: 78.7, y: 73.7 },
    'port-ioxyhull': { name: 'Ioxyhull', x: 94.9, y: 56.2 },
    'port-braewood': { name: 'Braewood', x: 83.6, y: 47.4 },
    'port-slada': { name: 'Slada', x: 90.1, y: 23.6 },
    'port-borugham': { name: 'Borugham', x: 78, y: 29.4 },
    'port-mortling': { name: 'Mortling', x: 66.8, y: 43.6 },
    'port-adham': { name: 'Adham', x: 71.5, y: 41.6 },
    'port-oyard': { name: 'Oyard', x: 93.6, y: 44.9 },
    'port-ardismouth': { name: 'Ardismouth', x: 88.4, y: 38.7 },
    'port-yhey': { name: 'Yhey', x: 32, y: 44.7 },
    'port-resross': { name: 'Resross', x: 28.3, y: 44.5 },
    'port-sable': { name: 'Sable', x: 40.3, y: 46.6 },
    'port-qrey': { name: 'Qrey', x: 7.5, y: 23.3 },
    'port-ukrolis': { name: 'Ukrolis', x: 37.5, y: 27.8 },
    'port-wrando': { name: 'Wrando', x: 17.2, y: 58.3 },
  },

  // NAVIGATION NODES - Waypoints in open water
  NAV_NODES: {
    'nav-1': { x: 13.8, y: 25.9 },
    'nav-2': { x: 24.9, y: 35.3 },
    'nav-3': { x: 21.2, y: 34 },
    'nav-4': { x: 18, y: 33.2 },
    'nav-5': { x: 14.7, y: 31.1 },
    'nav-6': { x: 21.3, y: 39.3 },
    'nav-7': { x: 16.9, y: 40.1 },
    'nav-8': { x: 12.9, y: 38.9 },
    'nav-9': { x: 9.2, y: 37.4 },
    'nav-10': { x: 6.9, y: 35.1 },
    'nav-11': { x: 6, y: 30.3 },
    'nav-12': { x: 8.1, y: 29.1 },
    'nav-13': { x: 5.1, y: 27.7 },
    'nav-14': { x: 3.7, y: 23.6 },
    'nav-15': { x: 2.3, y: 19.3 },
    'nav-16': { x: 2.6, y: 14 },
    'nav-17': { x: 5.3, y: 12.1 },
    'nav-18': { x: 9.1, y: 10.9 },
    'nav-19': { x: 13, y: 11.8 },
    'nav-20': { x: 16.2, y: 14 },
    'nav-21': { x: 19.1, y: 14.2 },
    'nav-22': { x: 22.6, y: 16.2 },
    'nav-23': { x: 20.6, y: 20.6 },
    'nav-24': { x: 16.7, y: 24.6 },
    'nav-25': { x: 20.3, y: 26.2 },
    'nav-26': { x: 23.2, y: 28.8 },
    'nav-27': { x: 19.8, y: 32.9 },
    'nav-28': { x: 24.4, y: 33.2 },
    'nav-29': { x: 27.4, y: 33.2 },
    'nav-30': { x: 27.2, y: 31.2 },
    'nav-31': { x: 27.2, y: 27.6 },
    'nav-32': { x: 29.7, y: 29.3 },
    'nav-33': { x: 31.7, y: 29.8 },
    'nav-34': { x: 33.8, y: 29.7 },
    'nav-35': { x: 36.4, y: 27.7 },
    'nav-36': { x: 39.3, y: 25.3 },
    'nav-37': { x: 41, y: 22.9 },
    'nav-38': { x: 40.8, y: 20.7 },
    'nav-39': { x: 26.7, y: 25.4 },
    'nav-40': { x: 28.8, y: 27.2 },
    'nav-41': { x: 30.8, y: 27 },
    'nav-42': { x: 33.2, y: 26.7 },
    'nav-43': { x: 35.1, y: 24.6 },
    'nav-44': { x: 32.9, y: 23.9 },
    'nav-45': { x: 30.4, y: 23.6 },
    'nav-46': { x: 27.6, y: 23.1 },
    'nav-47': { x: 24.9, y: 23.1 },
    'nav-48': { x: 23.2, y: 21.1 },
    'nav-49': { x: 25.3, y: 20.9 },
    'nav-50': { x: 28.1, y: 20.6 },
    'nav-51': { x: 26.5, y: 19.1 },
    'nav-52': { x: 24.9, y: 16.6 },
    'nav-53': { x: 26.3, y: 15.4 },
    'nav-54': { x: 28, y: 14.3 },
    'nav-55': { x: 30.4, y: 14.5 },
    'nav-56': { x: 33.1, y: 15.4 },
    'nav-57': { x: 35.6, y: 17.1 },
    'nav-58': { x: 37.8, y: 18.1 },
    'nav-59': { x: 39.6, y: 18.5 },
    'nav-60': { x: 42.6, y: 18.2 },
    'nav-61': { x: 43.1, y: 15.3 },
    'nav-62': { x: 41.4, y: 13.3 },
    'nav-63': { x: 41.2, y: 10.5 },
    'nav-64': { x: 44.7, y: 9.7 },
    'nav-65': { x: 49.4, y: 10.1 },
    'nav-66': { x: 53.2, y: 9.9 },
    'nav-67': { x: 56.5, y: 10 },
    'nav-68': { x: 59, y: 10 },
    'nav-69': { x: 62.8, y: 10 },
    'nav-70': { x: 66, y: 10 },
    'nav-71': { x: 68.4, y: 10.4 },
    'nav-72': { x: 70.3, y: 10 },
    'nav-73': { x: 72.4, y: 10.4 },
    'nav-74': { x: 75, y: 10.1 },
    'nav-75': { x: 77.4, y: 10.5 },
    'nav-77': { x: 77.9, y: 21.5 },
    'nav-78': { x: 79.5, y: 21.1 },
    'nav-79': { x: 80.2, y: 20.2 },
    'nav-80': { x: 79.7, y: 18.8 },
    'nav-81': { x: 79, y: 17.4 },
    'nav-82': { x: 78.2, y: 16.2 },
    'nav-83': { x: 77.8, y: 14.5 },
    'nav-84': { x: 79, y: 11.5 },
    'nav-85': { x: 80.8, y: 11.2 },
    'nav-86': { x: 82.6, y: 11 },
    'nav-87': { x: 84.1, y: 10.5 },
    'nav-88': { x: 86.2, y: 10.5 },
    'nav-89': { x: 88.4, y: 11.2 },
    'nav-90': { x: 90.3, y: 12 },
    'nav-91': { x: 91.8, y: 12.9 },
    'nav-92': { x: 93.3, y: 14.3 },
    'nav-93': { x: 95, y: 17.3 },
    'nav-94': { x: 94.8, y: 22 },
    'nav-95': { x: 94, y: 25.8 },
    'nav-97': { x: 93.7, y: 29.6 },
    'nav-98': { x: 93.5, y: 33.7 },
    'nav-99': { x: 93.8, y: 39.4 },
    'nav-100': { x: 94.1, y: 43.5 },
    'nav-101': { x: 94.5, y: 47.9 },
    'nav-102': { x: 94.4, y: 52.8 },
    'nav-103': { x: 94.6, y: 57.8 },
    'nav-104': { x: 94.4, y: 62.6 },
    'nav-105': { x: 93.8, y: 67.5 },
    'nav-106': { x: 93, y: 71.4 },
    'nav-107': { x: 90.6, y: 76.7 },
    'nav-108': { x: 87.6, y: 81.3 },
    'nav-109': { x: 84.2, y: 81.3 },
    'nav-110': { x: 78.6, y: 85.2 },
    'nav-111': { x: 77.2, y: 83.9 },
    'nav-112': { x: 74.1, y: 84.2 },
    'nav-113': { x: 72.2, y: 83.8 },
    'nav-114': { x: 69.2, y: 82.5 },
    'nav-115': { x: 66.6, y: 82 },
    'nav-116': { x: 64.3, y: 81.6 },
    'nav-117': { x: 61.9, y: 80.9 },
    'nav-118': { x: 59.4, y: 80.5 },
    'nav-119': { x: 56.9, y: 80.3 },
    'nav-120': { x: 53.6, y: 80.6 },
    'nav-121': { x: 49.3, y: 80.5 },
    'nav-122': { x: 46.2, y: 80.4 },
    'nav-123': { x: 40.8, y: 80.9 },
    'nav-124': { x: 38.4, y: 80.9 },
    'nav-125': { x: 36.2, y: 80.9 },
    'nav-126': { x: 32.8, y: 80.9 },
    'nav-127': { x: 28.8, y: 80 },
    'nav-128': { x: 28.2, y: 77.6 },
    'nav-129': { x: 28.9, y: 76 },
    'nav-130': { x: 11.3, y: 44.1 },
    'nav-131': { x: 8.3, y: 48 },
    'nav-132': { x: 5.3, y: 52.1 },
    'nav-133': { x: 3.9, y: 56.6 },
    'nav-134': { x: 3.9, y: 61.6 },
    'nav-135': { x: 3, y: 66.2 },
    'nav-136': { x: 1, y: 71.5 },
    'nav-137': { x: 1.2, y: 75.5 },
    'nav-138': { x: 2, y: 80.5 },
    'nav-139': { x: 4, y: 84.2 },
    'nav-140': { x: 6.3, y: 85.1 },
    'nav-141': { x: 8.5, y: 84.7 },
    'nav-142': { x: 9.8, y: 82.7 },
    'nav-143': { x: 11.2, y: 80.3 },
    'nav-144': { x: 11.6, y: 77.9 },
    'nav-145': { x: 13.2, y: 75.7 },
    'nav-146': { x: 16.8, y: 74.6 },
    'nav-147': { x: 19.6, y: 74.6 },
    'nav-148': { x: 23.7, y: 73.9 },
    'nav-149': { x: 26.5, y: 73.2 },
    'nav-150': { x: 29, y: 73.3 },
    'nav-151': { x: 31.3, y: 76.5 },
    'nav-152': { x: 51.2, y: 77.5 },
    'nav-153': { x: 54, y: 76.1 },
    'nav-154': { x: 52.9, y: 73.9 },
    'nav-155': { x: 53, y: 69.4 },
    'nav-156': { x: 51.3, y: 67 },
    'nav-157': { x: 49.7, y: 65.6 },
    'nav-158': { x: 48.2, y: 64 },
    'nav-159': { x: 46.5, y: 61.6 },
    'nav-160': { x: 46.8, y: 58.3 },
    'nav-161': { x: 47.6, y: 55.4 },
    'nav-162': { x: 48.3, y: 53 },
    'nav-163': { x: 49.2, y: 49.9 },
    'nav-164': { x: 51.6, y: 49.3 },
    'nav-165': { x: 54.4, y: 48.4 },
    'nav-166': { x: 57, y: 48.3 },
    'nav-167': { x: 60, y: 48.7 },
    'nav-168': { x: 62.7, y: 49.9 },
    'nav-169': { x: 54.1, y: 67 },
    'nav-170': { x: 56.3, y: 66.4 },
    'nav-171': { x: 58.9, y: 66 },
    'nav-172': { x: 61.3, y: 65.2 },
    'nav-173': { x: 62.1, y: 63.7 },
    'nav-174': { x: 62.6, y: 61.7 },
    'nav-175': { x: 63.5, y: 60.2 },
    'nav-176': { x: 63.6, y: 58.4 },
    'nav-177': { x: 63.8, y: 56.5 },
    'nav-178': { x: 63.6, y: 54.3 },
    'nav-179': { x: 22.6, y: 42.6 },
    'nav-180': { x: 24.3, y: 41.8 },
    'nav-181': { x: 25.7, y: 41.3 },
    'nav-182': { x: 28, y: 41.3 },
    'nav-183': { x: 29.4, y: 41.6 },
    'nav-184': { x: 31.3, y: 41.8 },
    'nav-185': { x: 32.8, y: 42.3 },
    'nav-186': { x: 34.8, y: 42.6 },
    'nav-187': { x: 36.2, y: 42.3 },
    'nav-188': { x: 38.4, y: 42.7 },
    'nav-189': { x: 39.6, y: 42.8 },
    'nav-190': { x: 40.8, y: 43.5 },
    'nav-191': { x: 42.5, y: 45.8 },
    'nav-192': { x: 43.9, y: 46.4 },
    'nav-193': { x: 45.4, y: 47.4 },
    'nav-194': { x: 47, y: 49.8 },
    'nav-195': { x: 61.5, y: 45.2 },
    'nav-196': { x: 62.2, y: 44 },
    'nav-197': { x: 63.6, y: 43.4 },
    'nav-198': { x: 64.7, y: 42.3 },
    'nav-199': { x: 66, y: 41.3 },
    'nav-200': { x: 67.5, y: 40.2 },
    'nav-201': { x: 68.8, y: 39.2 },
    'nav-202': { x: 69.8, y: 38.2 },
    'nav-203': { x: 71.1, y: 37.3 },
    'nav-204': { x: 71.4, y: 41.6 },
    'nav-205': { x: 72.9, y: 42.1 },
    'nav-206': { x: 74.4, y: 42.8 },
    'nav-207': { x: 76.2, y: 44 },
    'nav-208': { x: 83.9, y: 46.4 },
    'nav-209': { x: 85.1, y: 46.3 },
    'nav-210': { x: 86.3, y: 45.6 },
    'nav-211': { x: 87.6, y: 44.9 },
    'nav-212': { x: 88.8, y: 44.9 },
    'nav-213': { x: 93.2, y: 47.4 },
    'nav-214': { x: 91.4, y: 47.9 },
    'nav-215': { x: 90.2, y: 47.6 },
    'nav-216': { x: 87.1, y: 76.7 },
    'nav-217': { x: 86.4, y: 74.9 },
    'nav-218': { x: 85.9, y: 72.9 },
    'nav-219': { x: 86.1, y: 71 },
    'nav-220': { x: 85.8, y: 69.1 },
    'nav-221': { x: 85, y: 67.5 },
    'nav-222': { x: 84.2, y: 66 },
    'nav-223': { x: 83.5, y: 64 },
    'nav-224': { x: 83.6, y: 62.2 },
    'nav-225': { x: 83.9, y: 60.4 },
    'nav-226': { x: 84, y: 58.8 },
    'nav-227': { x: 83.9, y: 57.3 },
    'nav-228': { x: 83.4, y: 55.6 },
    'nav-229': { x: 83.6, y: 53.7 },
    'nav-230': { x: 83.1, y: 52.1 },
    'nav-231': { x: 81.8, y: 51.8 },
    'nav-232': { x: 80.3, y: 51.2 },
    'nav-233': { x: 80.6, y: 49.9 },
    'nav-234': { x: 44.7, y: 21.7 },
    'nav-235': { x: 47, y: 25 },
    'nav-236': { x: 48.5, y: 24.5 },
    'nav-237': { x: 50, y: 25.8 },
    'nav-238': { x: 50.8, y: 29.3 },
    'nav-239': { x: 52.3, y: 29.3 },
    'nav-240': { x: 53.5, y: 28.7 },
    'nav-241': { x: 54.7, y: 27.2 },
    'nav-242': { x: 56.6, y: 26.2 },
    'nav-243': { x: 58.2, y: 27.7 },
    'nav-244': { x: 60, y: 28.3 },
    'nav-245': { x: 59.8, y: 31.5 },
    'nav-246': { x: 58.3, y: 32.2 },
    'nav-247': { x: 60.1, y: 35.3 },
    'nav-248': { x: 61.6, y: 34.9 },
    'nav-249': { x: 64.2, y: 34.9 },
    'nav-250': { x: 66.2, y: 35.3 },
    'nav-251': { x: 63, y: 34.9 },
    'nav-252': { x: 67.5, y: 34.8 },
    'nav-253': { x: 69.4, y: 34.3 },
    'nav-254': { x: 71.1, y: 34.3 },
  },

  // SEA LANES - Connections between nodes (bidirectional)
  // Format: [nodeA, nodeB] - ships can travel between these
  SEA_LANES: [
    // === NORTHWEST COAST (Qrey region) ===
    ['port-qrey', 'nav-14'],
    ['nav-14', 'nav-13'],
    ['nav-13', 'nav-11'],
    ['nav-11', 'nav-12'],
    ['nav-12', 'nav-1'],
    ['nav-1', 'nav-24'],
    ['nav-24', 'nav-25'],
    ['nav-25', 'nav-26'],
    ['nav-1', 'nav-5'],
    ['nav-5', 'port-kluimont'],
    
    // === NORTH COAST (around top) ===
    ['nav-14', 'nav-15'],
    ['nav-15', 'nav-16'],
    ['nav-16', 'nav-17'],
    ['nav-17', 'nav-18'],
    ['nav-18', 'nav-19'],
    ['nav-19', 'nav-20'],
    ['nav-20', 'nav-21'],
    ['nav-21', 'nav-22'],
    ['nav-22', 'nav-52'],
    ['nav-22', 'nav-23'],
    ['nav-23', 'nav-48'],
    ['nav-48', 'nav-47'],
    ['nav-47', 'nav-25'],
    
    // === ERYMONT AREA ===
    ['nav-26', 'port-erymont'],
    ['port-erymont', 'nav-39'],
    ['nav-39', 'nav-31'],
    ['nav-31', 'nav-46'],
    ['nav-46', 'nav-47'],
    ['nav-46', 'nav-45'],
    ['nav-45', 'nav-44'],
    ['nav-44', 'nav-43'],
    ['nav-43', 'nav-42'],
    ['nav-42', 'nav-35'],
    ['nav-35', 'port-ukrolis'],
    
    // === YUOSBURN AREA ===
    ['nav-31', 'nav-30'],
    ['nav-30', 'port-yuosburn'],
    ['port-yuosburn', 'nav-32'],
    ['nav-32', 'nav-33'],
    ['nav-33', 'nav-34'],
    ['nav-34', 'nav-35'],
    ['nav-40', 'nav-41'],
    ['nav-41', 'nav-42'],
    ['nav-39', 'nav-40'],
    
    // === VOLTON AREA ===
    ['nav-43', 'nav-36'],
    ['nav-36', 'port-volton'],
    ['port-volton', 'nav-37'],
    ['nav-37', 'nav-38'],
    ['nav-38', 'nav-234'],
    ['nav-234', 'nav-60'],
    ['nav-60', 'nav-61'],
    ['nav-61', 'nav-62'],
    ['nav-62', 'nav-63'],
    ['nav-63', 'nav-64'],
    
    // === NORTH SEA (top of map) ===
    ['nav-64', 'nav-65'],
    ['nav-65', 'nav-66'],
    ['nav-66', 'nav-67'],
    ['nav-67', 'nav-68'],
    ['nav-68', 'nav-69'],
    ['nav-69', 'nav-70'],
    ['nav-70', 'nav-71'],
    ['nav-71', 'nav-72'],
    ['nav-72', 'nav-73'],
    ['nav-73', 'nav-74'],
    ['nav-74', 'nav-75'],
    ['nav-75', 'nav-83'],
    ['nav-83', 'nav-84'],
    ['nav-84', 'nav-85'],
    ['nav-85', 'nav-86'],
    ['nav-86', 'nav-87'],
    ['nav-87', 'nav-88'],
    ['nav-88', 'nav-89'],
    ['nav-89', 'nav-90'],
    ['nav-90', 'nav-91'],
    ['nav-91', 'nav-92'],
    ['nav-92', 'nav-93'],
    
    // === BORUGHAM INLET ===
    ['nav-75', 'nav-82'],
    ['nav-82', 'nav-81'],
    ['nav-81', 'nav-80'],
    ['nav-80', 'nav-79'],
    ['nav-79', 'nav-78'],
    ['nav-78', 'nav-77'],
    ['nav-77', 'port-borugham'],
    
    // === SLADA AREA ===
    ['nav-93', 'nav-94'],
    ['nav-94', 'port-slada'],
    ['nav-94', 'nav-95'],
    ['nav-95', 'nav-97'],
    ['nav-97', 'nav-98'],
    ['nav-98', 'nav-99'],
    ['nav-99', 'port-ardismouth'],
    
    // === OYARD / IOXYHULL ===
    ['nav-99', 'nav-100'],
    ['nav-100', 'port-oyard'],
    ['nav-100', 'nav-101'],
    ['nav-101', 'nav-213'],
    ['nav-213', 'nav-214'],
    ['nav-214', 'nav-215'],
    ['nav-215', 'nav-212'],
    ['nav-212', 'nav-211'],
    ['nav-211', 'nav-210'],
    ['nav-210', 'nav-209'],
    ['nav-209', 'nav-208'],
    ['nav-208', 'port-braewood'],
    ['nav-101', 'nav-102'],
    ['nav-102', 'nav-103'],
    ['nav-103', 'port-ioxyhull'],
    ['nav-103', 'nav-104'],
    
    // === EAST COAST (south) ===
    ['nav-104', 'nav-105'],
    ['nav-105', 'nav-106'],
    ['nav-106', 'nav-107'],
    ['nav-107', 'nav-216'],
    ['nav-216', 'nav-217'],
    ['nav-217', 'nav-218'],
    ['nav-218', 'nav-219'],
    ['nav-219', 'nav-220'],
    ['nav-220', 'nav-221'],
    ['nav-221', 'nav-222'],
    ['nav-222', 'nav-223'],
    ['nav-223', 'nav-224'],
    ['nav-224', 'nav-225'],
    ['nav-225', 'nav-226'],
    ['nav-226', 'nav-227'],
    ['nav-227', 'nav-228'],
    ['nav-228', 'nav-229'],
    ['nav-229', 'nav-230'],
    ['nav-230', 'nav-231'],
    ['nav-231', 'nav-232'],
    ['nav-232', 'nav-233'],
    ['nav-233', 'port-braewood'],
    ['nav-107', 'port-rens'],
    ['nav-107', 'nav-108'],
    ['nav-108', 'nav-109'],
    ['nav-109', 'nav-110'],
    ['nav-110', 'nav-111'],
    ['nav-111', 'nav-112'],
    ['nav-112', 'nav-113'],
    ['nav-113', 'nav-114'],
    ['nav-114', 'nav-115'],
    ['nav-115', 'nav-116'],
    ['nav-116', 'nav-117'],
    ['nav-117', 'nav-118'],
    ['nav-118', 'nav-119'],
    ['nav-119', 'nav-120'],
    ['nav-120', 'nav-152'],
    ['nav-120', 'nav-121'],
    ['nav-121', 'nav-122'],
    ['nav-122', 'nav-123'],
    ['nav-123', 'nav-124'],
    ['nav-124', 'nav-125'],
    ['nav-125', 'nav-126'],
    ['nav-126', 'nav-127'],
    ['nav-127', 'nav-128'],
    ['nav-128', 'nav-129'],
    ['nav-129', 'port-islefield'],
    
    // === WEST COAST (Kluimont to Kilson) ===
    ['port-kluimont', 'nav-5'],
    ['nav-5', 'nav-4'],
    ['nav-4', 'nav-27'],
    ['nav-27', 'nav-3'],
    ['nav-3', 'nav-28'],
    ['nav-28', 'nav-2'],
    ['nav-2', 'nav-29'],
    ['nav-29', 'nav-6'],
    ['nav-6', 'port-tarora'],
    ['port-tarora', 'nav-7'],
    ['nav-7', 'port-kilson'],
    ['nav-7', 'nav-8'],
    ['nav-8', 'nav-9'],
    ['nav-9', 'port-aresphia'],
    ['nav-9', 'nav-10'],
    ['nav-10', 'nav-11'],
    
    // === EIMGEND / RESROSS AREA ===
    ['nav-6', 'port-eimgend'],
    ['port-eimgend', 'nav-180'],
    ['nav-179', 'nav-180'],
    ['nav-180', 'nav-181'],
    ['nav-181', 'port-resross'],
    ['nav-181', 'nav-182'],
    ['nav-182', 'nav-183'],
    ['nav-183', 'nav-184'],
    ['nav-184', 'port-yhey'],
    ['nav-184', 'nav-185'],
    ['nav-185', 'nav-186'],
    ['nav-186', 'nav-187'],
    ['nav-187', 'nav-188'],
    ['nav-188', 'nav-189'],
    ['nav-189', 'nav-190'],
    ['nav-190', 'port-sable'],
    
    // === AJAG AREA ===
    ['nav-34', 'port-ajag'],
    ['port-ajag', 'nav-188'],
    
    // === SABLE TO FLISON ===
    ['nav-190', 'nav-191'],
    ['nav-191', 'nav-192'],
    ['nav-192', 'nav-193'],
    ['nav-193', 'nav-194'],
    ['nav-194', 'nav-163'],
    ['nav-163', 'port-flison'],
    ['nav-163', 'nav-164'],
    ['nav-164', 'nav-165'],
    ['nav-165', 'nav-166'],
    ['nav-166', 'nav-167'],
    ['nav-167', 'nav-168'],
    ['nav-168', 'port-dawerton'],
    
    // === SLONMORE AREA ===
    ['nav-246', 'port-slonmore'],
    ['nav-246', 'nav-247'],
    ['nav-247', 'nav-248'],
    ['nav-248', 'nav-251'],
    ['nav-251', 'nav-249'],
    ['nav-249', 'nav-250'],
    ['nav-250', 'nav-252'],
    ['nav-252', 'nav-253'],
    ['nav-253', 'nav-254'],
    ['nav-254', 'nav-203'],
    ['nav-203', 'nav-202'],
    ['nav-202', 'nav-201'],
    ['nav-201', 'nav-200'],
    ['nav-200', 'nav-199'],
    ['nav-199', 'port-mortling'],
    ['nav-199', 'nav-198'],
    ['nav-198', 'nav-197'],
    ['nav-197', 'nav-196'],
    ['nav-196', 'nav-195'],
    ['nav-195', 'nav-168'],
    
    // === ADHAM AREA ===
    ['nav-203', 'nav-204'],
    ['nav-204', 'port-adham'],
    ['nav-204', 'nav-205'],
    ['nav-205', 'nav-206'],
    ['nav-206', 'nav-207'],
    ['nav-207', 'nav-208'],
    
    // === VOLTON TO SLONMORE (inner sea) ===
    ['nav-234', 'nav-235'],
    ['nav-235', 'nav-236'],
    ['nav-236', 'nav-237'],
    ['nav-237', 'nav-238'],
    ['nav-238', 'nav-239'],
    ['nav-239', 'nav-240'],
    ['nav-240', 'nav-241'],
    ['nav-241', 'nav-242'],
    ['nav-242', 'nav-243'],
    ['nav-243', 'nav-244'],
    ['nav-244', 'nav-245'],
    ['nav-245', 'nav-246'],
    
    // === WEST COAST SOUTH (Kilson to Okcaster) ===
    ['port-kilson', 'nav-130'],
    ['nav-130', 'nav-131'],
    ['nav-131', 'nav-132'],
    ['nav-132', 'port-okcaster'],
    ['nav-132', 'nav-133'],
    ['nav-133', 'port-agosgas'],
    ['nav-133', 'nav-134'],
    ['nav-134', 'nav-135'],
    ['nav-135', 'nav-136'],
    ['nav-136', 'nav-137'],
    ['nav-137', 'nav-138'],
    ['nav-138', 'nav-139'],
    ['nav-139', 'nav-140'],
    ['nav-140', 'nav-141'],
    ['nav-141', 'nav-142'],
    ['nav-142', 'nav-143'],
    ['nav-143', 'nav-144'],
    ['nav-144', 'nav-145'],
    ['nav-145', 'nav-146'],
    ['nav-146', 'nav-147'],
    ['nav-147', 'nav-148'],
    ['nav-148', 'nav-149'],
    ['nav-149', 'nav-150'],
    ['nav-150', 'port-islefield'],
    ['nav-150', 'nav-129'],
    
    // === WRANDO ===
    ['port-wrando', 'nav-134'],
    
    // === AGOSRON AREA (inner bay) ===
    ['port-agosron', 'nav-160'],
    ['nav-160', 'nav-159'],
    ['nav-159', 'nav-158'],
    ['nav-158', 'nav-157'],
    ['nav-157', 'nav-156'],
    ['nav-156', 'nav-155'],
    ['nav-155', 'nav-169'],
    ['nav-169', 'nav-170'],
    ['nav-170', 'nav-171'],
    ['nav-171', 'nav-172'],
    ['nav-172', 'nav-173'],
    ['nav-173', 'nav-174'],
    ['nav-174', 'nav-175'],
    ['nav-175', 'nav-176'],
    ['nav-176', 'nav-177'],
    ['nav-177', 'nav-178'],
    ['nav-178', 'nav-168'],
    ['nav-160', 'nav-161'],
    ['nav-161', 'nav-162'],
    ['nav-162', 'nav-163'],
    ['nav-155', 'nav-154'],
    ['nav-154', 'nav-153'],
    ['nav-153', 'nav-152'],
    
    // === SOUTH COAST CONNECTIONS ===
    ['nav-151', 'nav-126'],
    ['nav-151', 'nav-127'],
  ],

  // Build adjacency graph from sea lanes
  _graph: null,
  _allNodes: null,

  buildGraph() {
    this._allNodes = { ...this.PORTS, ...this.NAV_NODES };
    this._graph = {};
    
    // Initialize all nodes
    for (const nodeId of Object.keys(this._allNodes)) {
      this._graph[nodeId] = [];
    }
    
    // Add bidirectional connections from sea lanes
    for (const [a, b] of this.SEA_LANES) {
      if (this._allNodes[a] && this._allNodes[b]) {
        const distance = this.getDistance(a, b);
        this._graph[a].push({ node: b, distance });
        this._graph[b].push({ node: a, distance });
      }
    }
    
    return this._graph;
  },

  // Get distance between two nodes in miles
  getDistance(nodeA, nodeB) {
    const a = this._allNodes[nodeA];
    const b = this._allNodes[nodeB];
    if (!a || !b) return Infinity;
    
    const dx = (b.x - a.x) * this.MAP_SCALE.percentToMiles;
    const dy = (b.y - a.y) * this.MAP_SCALE.percentToMiles;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // Dijkstra's algorithm for finding shortest path
  findPath(startId, endId) {
    if (!this._graph) this.buildGraph();
    
    // Normalize IDs - add port- prefix if needed for port names
    startId = this.normalizeNodeId(startId);
    endId = this.normalizeNodeId(endId);
    
    if (!this._allNodes[startId] || !this._allNodes[endId]) {
      return null;
    }
    
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(this._graph));
    
    for (const node of unvisited) {
      distances[node] = Infinity;
    }
    distances[startId] = 0;
    
    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current = null;
      let minDist = Infinity;
      for (const node of unvisited) {
        if (distances[node] < minDist) {
          minDist = distances[node];
          current = node;
        }
      }
      
      if (current === null || current === endId) break;
      
      unvisited.delete(current);
      
      for (const { node: neighbor, distance } of this._graph[current]) {
        if (!unvisited.has(neighbor)) continue;
        
        const alt = distances[current] + distance;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    }
    
    if (distances[endId] === Infinity) return null;
    
    // Reconstruct path
    const path = [];
    let current = endId;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
    
    return {
      path,
      distance: distances[endId],
      startName: this.getNodeName(startId),
      endName: this.getNodeName(endId)
    };
  },

  // Normalize node ID (handle port names without prefix)
  normalizeNodeId(id) {
    if (this._allNodes[id]) return id;
    if (this._allNodes[`port-${id.toLowerCase()}`]) return `port-${id.toLowerCase()}`;
    
    // Try to find by name
    for (const [nodeId, node] of Object.entries(this.PORTS)) {
      if (node.name && node.name.toLowerCase() === id.toLowerCase()) {
        return nodeId;
      }
    }
    return id;
  },

  // Get display name for a node
  getNodeName(nodeId) {
    if (this.PORTS[nodeId]) return this.PORTS[nodeId].name;
    return nodeId;
  },

  // Calculate travel time
  calculateTravel(startId, endId, pace = 'normal') {
    const result = this.findPath(startId, endId);
    if (!result) return null;
    
    const speed = this.TRAVEL_SPEEDS[pace] || this.TRAVEL_SPEEDS.normal;
    const days = result.distance / speed;
    
    return {
      ...result,
      pace,
      speed,
      days,
      daysFormatted: this.formatDays(days)
    };
  },

  formatDays(days) {
    if (days < 1) {
      const hours = Math.round(days * 24);
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    const wholeDays = Math.floor(days);
    const remainingHours = Math.round((days - wholeDays) * 24);
    
    if (remainingHours === 0) {
      return `${wholeDays} day${wholeDays !== 1 ? 's' : ''}`;
    }
    return `${wholeDays} day${wholeDays !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  },

  // Get all port names for dropdowns
  getPortList() {
    return Object.entries(this.PORTS)
      .map(([id, port]) => ({ id, name: port.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  // Check if a settlement is a port
  isPort(settlementName) {
    const normalized = `port-${settlementName.toLowerCase().replace(/\s+/g, '-')}`;
    return !!this.PORTS[normalized];
  }
};

// Initialize the graph on load
SHIP_NETWORK.buildGraph();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHIP_NETWORK;
}
