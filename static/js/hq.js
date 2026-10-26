/* Headquarters UI: ephemeral calculations only; no storage, account APIs or campaign writes. */
(() => {
  'use strict';
  const D = HQData, C = HQCore, catalogue = HQCatalogue;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fmt = C.money;
  const rank = value => value === 21 ? 'All registered crews' : `Rank ${value} or better`;
  const stat = (name, value) => `<div><dt>${escape(name)}</dt><dd>${escape(value)}</dd></div>`;

  $('services').innerHTML = D.services.map((service, index) => `<a class="service-card" href="#${service.id}"><span class="service-number">0${index + 1}</span><strong>${escape(service.name)}</strong><small>${escape(service.description)}</small></a>`).join('');
  $('map-image').src = D.map.image;
  $('map-image').alt = D.map.alt;
  $('map-image').addEventListener('error', () => {
    if (!$('map-image').src.endsWith('hq-placeholder.svg')) $('map-image').src = 'static/images/hq-placeholder.svg';
  });
  $('map-markers').innerHTML = D.map.markers.map(marker => {
    const index = D.services.findIndex(service => service.id === marker.service);
    if (index < 0 || !Number.isFinite(marker.x) || !Number.isFinite(marker.y) || marker.x < 0 || marker.x > 100 || marker.y < 0 || marker.y > 100) return '';
    return `<a href="#${marker.service}" class="map-marker" style="left:${marker.x}%;top:${marker.y}%" aria-label="${escape(D.services[index].name)}" title="${escape(D.services[index].name)}">${index + 1}</a>`;
  }).join('');
  // Move focus as well as scroll so keyboard users land at the selected service.
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.focus({ preventScroll: true });
  }));

  function count() {
    $('counting-error').textContent = '';
    try {
      const fields = $('counting-form').elements;
      const deposit = C.coins(fields.gp.value, fields.sp.value, fields.cp.value, fields.pp.value, fields.ep.value);
      const result = C.convertCopper(deposit, fields.carry.value.trim() || '0');
      const share = C.crewShare(deposit, D.currentCrewPercent);
      $('counting-result').innerHTML = `<span>XP per character</span><strong class="big-number">${result.xp.toLocaleString('en-GB')}</strong><dl>${stat('Full deposit', fmt(deposit))}${stat('New copper carry', `${result.carry} cp`)}${stat(`Crew payout · ${D.currentCrewPercent}%`, fmt(share))}${stat('Guild retains', fmt(deposit - share))}</dl><p class="hint">Crew payout is separate from XP. Calculation only.</p>`;
    } catch (error) {
      $('counting-error').textContent = error.message;
      $('counting-result').textContent = 'Enter valid amounts to calculate.';
    }
  }
  $('counting-form').addEventListener('submit', event => { event.preventDefault(); count(); });
  $('counting-form').addEventListener('input', () => { $('counting-result').textContent = 'Amounts changed. Calculate to see the new result.'; $('counting-error').textContent = ''; });
  count();

  const games = [
    { id: 'seven', title: 'Seven at the Gate', tagline: 'Percentile dice · choose a side', rules: 'Stake 1–5 coins in your selected denomination (pp, gp, ep, sp or cp). Choose Low or High, then roll d100. Low wins on 1–49; High wins on 52–100. The gate (50–51) always wins for the house. A win returns 2× the stake total (1× net profit). A loss returns zero. No ties or pushes. Win chance: 49%.', stake: '1', choices: '<legend>Choose your side</legend><div class="choices"><label><input type="radio" name="choice" value="low" checked> Low · 1–49</label><label><input type="radio" name="choice" value="high"> High · 52–100</label></div>' },
    { id: 'bones', title: 'High Bones', tagline: 'Three dice · beat eleven', rules: 'Stake exactly 2 or 4 coins in your selected denomination (pp, gp, ep, sp or cp). Roll 3d6 once and add them: 12–18 wins, 3–11 loses. A win earns 2× the stake in net profit and returns 3× the stake TOTAL, including your original stake. For example, 2 gp returns 6 gp total: your 2 gp stake plus 4 gp profit. A loss returns zero. No dealer total, ties or pushes. Win chance: 37.5%.', stake: '2', choices: '<legend>Roll all three dice together</legend><p class="hint">⚄ + ⚂ + ⚅ · total 12 or higher wins</p>' },
    { id: 'cup', title: 'The Empty Cup', tagline: 'Four cups · one winner', rules: 'Stake any positive whole number of coins in your selected denomination (pp, gp, ep, sp or cp), within the calculator limit. Choose one of four cups before resolving. Exactly one cup is chosen uniformly at random: your chance is 1 in 4. A win returns 4× the stake TOTAL, including the stake (3× net profit). A 1 gp win returns 4 gp, net +3 gp. A loss returns zero. No ties, pushes or fractional-copper payouts. Expected return is 100% of stakes over many rounds; individual rounds can lose.', stake: '100', choices: '<legend>Choose a cup before resolving</legend><div class="choices cups">' + [1, 2, 3, 4].map(n => `<label><input type="radio" name="choice" value="${n}"> Cup ${n}</label>`).join('') + '</div>' }
  ];
  $('games').innerHTML = games.map(game => `<article class="game"><h3>${game.title}</h3><p class="hint">${game.tagline}</p><details><summary>Rules &amp; payouts</summary><p>${game.rules}</p></details><form id="game-${game.id}" novalidate><fieldset class="round-inputs"><div class="stake-fields"><label>Stake amount<input name="stake" inputmode="numeric" value="${game.stake}" aria-label="${game.title} stake amount"></label><label>Coin<select name="denomination" aria-label="${game.title} coin denomination"><option value="pp">Platinum (pp)</option><option value="gp">Gold (gp)</option><option value="ep">Electrum (ep)</option><option value="sp">Silver (sp)</option><option value="cp" selected>Copper (cp)</option></select></label></div><fieldset>${game.choices}</fieldset></fieldset><div class="game-controls"><button type="submit">${game.id === 'cup' ? 'Reveal winning cup' : 'Roll dice'}</button><button type="button" class="next-round" hidden>New round</button></div><p class="error" role="alert"></p><div class="round-result" aria-live="polite" aria-atomic="true"></div></form></article>`).join('');
  games.forEach(game => {
    const form = $(`game-${game.id}`), button = form.querySelector('[type=submit]'), next = form.querySelector('.next-round');
    let resolved = false;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (resolved) return;
      form.querySelector('.error').textContent = '';
      try {
        const denomination = form.elements.denomination.value;
        C.validateStake(game.id, form.elements.stake.value, denomination);
        const selected = form.querySelector('[name=choice]:checked');
        if (game.id === 'cup' && !selected) throw new Error('Choose a cup first.');
        const choice = game.id === 'cup' ? Number(selected.value) : selected?.value;
        const rolls = game.id === 'bones' ? [C.randomInt(6), C.randomInt(6), C.randomInt(6)] : [C.randomInt(game.id === 'seven' ? 100 : 4)];
        const result = C.resolveGame(game.id, form.elements.stake.value, choice, rolls, denomination);
        resolved = true;
        button.disabled = true;
        form.querySelector('.round-inputs').disabled = true;
        next.hidden = false;
        const rolled = game.id === 'cup' ? `You chose cup ${choice}. Winning cup: ${rolls[0]}.` : game.id === 'bones' ? `Dice: ${rolls.join(' + ')} = ${rolls.reduce((a, b) => a + b, 0)}` : `${choice === 'low' ? 'Low' : 'High'} · d100: ${rolls[0]}${[50, 51].includes(rolls[0]) ? ' · The gate!' : ''}`;
        form.querySelector('.round-result').innerHTML = `<div class="dice-result">${rolled}</div><div class="result"><strong>${result.win ? 'You win' : 'House wins'}</strong><dl>${stat('Stake', fmt(result.stake))}${stat('Total returned', fmt(result.returned))}${stat('Net profit / loss', (result.net > 0n ? '+' : '') + fmt(result.net))}</dl></div>`;
      } catch (error) { form.querySelector('.error').textContent = error.message; }
    });
    next.addEventListener('click', () => {
      resolved = false; button.disabled = false; next.hidden = true;
      form.querySelector('.round-inputs').disabled = false;
      form.querySelector('.round-result').textContent = '';
      form.querySelector('.error').textContent = '';
      button.focus();
    });
  });

  $('board-note').textContent = D.boardNote;
  $('board-source').textContent = D.sourceNotice;
  $('standings').innerHTML = D.standings.map(row => `<tr${row.team === 'Fantastic 4' ? ' class="current"' : ''}><td>${row.rank}</td><th scope="row">${escape(row.team)}</th><td>${fmt(row.depositedCp)}</td></tr>`).join('');
  $('rank-info').innerHTML = D.ranks.map(row => `<p><strong>Ranks ${row.ranks} · ${row.share}% crew share:</strong> ${escape(row.access)}</p>`).join('');
  $('mission-tiers').innerHTML = D.missions.map(tier => `<article class="info-card"><span class="rank-tag">${rank(tier.rank)}${tier.rank === 2 ? ' + invitation' : ''}</span><h3>${escape(tier.name)}</h3><p>${escape(tier.description)}</p></article>`).join('');
  $('room-tiers').innerHTML = D.quarters.map(room => `<article class="info-card"><span class="rank-tag">${rank(room.rank)}</span><h3>${escape(room.name)}</h3><p><strong>${escape(room.size)}</strong></p><p>${escape(room.description)}</p><p><strong>Per character:</strong> ${escape(room.personal)}</p><p><strong>Shared team capacity:</strong> ${escape(room.shared)}</p></article>`).join('');

  $('district').innerHTML = D.scouting.districts.map((district, i) => `<option value="${i}">${escape(district.name)} · ${escape(district.location)}</option>`).join('');
  $('depth').innerHTML = D.scouting.depths.map((depth, i) => `<option value="${i}">${i + 1}. ${escape(depth.name)}</option>`).join('');
  function scout() {
    const district = D.scouting.districts[$('district').value], depth = D.scouting.depths[$('depth').value];
    $('scout-result').innerHTML = `<span>Final scouting cost</span><strong class="big-number">${fmt(C.scoutCost(district, depth))}</strong><p>${fmt(district.baseCp)} district base × ${depth.multiplier} detail multiplier</p><p><strong>${escape(depth.requirement)}</strong></p><p>${escape(depth.description)}</p>`;
  }
  $('scout-form').addEventListener('change', scout); $('scout-form').addEventListener('submit', event => event.preventDefault()); scout();

  const lines = new Map();
  const rates = Object.values(D.trader.rates);
  $('trader-policy').textContent = `Current guild buy offers are low: ${Math.min(...rates)}–${Math.max(...rates)}% of retail, rounded down per unit to whole copper. Bundle sizes are in the names. Rare and magical items, guild loan gear and mission-specific offers are settled manually.`;
  [...new Set(catalogue.map(item => item.category))].forEach(category => { const option = new Option(category, category); $('item-category').add(option); });
  function renderCatalogue() {
    const query = $('item-search').value.trim().toLowerCase(), category = $('item-category').value;
    const matches = catalogue.filter(item => (!category || item.category === category) && `${item.name} ${item.category}`.toLowerCase().includes(query));
    $('catalogue-status').textContent = `${matches.length} matching items${query ? '' : ' · showing all in this category'}`;
    $('catalogue').innerHTML = matches.length ? matches.map(item => `<div class="catalogue-item"><div><strong>${escape(item.name)}</strong><p>${escape(item.category)} · retail ${fmt(item.retailCp)}</p><p>Tamsin pays <strong>${fmt(C.buyOffer(item, D.trader.rates))}</strong> / named unit</p></div><button type="button" data-add="${item.id}" aria-label="Add ${escape(item.name)} to estimate">Add</button></div>`).join('') : '<p>No matching items. Try a shorter name or another category.</p>';
  }
  function updateSale() {
    $('trader-error').textContent = '';
    try {
      const result = C.traderTotal([...lines].map(([id, quantity]) => ({ id, quantity })), catalogue, D.trader.rates);
      result.items.forEach(line => {
        const subtotal = document.querySelector(`[data-subtotal="${line.item.id}"]`);
        if (subtotal) subtotal.textContent = `${fmt(line.unit)} × ${line.quantity} = ${fmt(line.subtotal)}`;
      });
      $('sale-total').innerHTML = `<span>Tamsin pays the party</span><strong class="big-number">${fmt(result.total)}</strong><p class="hint">Estimate only. No goods sold or money recorded.</p>`;
    } catch (error) {
      $('trader-error').textContent = error.message;
      document.querySelectorAll('[data-subtotal]').forEach(node => { node.textContent = 'Check quantities to recalculate.'; });
      $('sale-total').textContent = 'Enter valid quantities to calculate the sale total.';
    }
  }
  function renderLines() {
    $('sale-lines').innerHTML = lines.size ? [...lines].map(([id, quantity]) => {
      const item = catalogue.find(item => item.id === id);
      return `<div class="sale-line"><strong>${escape(item.name)}</strong><p class="hint">${escape(item.category)} · retail reference ${fmt(item.retailCp)}</p><label>Quantity<input data-quantity="${id}" inputmode="numeric" value="${escape(quantity)}" aria-label="${escape(item.name)} quantity"></label><p data-subtotal="${id}"></p><button type="button" data-remove="${id}" aria-label="Remove ${escape(item.name)}">Remove</button></div>`;
    }).join('') : '<p class="hint">Add items from the catalogue to build an estimate.</p>';
    updateSale();
  }
  $('catalogue').addEventListener('click', event => {
    const button = event.target.closest('[data-add]'); if (!button) return;
    try {
      const id = button.dataset.add;
      const old = lines.has(id) ? C.whole(lines.get(id), 'Quantity', 999999n) : 0n;
      lines.set(id, String(old + 1n)); renderLines();
      $('catalogue-status').textContent = `Added ${catalogue.find(item => item.id === id).name} to the estimate.`;
    } catch (error) { $('trader-error').textContent = error.message; }
  });
  $('sale-lines').addEventListener('input', event => { if (event.target.dataset.quantity) { lines.set(event.target.dataset.quantity, event.target.value); updateSale(); } });
  $('sale-lines').addEventListener('click', event => { const button = event.target.closest('[data-remove]'); if (button) { lines.delete(button.dataset.remove); renderLines(); $('item-search').focus(); } });
  $('item-search').addEventListener('input', renderCatalogue); $('item-category').addEventListener('change', renderCatalogue);
  renderCatalogue(); renderLines();
})();
