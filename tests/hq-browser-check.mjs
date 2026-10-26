// Dependency-free Chrome DevTools smoke tests. Requires Node 22+ and local Chrome/Edge.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from '../scripts/serve-hq.mjs';

const output = path.resolve('.hq-work'); await fs.mkdir(output, { recursive: true });
const server = createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const profile = await fs.mkdtemp(path.join(output, 'browser-'));
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore' });
let socket, serial = 0; const pending = new Map(), exceptions = [], checks = [], consoleErrors = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function command(method, params = {}) {
  return new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
  return result.result.value;
}
async function check(name, expression) {
  assert.equal(await evaluate(expression), true, name); checks.push(name); console.log('PASS ' + name);
}
async function navigate(url) {
  await command('Page.navigate', { url });
  for (let i = 0; i < 100; i++) { if (await evaluate('document.readyState === "complete"')) return; await pause(100); }
  throw new Error('Page did not finish loading: ' + url);
}
async function key(key, code, virtualKey) {
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtualKey });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtualKey });
  await pause(80);
}
try {
  let port;
  for (let i = 0; i < 100; i++) { try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await pause(100); } }
  if (!port) throw new Error('Chrome failed to start. Set CHROME_PATH to a local Chrome/Edge executable.');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) { const task = pending.get(message.id); pending.delete(message.id); if (message.error) task.reject(new Error(message.error.message)); else task.resolve(message.result); }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push(message.params.args.map(arg => arg.value ?? arg.description).join(' '));
  };
  await command('Runtime.enable'); await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate(origin + '/hq.html');
  await check('seven linked services and no player editor', `document.querySelectorAll('.service-card').length === 7 && !document.querySelector('a[href*="editor"]') && document.querySelectorAll('.service-panel').length === 7`);
  await check('initial XP result', `document.querySelector('#counting-result .big-number').textContent === '6' && document.querySelector('#counting-result').textContent.includes('4 cp')`);
  await evaluate(`document.querySelector('#counting-form [name=pp]').value = '1'; document.querySelector('#counting-form [name=gp]').value = '0'; document.querySelector('#counting-form').requestSubmit()`);
  await check('platinum counting gives 62 XP and 8 copper carry', `document.querySelector('#counting-result .big-number').textContent === '62' && document.querySelector('#counting-result').textContent.includes('8 cp')`);
  await evaluate(`document.querySelector('#counting-form [name=pp]').value = '0'`);
  await check('all games expose all five coin choices', `[...document.querySelectorAll('#games [name=denomination]')].length === 3 && [...document.querySelectorAll('#games [name=denomination]')].every(select => [...select.options].map(o => o.value).join(',') === 'pp,gp,ep,sp,cp')`);
  await evaluate(`document.querySelector('.service-card[href="#counting"]').focus()`); await key('Enter', 'Enter', 13);
  await check('keyboard service link moves focus', `document.activeElement.id === 'counting' && location.hash === '#counting'`);
  await evaluate(`document.querySelector('#counting details summary').focus()`);
  await key(' ', 'Space', 32);
  await check('keyboard rules disclosure opens', `document.querySelector('#counting details').open`);
  await evaluate(`document.querySelector('#counting-form [name=gp]').value = '0'; document.querySelector('#counting-form [name=cp]').value = '12'; document.querySelector('#counting-form [name=carry]').value = '4'; document.querySelector('#counting-form').requestSubmit()`);
  await check('XP carry boundary in UI', `document.querySelector('#counting-result .big-number').textContent === '1' && document.querySelector('#counting-result').textContent.includes('0 cp')`);
  await evaluate(`document.querySelector('#counting-form [name=gp]').value = '-1'; document.querySelector('#counting-form').requestSubmit()`);
  await check('invalid coins show error and remove stale result', `document.querySelector('#counting-error').textContent.length > 0 && !document.querySelector('#counting-result .big-number')`);
  await evaluate(`document.querySelector('#counting-form [name=gp]').value = '9999999999999999'; document.querySelector('#counting-form').requestSubmit()`);
  await check('oversized input not truncated or accepted', `document.querySelector('#counting-form [name=gp]').value.length === 16 && document.querySelector('#counting-error').textContent.length > 0`);
  await evaluate(`document.querySelector('#game-cup').requestSubmit()`);
  await check('cup choice required before rolling', `document.querySelector('#game-cup .error').textContent.includes('Choose a cup') && !document.querySelector('#game-cup [type=submit]').disabled`);
  await evaluate(`window.originalRandom = HQCore.randomInt; window.randomCalls = 0; HQCore.randomInt = () => { randomCalls++; return 1; }; document.querySelector('#game-cup [value="1"]').click(); document.querySelector('#game-cup').requestSubmit(); document.querySelector('#game-cup').requestSubmit()`);
  await check('one cup round resolves once with 4 gp return and 3 gp profit', `randomCalls === 1 && document.querySelector('#game-cup .round-result').textContent.includes('4 gp') && document.querySelector('#game-cup .round-result').textContent.includes('+3 gp') && document.querySelector('#game-cup .round-inputs').disabled`);
  await evaluate(`document.querySelector('#game-cup .next-round').click(); document.querySelector('#game-cup [value="2"]').click(); document.querySelector('#game-cup').requestSubmit()`);
  await check('cup loss returns zero', `document.querySelector('#game-cup .round-result').textContent.includes('House wins') && document.querySelector('#game-cup .round-result').textContent.includes('−1 gp')`);
  await evaluate(`HQCore.randomInt = () => 50; document.querySelector('#game-seven').requestSubmit(); HQCore.randomInt = () => 4; document.querySelector('#game-bones').requestSubmit(); HQCore.randomInt = originalRandom`);
  await check('other games display gate loss and High Bones double-profit win', `document.querySelector('#game-seven .round-result').textContent.includes('The gate!') && document.querySelector('#game-bones .round-result').textContent.includes('4 + 4 + 4 = 12') && document.querySelector('#game-bones .round-result').textContent.includes('Total returned6 cp') && document.querySelector('#game-bones .round-result').textContent.includes('+4 cp')`);
  await evaluate(`HQCore.randomInt = () => 1; document.querySelector('#game-seven .next-round').click(); document.querySelector('#game-seven [name=denomination]').value = 'pp'; document.querySelector('#game-seven').requestSubmit(); HQCore.randomInt = () => 4; document.querySelector('#game-bones .next-round').click(); document.querySelector('#game-bones [name=denomination]').value = 'gp'; document.querySelector('#game-bones').requestSubmit(); HQCore.randomInt = originalRandom`);
  await check('platinum and gold gambling pay converted stakes correctly', `document.querySelector('#game-seven .round-result').textContent.includes('Total returned20 gp') && document.querySelector('#game-bones .round-result').textContent.includes('Total returned6 gp') && document.querySelector('#game-bones .round-result').textContent.includes('+4 gp')`);
  await evaluate(`document.querySelector('#district').value = '9'; document.querySelector('#depth').value = '2'; document.querySelector('#scout-form').dispatchEvent(new Event('change'))`);
  await check('magical ward detailed quote available at every rank', `document.querySelector('#district').selectedOptions[0].text.includes('Magistracy Quarter') && document.querySelector('#scout-result').textContent.includes('600 gp') && document.querySelector('#scout-result').textContent.includes('All registered crews') && !/Rank \d|respect/.test(document.querySelector('#scout-result').textContent)`);
  await evaluate(`document.querySelector('#item-search').value = 'zz-no-such-item'; document.querySelector('#item-search').dispatchEvent(new Event('input', {bubbles:true}))`);
  await check('empty search results explained', `document.querySelector('#catalogue').textContent.includes('No matching items')`);
  await evaluate(`document.querySelector('#item-search').value = ''; document.querySelector('#item-search').dispatchEvent(new Event('input', {bubbles:true})); document.querySelector('[data-add="longsword"]').click(); document.querySelector('[data-quantity="longsword"]').value = '3'; document.querySelector('[data-quantity="longsword"]').dispatchEvent(new Event('input', {bubbles:true}))`);
  await check('itemised trader quantity total', `document.querySelector('#sale-total .big-number').textContent === '6 gp, 7 sp, 5 cp' && document.querySelector('[data-subtotal="longsword"]').textContent.includes('× 3')`);
  await check('random junk lot removed from trader', `!document.querySelector('#junk-offer, #junk-include, #junk-reroll') && HQData.trader.junk === undefined && HQCore.junkOffer === undefined`);
  await evaluate(`document.querySelector('#item-search').value = 'spyglass'; document.querySelector('#item-search').dispatchEvent(new Event('input', {bubbles:true}))`);
  await check('audited item search distinguishes retail and guild buy offer', `document.querySelector('#catalogue').textContent.includes('retail 1,000 gp') && document.querySelector('#catalogue').textContent.includes('100 gp') && document.querySelectorAll('#catalogue [data-add]').length === 1`);
  await evaluate(`document.querySelector('[data-add="spyglass"]').click()`);
  await check('new mundane gear contributes its guild offer to itemised totals', `document.querySelector('#sale-total .big-number').textContent === '106 gp, 7 sp, 5 cp' && document.querySelector('[data-subtotal="spyglass"]').textContent.includes('100 gp')`);
  await evaluate(`document.querySelector('[data-quantity="longsword"]').value = '1.5'; document.querySelector('[data-quantity="longsword"]').dispatchEvent(new Event('input', {bubbles:true}))`);
  await check('invalid sale quantity clears total', `document.querySelector('#trader-error').textContent.length > 0 && !document.querySelector('#sale-total .big-number')`);
  await check('manually updated standings unchanged by calculator operations', `document.querySelector('#standings tr:last-child').textContent.includes('21Fantastic 424 gp') && document.querySelectorAll('#standings tr')[16].textContent.includes('17Hollow Pence120 gp') && localStorage.length === 0 && sessionStorage.length === 0`);
  await navigate(origin + '/hq.html');
  await fs.writeFile(path.join(output, 'hq-desktop.png'), Buffer.from((await command('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await evaluate(`document.querySelector('.map-details').open = true`);
  for (const width of [375, 320, 768, 1440]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 650 });
    await check(`no horizontal overflow at ${width}px`, `document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('.service-panel, .service-card, .game, input, select')].every(e => e.getBoundingClientRect().right <= innerWidth + 1)`);
    await check(`percentage markers aligned at ${width}px`, `(() => { const image = document.querySelector('#map-image').getBoundingClientRect(); const marker = document.querySelector('.map-marker').getBoundingClientRect(); return Math.abs((marker.x + marker.width / 2 - image.x) / image.width * 100 - 20) < .2; })()`);
    if (width === 375) {
      await fs.writeFile(path.join(output, 'hq-mobile.png'), Buffer.from((await command('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      await evaluate(`document.querySelector('#counting').scrollIntoView({behavior:'instant'})`);
      await fs.writeFile(path.join(output, 'hq-mobile-counting.png'), Buffer.from((await command('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      await evaluate(`document.querySelector('#trader').scrollIntoView({behavior:'instant'})`);
      await fs.writeFile(path.join(output, 'hq-mobile-trader.png'), Buffer.from((await command('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      await evaluate(`window.scrollTo({top:0, behavior:'instant'})`);
    }
  }
  await command('Emulation.setTouchEmulationEnabled', { enabled: true });
  const position = await evaluate(`(() => { const e = document.querySelector('#game-cup').closest('article').querySelector('summary'); e.scrollIntoView({behavior:'instant'}); const r = e.getBoundingClientRect(); return { x: r.x + 10, y: r.y + 10 }; })()`);
  await command('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [position] });
  await command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pause(150);
  await check('rules disclosure opens by touch', `document.querySelector('#game-cup')?.closest('article').querySelector('details').open`);
  await navigate(origin + '/tools/hq-map-editor.html');
  await check('local editor visible', `!document.querySelector('#editor').hidden`);
  await evaluate(`document.querySelector('#marker-x').value = '23.5'; document.querySelector('#marker-y').value = '61'; document.querySelector('#marker-form').requestSubmit()`);
  await check('marker placement exports percentages', `JSON.parse(document.querySelector('#marker-export').value).markers.some(m => m.service === 'counting' && m.x === 23.5 && m.y === 61)`);
  await evaluate(`document.querySelector('#remove-marker').click()`);
  await check('marker removal exported', `!JSON.parse(document.querySelector('#marker-export').value).markers.some(m => m.service === 'counting')`);
  await evaluate(`document.querySelector('#marker-form').requestSubmit(); document.querySelector('#marker-x').value = '101'; document.querySelector('#marker-form').requestSubmit()`);
  await check('out-of-range marker rejected', `document.querySelector('#marker-error').textContent.includes('between 0 and 100')`);
  for (const route of ['/DM_Private/Campaign%202/08%20DM%20Tracker.md', '/.hq-work/upstream-tree.json', '/docs/HQ.md']) assert.equal((await fetch(origin + route)).status, 404);
  checks.push('preview refuses private notes, staging and maintainer docs');
  assert.deepEqual(exceptions, [], 'HQ and map editor have no runtime exceptions');
  await navigate(origin + '/index.html');
  await check('main navigation contains HQ link', `document.querySelector('.nav-link[href="hq.html"]')?.textContent.includes('Gilded Hand HQ')`);
  await evaluate(`showHome()`);
  await check('homepage contains a direct HQ button', `document.querySelector('#content-area a.btn[href="hq.html"]')?.textContent.includes('Gilded Hand HQ')`);
  await evaluate(`document.querySelector('#content-area a.btn[href="hq.html"]').click()`);
  for (let i = 0; i < 100; i++) { if (await evaluate(`location.pathname === '/hq.html' && !!document.querySelector('#games form')`)) break; await pause(100); }
  await check('homepage HQ button opens the working headquarters', `location.pathname === '/hq.html' && document.querySelectorAll('#games form').length === 3`);
  await navigate(origin + '/index.html');
  const existingSource = await fs.readFile('static/js/tests.js', 'utf8'); await evaluate(existingSource);
  const existing = await evaluate('DaynerTests.runAll()');
  existing.consoleErrors = [...consoleErrors];
  await fs.writeFile(path.join(output, 'existing-browser-results.json'), JSON.stringify(existing, null, 2));
  console.log(`Existing Dayner suite: ${existing.passed} passed, ${existing.failed} failed (see .hq-work/existing-browser-results.json)`);
  // Confirm the same legacy failures on the exact staged upstream index, when available.
  try {
    const original = await fs.readFile('.hq-work/upstream/index.html', 'utf8');
    await navigate(origin + '/__upstream_baseline__');
    const frame = (await command('Page.getFrameTree')).frameTree.frame.id;
    await command('Page.setDocumentContent', { frameId: frame, html: original.replace('<head>', `<head><base href="${origin}/">`) });
    await pause(800);
    await evaluate(existingSource);
    const baseline = await evaluate('DaynerTests.runAll()');
    await fs.writeFile(path.join(output, 'upstream-browser-results.json'), JSON.stringify(baseline, null, 2));
    assert.equal(baseline.failed, existing.failed, 'legacy failure count matches untouched upstream index');
    assert.deepEqual(baseline.results.filter(r => r.status === 'FAIL'), existing.results.filter(r => r.status === 'FAIL'));
    console.log(`Untouched upstream index: same ${baseline.failed} existing failures.`);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  // Existing app errors are recorded separately; HQ and editor must have no runtime exceptions.
  await fs.writeFile(path.join(output, 'browser-results.json'), JSON.stringify({ checks, exceptions, existing }, null, 2));
  console.log(`${checks.length} HQ browser checks passed. Screenshots saved under .hq-work/.`);
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await command('Browser.close'); } catch {} socket.close(); }
  browser.kill(); server.close();
}
