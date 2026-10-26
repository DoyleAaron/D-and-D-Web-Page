// Run the repository's existing pure checks using their actual script entry points.
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ console });
for (const file of ['scripts/map-coordinates.js', 'static/js/ship-routes.js', 'static/js/road-network.js', 'static/js/road-network-tests.js']) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
let result;
try { result = vm.runInContext('ROAD_NETWORK_TESTS.runAll()', context); }
catch (error) { result = { ...vm.runInContext('({passed: ROAD_NETWORK_TESTS.passed, failed: ROAD_NETWORK_TESTS.failed, results: ROAD_NETWORK_TESTS.results})', context), error: error.message }; }
fs.mkdirSync('.hq-work', { recursive: true });
fs.writeFileSync('.hq-work/existing-road-results.json', JSON.stringify(result, null, 2));
if (result.failed) process.exitCode = 1;
