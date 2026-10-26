/* Retail reference in COPPER per named item/bundle. Current buy percentages live in hq-data.js.
 * Campaign stock takes precedence over the 2014 baseline. No stock counts or inventory writes.
 * Salvage reference values are defaults, not mission-specific fixed offers.
 * 2014 equipment audit: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment
 * SRD 5.1 attribution and deliberate campaign price overrides: docs/HQ.md. */
(function (root) {
  'use strict';
  const groups = {
    Weapons: [
      ['Club', 10], ['Dagger', 200], ['Greatclub', 20], ['Handaxe', 500], ['Javelin', 50],
      ['Light hammer', 200], ['Mace', 500], ['Quarterstaff', 20], ['Sickle', 100], ['Spear', 100],
      ['Light crossbow', 2500], ['Dart', 5], ['Shortbow', 2500], ['Sling', 10],
      ['Battleaxe', 1000], ['Flail', 1000], ['Glaive', 2000], ['Greataxe', 3000],
      ['Greatsword', 5000], ['Halberd', 2000], ['Lance', 1000], ['Longsword', 1500],
      ['Maul', 1000], ['Morningstar', 1500], ['Pike', 500], ['Rapier', 2500],
      ['Scimitar', 2500], ['Shortsword', 1000], ['Trident', 500], ['War pick', 500],
      ['Warhammer', 1500], ['Whip', 200], ['Blowgun', 1000], ['Hand crossbow', 7500],
      ['Heavy crossbow', 5000], ['Longbow', 5000], ['Net', 100]
    ],
    Ammunition: [['Arrows, bundle of 20', 100], ['Crossbow bolts, case of 20', 100], ['Sling bullets, pouch of 20', 4], ['Blowgun needles, 50', 100]],
    'Light armour': [['Padded armour', 500], ['Leather armour', 1000], ['Studded leather', 4500]],
    'Medium armour': [['Hide armour', 1000], ['Chain shirt', 5000], ['Scale mail', 5000], ['Breastplate', 40000], ['Half plate', 75000]],
    'Heavy armour': [['Ring mail', 3000], ['Chain mail', 7500], ['Splint armour', 20000], ['Plate armour', 150000]],
    Shields: [['Shield', 1000]],
    Gear: [
      ['Chalk stick', 1], ['Candle', 1], ['String, 20 feet', 2], ['Cloth hood for a lantern', 3],
      ['Wooden wedge', 2], ['Rag bundle', 2], ['Torch', 1], ['Iron nails, pack of 10', 10],
      ['Small bell', 10], ['Blank paper, 5 sheets', 10], ['Charcoal pencil', 2], ['Sealing wax stick', 10],
      ['Bandage roll', 20], ['Soap bar', 2], ['Dry food, one day', 50], ['Oil flask', 100],
      ['Hemp rope, 50 feet', 100], ['Silk rope, 50 feet', 1000], ['Grappling hook', 200],
      ['Folding ladder, 10 feet', 300], ['Hooded lantern', 800], ['Bullseye lantern', 1200],
      ['Tinderbox', 50], ['Steel mirror, hand-sized', 500], ['Ten-foot wooden pole', 5],
      ['Small iron lock and key', 1000], ['Manacles and key', 200], ['Fine ink bottle', 1000],
      ['Bedroll', 100], ['Wool blanket', 50], ['Two-person tent', 200], ['Healer’s kit, unused', 500],
      ['Acid vial', 2500], ['Ball bearings, bag of 1,000', 100], ['Caltrops, bag of 20', 100],
      ['Chain, 10 feet', 500], ['Fishing tackle', 100], ['Hunting trap', 500], ['Mess kit', 20],
      ['Shovel', 200], ['Whetstone', 1], ['Parchment, sheet', 10], ['Hourglass', 2500],
      ['Abacus', 200], ['Ink pen', 2], ['Iron spikes, 10', 100], ['Chalk/string/wax recon bundle', 200],
      ['Disarm consumables, 3 unused uses', 600],
      ['Alchemist’s fire, flask', 5000], ['Antitoxin, vial', 5000], ['Block and tackle', 100],
      ['Book, ordinary', 2500], ['Climber’s kit', 2500], ['Component pouch', 2500],
      ['Sledge hammer', 200], ['Holy water, flask', 2500], ['Straight ladder, 10 feet', 10],
      ['Oil lamp', 50], ['Magnifying glass', 10000], ['Perfume, vial', 500], ['Miner’s pick', 200],
      ['Basic poison, vial', 10000], ['Portable ram', 400], ['Merchant’s scale', 500],
      ['Signal whistle', 5], ['Signet ring, ordinary', 500], ['Spellbook, blank', 5000], ['Spyglass', 100000]
    ],
    Tools: [
      ['Crowbar', 200], ['Hammer', 100], ['Pitons, pack of 10', 50], ['Thieves’ tools', 2500],
      ['Spare picks, pack of 3', 500], ['Trap-disarming kit', 3000], ['Disguise kit', 2500],
      ['Forgery kit', 1500], ['Alchemist’s supplies', 5000], ['Brewer’s supplies', 2000],
      ['Calligrapher’s supplies', 1000], ['Carpenter’s tools', 800], ['Cartographer’s tools', 1500],
      ['Cobbler’s tools', 500], ['Cook’s utensils', 100], ['Glassblower’s tools', 3000],
      ['Jeweler’s tools', 2500], ['Leatherworker’s tools', 500], ['Mason’s tools', 1000],
      ['Painter’s supplies', 1000], ['Potter’s tools', 1000], ['Smith’s tools', 2000],
      ['Tinker’s tools', 5000], ['Weaver’s tools', 100], ['Woodcarver’s tools', 100],
      ['Herbalism kit', 500], ['Navigator’s tools', 2500], ['Dice set', 10], ['Playing card set', 50],
      ['Drum', 600], ['Flute', 200], ['Lute', 3500], ['Viol', 3000],
      ['Poisoner’s kit', 5000], ['Dragonchess set', 100], ['Three-Dragon Ante set', 100],
      ['Bagpipes', 3000], ['Dulcimer', 2500], ['Lyre', 3000], ['Horn', 300],
      ['Pan flute', 1200], ['Shawm', 200]
    ],
    Clothing: [
      ['Cheap gloves, pair', 20], ['Dark neck scarf', 20], ['Wool hood', 30], ['Common clothes, set', 50],
      ['Traveller’s clothes, set', 200], ['Costume clothes, set', 500], ['Fine clothes, set', 1500], ['Robes', 100]
    ],
    Containers: [
      ['Empty sack', 1], ['Clay cup', 2], ['Stoppered clay flask', 2], ['Empty glass vial', 50],
      ['Waterskin, filled', 20], ['Backpack', 200], ['Belt pouch', 50], ['Barrel', 200], ['Basket', 40],
      ['Bucket', 5], ['Chest', 500], ['Glass bottle', 200], ['Jug or pitcher', 2], ['Iron pot', 200],
      ['Quiver', 100], ['Crossbow bolt case', 100], ['Map or scroll case', 100], ['Tankard', 2]
    ],
    'Spellcasting supplies': [
      ['Arcane focus: crystal', 1000], ['Arcane focus: orb', 2000], ['Arcane focus: rod', 1000],
      ['Arcane focus: staff', 500], ['Arcane focus: wand', 1000],
      ['Druidic focus: sprig of mistletoe', 100], ['Druidic focus: totem', 100],
      ['Druidic focus: wooden staff', 500], ['Druidic focus: yew wand', 1000],
      ['Holy symbol: amulet', 500], ['Holy symbol: emblem', 500], ['Holy symbol: reliquary', 500]
    ],
    'Equipment packs': [
      ['Burglar’s pack, complete', 1600], ['Diplomat’s pack, complete', 3900],
      ['Dungeoneer’s pack, complete', 1200], ['Entertainer’s pack, complete', 4000],
      ['Explorer’s pack, complete', 1000], ['Priest’s pack, complete', 1900], ['Scholar’s pack, complete', 4000]
    ],
    'Tack and harness': [
      ['Bit and bridle', 200], ['Saddlebags', 400], ['Riding saddle', 1000], ['Pack saddle', 500],
      ['Military saddle', 2000], ['Exotic saddle', 6000], ['Animal feed, one day (10 lb)', 5]
    ],
    'Trade goods': [
      ['Wheat, 1 lb', 1], ['Flour, 1 lb', 2], ['Salt, 1 lb', 5], ['Iron, 1 lb', 10],
      ['Canvas, 1 square yard', 10], ['Copper, 1 lb', 50], ['Cotton cloth, 1 square yard', 50],
      ['Ginger, 1 lb', 100], ['Cinnamon, 1 lb', 200], ['Pepper, 1 lb', 200], ['Cloves, 1 lb', 300],
      ['Silver, 1 lb', 500], ['Linen, 1 square yard', 500], ['Silk, 1 square yard', 1000],
      ['Saffron, 1 lb', 1500], ['Gold bullion, 1 lb (not coins)', 5000], ['Platinum bullion, 1 lb (not coins)', 50000]
    ],
    Salvage: [
      ['Scrap iron, 1 lb lot', 10], ['Scrap copper, 1 lb lot', 50], ['Tin cup set, ordinary', 40],
      ['Iron cooking pan, ordinary', 100], ['Canvas satchel, ordinary', 50], ['Copper trinket, ordinary', 20],
      ['Glass offcuts, 1 lb lot', 20], ['Cloth offcuts, 1 lb lot', 10], ['Timber offcuts, 10 lb lot', 20]
    ]
  };
  const catalogue = Object.entries(groups).flatMap(([category, rows]) => rows.map(([name, retailCp]) => ({
    id: name.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
    name, category, retailCp: String(retailCp)
  })));
  if (typeof module === 'object' && module.exports) module.exports = catalogue;
  else root.HQCatalogue = catalogue;
})(typeof globalThis !== 'undefined' ? globalThis : this);
