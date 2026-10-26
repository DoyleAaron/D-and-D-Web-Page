const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const C = require('../static/js/hq-core.js');
const D = require('../data/hq-data.js');
const catalogue = require('../data/hq-catalogue.js');

test('currency converts arbitrary denominations exactly, including unnormalised silver/copper', () => {
  assert.equal(C.coins('10', '70', '9'), 1709n);
  assert.equal(C.coins('0', '100', '150'), 1150n);
  assert.equal(C.coins('2', '3', '4', '1', '1'), 1284n);
  assert.deepEqual(C.convertCopper(C.coins('0', '0', '0', '1')), { xp: 62n, carry: 8n });
  for (const [coin, copper] of Object.entries({ pp: 1000n, gp: 100n, ep: 50n, sp: 10n, cp: 1n })) assert.equal(C.coinCopper('1', coin), copper);
  assert.throws(() => C.coinCopper('1', 'invalid'));
  assert.throws(() => C.coinCopper(C.MAX, 'pp'));
  assert.equal(C.money(1709n), '17 gp, 9 cp');
  assert.equal(C.money(-100n), '−1 gp');
  assert.equal(C.money(0n), '0 cp');
});
test('invalid or oversized inputs never silently coerce to valid money', () => {
  for (const value of ['', '-1', '1.5', '1e3', 'Infinity', 'NaN', '+2', '1,000', '0x10', '9'.repeat(16)]) assert.throws(() => C.whole(value));
  assert.throws(() => C.coins(C.MAX, '0', '0'));
  assert.throws(() => C.coins('9999999999999', '10', '0'));
  assert.equal(C.coins('9999999999999', '9', '9'), C.MAX);
});
test('XP uses full copper, awards per character and carries remainder', () => {
  assert.deepEqual(C.convertCopper(C.coins('1', '0', '0')), { xp: 6n, carry: 4n });
  assert.deepEqual(C.convertCopper('12', '4'), { xp: 1n, carry: 0n });
  assert.deepEqual(C.convertCopper('0', '15'), { xp: 0n, carry: 15n });
  assert.deepEqual(C.convertCopper('2009'), { xp: 125n, carry: 9n });
  assert.equal(C.crewShare(1709n, 25), 427n);
  assert.deepEqual(C.convertCopper('1709', '4'), { xp: 107n, carry: 1n });
  assert.throws(() => C.convertCopper('0', '16'));
  assert.throws(() => C.convertCopper(C.MAX, '1'));
});
test('public XP conversion matches the existing calculator for valid carries', t => {
  const localCalculator = path.join(__dirname, '../DM_Private/Campaign 2/Coin to XP Calculator.html');
  if (!fs.existsSync(localCalculator)) { t.skip('Optional local DM calculator is not included in the website commit.'); return; }
  const source = fs.readFileSync(localCalculator, 'utf8');
  const fn = source.slice(source.indexOf('function convertCopper('), source.indexOf('const fmt ='));
  const context = vm.createContext({}); vm.runInContext(fn, context);
  for (const deposit of [0, 1, 15, 16, 100, 1709, 2009, 1000000]) for (let carry = 0; carry < 16; carry++) {
    const old = context.convertCopper(String(deposit), String(carry)), current = C.convertCopper(String(deposit), String(carry));
    assert.equal(current.xp, old.xp); assert.equal(current.carry, old.carry);
  }
});
test('Seven at the Gate preserves all thresholds, 49 wins per side and payout', () => {
  for (const choice of ['low', 'high']) {
    let wins = 0;
    for (let roll = 1; roll <= 100; roll++) {
      const result = C.resolveGame('seven', '5', choice, [roll]);
      wins += Number(result.win);
      assert.equal(result.returned, result.win ? 10n : 0n);
      assert.equal(result.net, result.win ? 5n : -5n);
      if ([50, 51].includes(roll)) assert.equal(result.win, false);
    }
    assert.equal(wins, 49);
  }
  for (const stake of ['0', '6', '1.5']) assert.throws(() => C.validateStake('seven', stake));
});
test('High Bones enumerates 81 winning outcomes of 216 with exact copper payouts', () => {
  let wins = 0;
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) {
    const result = C.resolveGame('bones', 2, null, [a, b, c]); wins += Number(result.win);
    assert.equal(result.returned, result.win ? 6n : 0n);
    assert.equal(result.net, result.win ? 4n : -2n);
  }
  assert.equal(wins, 81);
  assert.equal(C.resolveGame('bones', 4, null, [4, 4, 4]).returned, 12n);
  assert.equal(C.resolveGame('bones', 4, null, [4, 4, 3]).returned, 0n);
  for (const stake of ['0', '1', '3', '5']) assert.throws(() => C.validateStake('bones', stake));
});
test('Empty Cup has exactly one winning cup and returns four times stake total', () => {
  for (let choice = 1; choice <= 4; choice++) {
    let wins = 0;
    for (let cup = 1; cup <= 4; cup++) {
      const result = C.resolveGame('cup', 100, choice, [cup]); wins += Number(result.win);
      assert.equal(result.returned, result.win ? 400n : 0n);
      assert.equal(result.net, result.win ? 300n : -100n);
    }
    assert.equal(wins, 1);
  }
  assert.equal(C.resolveGame('cup', 1, 2, [2]).returned, 4n);
  assert.throws(() => C.resolveGame('cup', 0, 1, [1]));
  assert.throws(() => C.resolveGame('cup', 1, 0, [1]));
  assert.throws(() => C.resolveGame('cup', C.MAX, 1, [1]));
});
test('random generation uses rejection sampling without modulo bias', () => {
  const values = [4294967295, 5]; let calls = 0;
  const random = { getRandomValues(buffer) { buffer[0] = values[calls++]; return buffer; } };
  assert.equal(C.randomInt(6, random), 6); assert.equal(calls, 2);
  for (let n = 0; n < 4; n++) assert.equal(C.randomInt(4, { getRandomValues(buffer) { buffer[0] = n; } }), n + 1);
});
test('every game accepts every denomination with exact payouts and unchanged stake counts', () => {
  for (const [coin, copper] of Object.entries(C.COINS)) {
    const seven = C.resolveGame('seven', '1', 'low', [1], coin);
    assert.equal(seven.stake, copper); assert.equal(seven.returned, 2n * copper);
    const bones = C.resolveGame('bones', '2', null, [4, 4, 4], coin);
    assert.equal(bones.stake, 2n * copper); assert.equal(bones.returned, 6n * copper); assert.equal(bones.net, 4n * copper);
    const cup = C.resolveGame('cup', '1', 1, [1], coin);
    assert.equal(cup.stake, copper); assert.equal(cup.returned, 4n * copper);
    assert.throws(() => C.validateStake('seven', '6', coin));
    assert.throws(() => C.validateStake('bones', '3', coin));
    assert.throws(() => C.validateStake('cup', '1.5', coin));
  }
});
test('scouting follows confirmed wealth order, increases with detail and charges magical ward most', () => {
  const { districts, depths } = D.scouting;
  assert.equal(districts.length, 10);
  assert.equal(districts[0].name, 'Lower Ward');
  assert.ok(C.scoutCost(districts[0], depths[0]) >= 1000n);
  for (let i = 1; i < districts.length; i++) for (const depth of depths) assert.ok(C.scoutCost(districts[i], depth) > C.scoutCost(districts[i - 1], depth));
  for (const district of districts) for (let i = 1; i < depths.length; i++) assert.ok(C.scoutCost(district, depths[i]) > C.scoutCost(district, depths[i - 1]));
  assert.equal(districts.at(-1).name, 'Magistracy Quarter'); assert.equal(districts.at(-1).magical, true);
  assert.ok(depths.every(depth => depth.requirement === 'All registered crews'));
});
test('trader preserves campaign retail, low buy rates, bundle units and itemised totals', () => {
  assert.ok(catalogue.length >= 150);
  assert.equal(new Set(catalogue.map(item => item.id)).size, catalogue.length);
  const sword = catalogue.find(item => item.name === 'Longsword'), oil = catalogue.find(item => item.name === 'Oil flask');
  assert.equal(oil.retailCp, '100'); assert.equal(C.buyOffer(sword, D.trader.rates), 225n);
  const result = C.traderTotal([{ id: sword.id, quantity: '3' }, { id: oil.id, quantity: '2' }], catalogue, D.trader.rates);
  assert.equal(result.total, 695n); assert.equal(result.items[0].subtotal, 675n);
  assert.equal(C.buyOffer({ retailCp: '4', category: 'Ammunition' }, D.trader.rates), 0n);
  assert.equal(C.buyOffer({ retailCp: '999', category: 'Gear', offerCp: '50' }, D.trader.rates), 50n);
  assert.equal(C.traderTotal([], catalogue, D.trader.rates).total, 0n);
  for (const quantity of ['', '-1', '0', '1.5', '1000001']) assert.throws(() => C.traderTotal([{ id: sword.id, quantity }], catalogue, D.trader.rates));
  assert.throws(() => C.traderTotal([{ id: 'missing', quantity: 1 }], catalogue, D.trader.rates));
  assert.throws(() => C.traderTotal([{ id: 'huge', quantity: 1000000 }], [{ id: 'huge', name: 'Test', offerCp: String(C.MAX) }], D.trader.rates));
});
test('2014 catalogue audit adds missing mundane gear and preserves campaign overrides', () => {
  const expected = {
    'Spyglass': '100000', 'Climber’s kit': '2500', 'Miner’s pick': '200',
    'Alchemist’s fire, flask': '5000', 'Poisoner’s kit': '5000', 'Bagpipes': '3000',
    'Arcane focus: orb': '2000', 'Holy symbol: reliquary': '500',
    'Burglar’s pack, complete': '1600', 'Riding saddle': '1000', 'Silk, 1 square yard': '1000',
    'Oil flask': '100', 'Hooded lantern': '800', 'Bullseye lantern': '1200',
    'Small bell': '10', 'Blank paper, 5 sheets': '10', 'Empty glass vial': '50'
  };
  for (const [name, retail] of Object.entries(expected)) assert.equal(catalogue.find(item => item.name === name)?.retailCp, retail, name);
  assert.ok(catalogue.length >= 240);
  for (const item of catalogue) {
    assert.ok(C.whole(item.retailCp) >= 0n, item.name);
    assert.ok(C.buyOffer(item, D.trader.rates) <= C.whole(item.retailCp), item.name);
  }
  const byName = name => catalogue.find(item => item.name === name).id;
  const sale = C.traderTotal([
    { id: byName('Spyglass'), quantity: '1' },
    { id: byName('Burglar’s pack, complete'), quantity: '2' },
    { id: byName('Silk, 1 square yard'), quantity: '3' }
  ], catalogue, D.trader.rates);
  assert.equal(sale.total, 10620n); // 100 gp + 3 gp 2 sp + 3 gp.
  assert.ok(!catalogue.some(item => /potion of healing|basic healing potion/i.test(item.name)));
});
test('standings are recorded explicitly, never sorted by calculated deposits', () => {
  assert.equal(D.standings.length, 21);
  assert.deepEqual(D.standings.at(-1), { rank: 21, team: 'Fantastic 4', depositedCp: '2400' });
  assert.deepEqual(D.standings[16], { rank: 17, team: 'Hollow Pence', depositedCp: '12000' });
  assert.deepEqual(D.standings.slice(17, 20).map(row => [row.rank, row.team]), [[18, 'Candle Dogs'], [19, 'Sixth Key'], [20, 'Marsh Rats']]);
});
test('public HQ assets contain no private source paths, campaign hooks or persistence APIs', () => {
  for (const file of ['hq.html', 'data/hq-data.js', 'data/hq-catalogue.js', 'static/js/hq.js', 'static/js/hq-core.js']) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(source, /DM_Private|chair stash|\bVell\b|localStorage|sessionStorage|firebase|fetch\(/i, file);
  }
});
