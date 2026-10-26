/* Pure, non-persistent headquarters calculations. Integer copper only. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HQCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX = 999999999999999n;
  const COINS = Object.freeze({ pp: 1000n, gp: 100n, ep: 50n, sp: 10n, cp: 1n });
  function whole(value, label = 'Amount', maximum = MAX) {
    const text = String(value).trim();
    if (!/^\d{1,15}$/.test(text)) throw new Error(`${label}: enter a non-negative whole number (up to 15 digits).`);
    const number = BigInt(text);
    if (number > maximum) throw new Error(`${label}: maximum is ${maximum.toLocaleString('en-GB')}.`);
    return number;
  }
  function bounded(value) {
    if (value < 0n || value > MAX) throw new Error('Total exceeds the calculator limit of 999,999,999,999,999 cp.');
    return value;
  }
  function coinCopper(value, denomination = 'cp') {
    if (!Object.hasOwn(COINS, denomination)) throw new Error('Choose a valid coin denomination.');
    return bounded(whole(value, 'Coin amount') * COINS[denomination]);
  }
  function coins(gp, sp, cp, pp = '0', ep = '0') {
    return bounded(coinCopper(pp, 'pp') + coinCopper(gp, 'gp') + coinCopper(ep, 'ep') + coinCopper(sp, 'sp') + coinCopper(cp, 'cp'));
  }
  function money(cp) {
    const amount = BigInt(cp), value = amount < 0n ? -amount : amount;
    const parts = [];
    if (value / 100n) parts.push(`${(value / 100n).toLocaleString('en-GB')} gp`);
    if (value % 100n / 10n) parts.push(`${value % 100n / 10n} sp`);
    if (value % 10n || !parts.length) parts.push(`${value % 10n} cp`);
    return (amount < 0n ? '−' : '') + parts.join(', ');
  }
  // Reuses convertCopper's BigInt division/remainder from the campaign XP tool.
  function convertCopper(deposit, carry = '0') {
    const total = bounded(whole(deposit) + whole(carry, 'Previous carry', 15n));
    return { xp: total / 16n, carry: total % 16n };
  }
  function crewShare(deposit, percent) {
    return whole(deposit) * whole(percent, 'Crew percentage', 100n) / 100n;
  }
  function randomInt(sides, random = globalThis.crypto) {
    if (!Number.isSafeInteger(sides) || sides < 1 || sides > 4294967296) throw new Error('Invalid random range.');
    const range = 4294967296, limit = Math.floor(range / sides) * sides;
    const buffer = new Uint32Array(1);
    do { random.getRandomValues(buffer); } while (buffer[0] >= limit);
    return buffer[0] % sides + 1;
  }
  function die(value, sides) {
    if (!Number.isInteger(value) || value < 1 || value > sides) throw new Error('Invalid dice result.');
    return value;
  }
  function validateStake(game, value, denomination = 'cp') {
    const amount = whole(value, 'Stake');
    if (game === 'seven' && (amount < 1n || amount > 5n)) throw new Error('Seven at the Gate accepts 1–5 coins of the selected denomination.');
    else if (game === 'bones' && amount !== 2n && amount !== 4n) throw new Error('High Bones accepts 2 or 4 coins of the selected denomination; payouts use whole copper.');
    else if (game === 'cup' && amount < 1n) throw new Error('The Empty Cup requires at least one coin of the selected denomination.');
    else if (!['seven', 'bones', 'cup'].includes(game)) throw new Error('Unknown game.');
    const stake = coinCopper(amount, denomination);
    bounded(stake * (game === 'cup' ? 4n : 3n));
    return stake;
  }
  function resolveGame(game, value, choice, rolls, denomination = 'cp') {
    const stake = validateStake(game, value, denomination);
    let win, returned;
    if (game === 'seven') {
      if (!['low', 'high'].includes(choice) || rolls.length !== 1) throw new Error('Choose Low or High.');
      const roll = die(rolls[0], 100);
      win = choice === 'low' ? roll <= 49 : roll >= 52;
      returned = win ? stake * 2n : 0n;
    } else if (game === 'bones') {
      if (rolls.length !== 3) throw new Error('High Bones needs three dice.');
      win = rolls.reduce((sum, roll) => sum + die(roll, 6), 0) >= 12;
      returned = win ? stake * 3n : 0n;
    } else {
      die(choice, 4);
      if (rolls.length !== 1) throw new Error('The Empty Cup needs one winning cup.');
      win = choice === die(rolls[0], 4);
      returned = win ? stake * 4n : 0n;
    }
    return { win, stake, returned, net: returned - stake };
  }
  function scoutCost(district, depth) {
    return bounded(whole(district.baseCp) * whole(depth.multiplier));
  }
  function buyOffer(item, rates) {
    if (item.offerCp !== undefined) return whole(item.offerCp);
    const percent = rates[item.category] ?? rates.default;
    return whole(item.retailCp) * whole(percent, 'Buy percentage', 100n) / 100n;
  }
  function traderTotal(lines, catalogue, rates) {
    let total = 0n;
    const items = lines.map(line => {
      const item = catalogue.find(candidate => candidate.id === line.id);
      if (!item) throw new Error('Unknown catalogue item.');
      const quantity = whole(line.quantity, `${item.name} quantity`, 1000000n);
      if (quantity < 1n) throw new Error('Sale quantities must be at least one.');
      const unit = buyOffer(item, rates), subtotal = bounded(unit * quantity);
      total = bounded(total + subtotal);
      return { item, quantity, unit, subtotal };
    });
    return { items, total };
  }
  return { MAX, COINS, whole, bounded, coinCopper, coins, money, convertCopper, crewShare, randomInt, validateStake, resolveGame, scoutCost, buyOffer, traderTotal };
});
