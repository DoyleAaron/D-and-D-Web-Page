/* Player-safe manual configuration. Never import DM files into the browser. */
(function (root) {
  'use strict';
  const config = {
    guild: 'The Gilded Hand', front: 'Rook & Ledger', town: 'Sord',
    currentCrewPercent: 25,
    boardNote: 'Posted ranks are maintained by the DM at bank close. Deposits shown can be newer than the posted rank.',
    sourceNotice: 'Fantastic 4’s retained receipt entries total 20 gp, 9 cp, including the initial 10 sp once. Older 1 gp lifetime summaries conflict with those entries; the sources and timing of later receipts remain unresolved. Posted rank remains 21 until the DM records a bank close.',
    standings: [
      [1, 'Black Lanterns', '1800000'], [2, 'Velvet Knives', '1300000'],
      [3, 'Ash Runners', '1000000'], [4, 'Gilt Foxes', '850000'],
      [5, 'Iron Moths', '700000'], [6, 'Red Ledger', '550000'],
      [7, 'Copper Choir', '420000'], [8, 'Dusk Cart', '320000'],
      [9, 'Silver Hooks', '240000'], [10, 'Nine Crows', '180000'],
      [11, 'North Gate', '130000'], [12, 'Lantern Jacks', '90000'],
      [13, 'Low Tide', '60000'], [14, 'Stone Thieves', '35000'],
      [15, 'Blue Chalk', '22500'], [16, 'Rose Wire', '15000'],
      [17, 'Hollow Pence', '12000'], [18, 'Candle Dogs', '10000'],
      [19, 'Sixth Key', '7000'], [20, 'Marsh Rats', '4500'],
      [21, 'Fantastic 4', '2009']
    ].map(([rank, team, depositedCp]) => ({ rank, team, depositedCp })),
    ranks: [
      { ranks: '21–16', share: 25, access: 'Ordinary jobs, quarters and basic services' },
      { ranks: '15–9', share: 30, access: 'Records and map room' },
      { ranks: '8–5', share: 35, access: 'Planning suites and specialist work' },
      { ranks: '4–3', share: 40, access: 'Secure stores and ward lab services' },
      { ranks: '2–1', share: 45, access: 'Senior gallery by invitation; negotiated offers' }
    ],
    missions: [
      { name: 'Ordinary', rank: 21, description: 'Petty theft and straightforward collections on the open board.' },
      { name: 'Established', rank: 15, description: 'Better paid work with more demanding preparation and security.' },
      { name: 'Specialist', rank: 8, description: 'Complex targets that call for specialist planning and equipment.' },
      { name: 'Restricted', rank: 4, description: 'Heavily secured contracts with demanding objectives.' },
      { name: 'Invitation only', rank: 2, description: 'Senior offers require a separate invitation as well as standing.' }
    ],
    scouting: {
      districts: [
        { id: 'lower', name: 'Lower Ward', location: 'Inside the walls', baseCp: '1000' },
        { id: 'outer', name: 'Outer Boroughs', location: 'Outside the walls', baseCp: '1500' },
        { id: 'crossroads', name: 'Old Cross Roads', location: 'Inside the walls', baseCp: '2000' },
        { id: 'west', name: 'West Gate', location: 'Outside the walls', baseCp: '3000' },
        { id: 'stable', name: 'Long Stable', location: 'Outside the walls', baseCp: '4000' },
        { id: 'craft', name: 'Craftsman Ward', location: 'Inside the walls', baseCp: '5000' },
        { id: 'seal', name: 'Seal House', location: 'Inside the walls', baseCp: '6500' },
        { id: 'merchant', name: 'Merchant Heights', location: 'Inside the walls', baseCp: '8000' },
        { id: 'platinum', name: 'Platinum Shelter', location: 'Inside the walls', baseCp: '10000' },
        { id: 'magistracy', name: 'Magistracy Quarter', location: 'Inside the walls · magical district', magical: true, baseCp: '15000' }
      ],
      depths: [
        { name: 'Basic observation', multiplier: 1, requirement: 'All registered crews', description: 'Visible approaches and a broad routine; no interior guarantee.' },
        { name: 'Extended observation', multiplier: 2, requirement: 'All registered crews', description: 'Repeat observations and route comparisons.' },
        { name: 'Detailed reconnaissance', multiplier: 4, requirement: 'All registered crews', description: 'Tested routines, service access and a focused security assessment.' }
      ]
    },
    quarters: [
      { name: 'Four private rooms', rank: 21, size: 'Four separate 10 × 10 ft rooms', description: 'Each character has a bed, straw mattress, wool blanket, small desk, chair, wash jug, lantern hook and locking wooden chest.', personal: 'One chest: 12 cubic feet / 300 lb per character, whichever fills first.', shared: 'No additional shared storage. Four chests total 48 cubic feet / 1,200 lb, divided between the four rooms.' },
      { name: 'Comfortable rooms', rank: 15, size: 'Four separate 15 × 10 ft rooms', description: 'Proper mattresses, writing desks, wardrobes, lamps and two locking chests in each room.', personal: 'Two chests: 24 cubic feet / 600 lb per character.', shared: 'One shared cupboard: 12 cubic feet / 300 lb, additional to personal storage.' },
      { name: 'Planning suite', rank: 8, size: 'Four 15 × 15 ft bedrooms and a shared planning room', description: 'Upholstered beds, bookcases, desks, lockable cabinets, a map table and guest seating.', personal: 'Lockable cabinets: 36 cubic feet / 900 lb per character.', shared: 'Shared storeroom: 60 cubic feet / 1,500 lb, additional to personal storage.' },
      { name: 'Secure suite', rank: 4, size: 'Four 20 × 15 ft bedrooms and a shared secure store', description: 'Quality beds, private writing areas, wardrobes, reinforced cabinets and a substantial briefing table. Storage is mundane, not magically protected.', personal: 'Reinforced cabinets: 48 cubic feet / 1,200 lb per character.', shared: 'Shared secure store: 120 cubic feet / 3,000 lb, additional to personal storage.' }
    ],
    trader: {
      rates: { default: 10, Weapons: 15, Ammunition: 10, 'Light armour': 15, 'Medium armour': 15, 'Heavy armour': 15, Shields: 15, Tools: 10, Salvage: 5 }
    },
    map: {
      image: 'static/images/hq-placeholder.svg', alt: 'Schematic headquarters service plan; final map to follow.',
      markers: [
        { service: 'counting', x: 20, y: 24 }, { service: 'gambling', x: 50, y: 24 },
        { service: 'leaderboard', x: 80, y: 24 }, { service: 'missions', x: 20, y: 72 },
        { service: 'scout', x: 40, y: 72 }, { service: 'quarters', x: 60, y: 72 },
        { service: 'trader', x: 80, y: 72 }
      ]
    },
    services: [
      { id: 'counting', name: 'Counting house', staff: 'Beren Holt', description: 'Coin, XP and copper carry' },
      { id: 'gambling', name: 'Gambling hall', staff: 'Nell Quill', description: 'Three games at the Copper Corner' },
      { id: 'leaderboard', name: 'Leaderboard', staff: 'The Lifetime Board', description: '21 registered crews' },
      { id: 'missions', name: 'Mission desk', staff: 'Mara Venn', description: 'Difficulty and rank requirements' },
      { id: 'scout', name: 'Scout desk', staff: 'Ivo Fen', description: 'Price a report in Sord' },
      { id: 'quarters', name: 'Quarters', staff: 'Captain Sera Doss · house security', description: 'Rooms, furnishings and storage' },
      { id: 'trader', name: 'Trader', staff: 'Tamsin Rook', description: 'Mundane goods and sale estimates' }
    ]
  };
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.HQData = config;
})(typeof globalThis !== 'undefined' ? globalThis : this);
