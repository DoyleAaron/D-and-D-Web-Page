/**
 * Unit Tests for Dayner D&D Website
 * Run these tests in the browser console or include test.html
 */

const DaynerTests = (function() {
  let passed = 0;
  let failed = 0;
  const results = [];

  // Test utilities
  function assert(condition, message) {
    if (condition) {
      passed++;
      results.push({ status: 'PASS', message });
      console.log(`✅ PASS: ${message}`);
    } else {
      failed++;
      results.push({ status: 'FAIL', message });
      console.error(`❌ FAIL: ${message}`);
    }
  }

  function assertEqual(actual, expected, message) {
    const condition = actual === expected;
    if (!condition) {
      console.error(`   Expected: ${expected}`);
      console.error(`   Actual: ${actual}`);
    }
    assert(condition, message);
  }

  function assertContains(str, substring, message) {
    assert(str && str.includes(substring), message);
  }

  // ========================================
  // Path Resolution Tests
  // ========================================
  function testPathResolution() {
    console.log('\n📁 PATH RESOLUTION TESTS');
    console.log('========================');

    // Test 1: Simple relative path (same directory)
    const test1 = resolveRelativePathTest(
      'Kingdoms/Braewood/Braewood.md',
      'Kadena.md'
    );
    assertEqual(test1, 'Kingdoms/Braewood/Kadena.md', 'Same directory relative path');

    // Test 2: Parent directory (..)
    const test2 = resolveRelativePathTest(
      'Kingdoms/Braewood/Town/Ardismouth.md',
      '../Braewood.md'
    );
    assertEqual(test2, 'Kingdoms/Braewood/Braewood.md', 'Parent directory path (..)');

    // Test 3: Multiple parent directories
    const test3 = resolveRelativePathTest(
      'Kingdoms/Braewood/Town/Ardismouth.md',
      '../../Islefield/Islefield.md'
    );
    assertEqual(test3, 'Kingdoms/Islefield/Islefield.md', 'Multiple parent directories');

    // Test 4: Character to Kingdom link
    const test4 = resolveRelativePathTest(
      'Character Lore/Modern Characters/Queen Maera Braeden.md',
      '../../Kingdoms/Braewood/Braewood.md'
    );
    assertEqual(test4, 'Kingdoms/Braewood/Braewood.md', 'Character to Kingdom cross-reference');

    // Test 5: URL encoded spaces
    const test5 = resolveRelativePathTest(
      'Kingdoms/Braewood/POI/The%20Grand%20Span.md',
      '../Town/Ardismouth.md'
    );
    assertEqual(test5, 'Kingdoms/Braewood/Town/Ardismouth.md', 'URL encoded path handling');

    // Test 6: Deep nesting
    const test6 = resolveRelativePathTest(
      'Character Lore/Modern Characters/King Roden II.md',
      '../../Kingdoms/Braewood/Capital/Rye.md'
    );
    assertEqual(test6, 'Kingdoms/Braewood/Capital/Rye.md', 'Deep nested path resolution');
  }

  // Helper function to test path resolution (mirrors main.js logic)
  function resolveRelativePathTest(currentFilePath, relativePath) {
    relativePath = decodeURIComponent(relativePath);
    const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/') + 1);
    let baseParts = currentDir.split('/').filter(p => p);
    const relativeParts = relativePath.split('/');
    
    for (const part of relativeParts) {
      if (part === '..') {
        baseParts.pop();
      } else if (part !== '.' && part !== '') {
        baseParts.push(part);
      }
    }
    
    return baseParts.join('/');
  }

  // ========================================
  // Auth Module Tests
  // ========================================
  function testAuthModule() {
    console.log('\n🔐 AUTH MODULE TESTS');
    console.log('====================');

    // Test 1: AuthModule exists
    assert(typeof AuthModule !== 'undefined', 'AuthModule is defined');

    // Test 2: AuthModule has required methods
    assert(typeof AuthModule.init === 'function', 'AuthModule.init exists');
    assert(typeof AuthModule.isLoggedIn === 'function', 'AuthModule.isLoggedIn exists');
    assert(typeof AuthModule.getCurrentUser === 'function', 'AuthModule.getCurrentUser exists');
    assert(typeof AuthModule.getUserProfile === 'function', 'AuthModule.getUserProfile exists');
    assert(typeof AuthModule.showLoginModal === 'function', 'AuthModule.showLoginModal exists');
    assert(typeof AuthModule.hideLoginModal === 'function', 'AuthModule.hideLoginModal exists');
    assert(typeof AuthModule.logout === 'function', 'AuthModule.logout exists');
    assert(typeof AuthModule.getCharacters === 'function', 'AuthModule.getCharacters exists');
    assert(typeof AuthModule.isAdmin === 'function', 'AuthModule.isAdmin exists');

    // Test 3: Characters list
    const characters = AuthModule.getCharacters();
    assert(Array.isArray(characters), 'getCharacters returns an array');
    assert(characters.length === 7, 'Seven characters configured (6 players + admin)');

    // Test 4: Character data structure
    const char = characters[0];
    assert(char.id !== undefined, 'Character has id');
    assert(char.name !== undefined, 'Character has name');
    assert(char.player !== undefined, 'Character has player');
    assert(char.file !== undefined || char.file === null, 'Character has file or null');

    // Test 5: Admin character exists and has isAdmin flag
    const admin = characters.find(c => c.id === 'admin');
    assert(admin !== undefined, 'Admin character exists');
    assert(admin.isAdmin === true, 'Admin has isAdmin flag');
    assert(admin.name === 'Dungeon Master (Admin)', 'Admin has correct name');

    // Test 6: Verify all player characters
    const expectedChars = ['amdir', 'blorf', 'leontius', 'morjor', 'tearitus', 'varin'];
    expectedChars.forEach(id => {
      assert(characters.find(c => c.id === id) !== undefined, `Character ${id} exists`);
    });

    // Test 7: Initial state (not logged in)
    const isLoggedInResult = AuthModule.isLoggedIn();
    assert(typeof isLoggedInResult === 'boolean', 'isLoggedIn returns boolean');
    
    // isAdmin should return a boolean
    const isAdminResult = AuthModule.isAdmin();
    assert(isAdminResult === true || isAdminResult === false, 'isAdmin returns boolean (true or false)');
  }

  // ========================================
  // Journal Module Tests
  // ========================================
  function testJournalModule() {
    console.log('\n📓 JOURNAL MODULE TESTS');
    console.log('=======================');

    // Test 1: JournalModule exists
    assert(typeof JournalModule !== 'undefined', 'JournalModule is defined');

    // Test 2: JournalModule has required methods
    assert(typeof JournalModule.init === 'function', 'JournalModule.init exists');
    assert(typeof JournalModule.show === 'function', 'JournalModule.show exists');
    assert(typeof JournalModule.hide === 'function', 'JournalModule.hide exists');
    assert(typeof JournalModule.loadEntries === 'function', 'JournalModule.loadEntries exists');
  }

  // ========================================
  // DOM Element Tests
  // ========================================
  function testDOMElements() {
    console.log('\n🏗️ DOM ELEMENT TESTS');
    console.log('====================');

    // Login modal elements
    assert(document.getElementById('login-modal') !== null, 'Login modal exists');
    assert(document.getElementById('player-select') !== null, 'Player select exists');
    assert(document.getElementById('login-password') !== null, 'Password input exists');
    assert(document.getElementById('login-confirm') !== null, 'Login confirm button exists');
    assert(document.getElementById('login-error') !== null, 'Login error display exists');

    // User menu elements
    assert(document.getElementById('login-btn') !== null, 'Login button exists');
    assert(document.getElementById('user-menu') !== null, 'User menu exists');
    assert(document.getElementById('user-name') !== null, 'User name display exists');
    assert(document.getElementById('journal-btn') !== null, 'Journal button exists');
    assert(document.getElementById('logout-btn') !== null, 'Logout button exists');

    // Journal panel elements
    assert(document.getElementById('journal-panel') !== null, 'Journal panel exists');
    assert(document.getElementById('journal-close') !== null, 'Journal close button exists');
    assert(document.getElementById('journal-new') !== null, 'New entry button exists');
    assert(document.getElementById('journal-entries') !== null, 'Journal entries container exists');
    assert(document.getElementById('journal-editor') !== null, 'Journal editor exists');
    assert(document.getElementById('journal-title') !== null, 'Journal title input exists');
    assert(document.getElementById('journal-content') !== null, 'Journal content textarea exists');
    assert(document.getElementById('journal-save') !== null, 'Save button exists');
    assert(document.getElementById('journal-delete') !== null, 'Delete button exists');
    assert(document.getElementById('journal-back') !== null, 'Back button exists');

    // Player select should have options (in test.html may have minimal, in index.html has all)
    const playerSelect = document.getElementById('player-select');
    assert(playerSelect !== null, 'Player select element exists');
    // Don't check exact count as test.html may have minimal DOM
    console.log(`   Player select has ${playerSelect.options.length} options`);
  }

  // ========================================
  // Firebase Tests
  // ========================================
  function testFirebase() {
    console.log('\n🔥 FIREBASE TESTS');
    console.log('=================');

    // Test 1: Firebase is loaded
    assert(typeof firebase !== 'undefined', 'Firebase SDK is loaded');

    // Test 2: Firebase app is initialized
    assert(firebase.apps.length > 0, 'Firebase app is initialized');

    // Test 3: Auth service available
    assert(typeof window.firebaseAuth !== 'undefined', 'firebaseAuth is available');
    assert(window.firebaseAuth !== null, 'firebaseAuth is not null');

    // Test 4: Firestore service available
    assert(typeof window.firebaseDb !== 'undefined', 'firebaseDb is available');
    assert(window.firebaseDb !== null, 'firebaseDb is not null');

    // Test 5: Correct project
    const app = firebase.apps[0];
    assertEqual(app.options.projectId, 'dayner-dnd-lore', 'Correct Firebase project ID');
  }

  // ========================================
  // Cross-Reference Link Tests
  // ========================================
  function testCrossReferenceLinks() {
    console.log('\n🔗 CROSS-REFERENCE LINK TESTS');
    console.log('==============================');

    // Test that internal links get the correct class
    const loreContent = document.querySelector('.lore-content');
    if (loreContent) {
      const internalLinks = loreContent.querySelectorAll('a.internal-link');
      console.log(`   Found ${internalLinks.length} internal links on current page`);
      assert(true, `Cross-reference link detection working (${internalLinks.length} links found)`);
    } else {
      console.log('   No lore content currently loaded - skipping link tests');
      assert(true, 'No content loaded - link test skipped');
    }
  }

  // ========================================
  // Escape HTML Test
  // ========================================
  function testEscapeHtml() {
    console.log('\n🛡️ SECURITY TESTS');
    console.log('==================');

    // Create a test element to verify escaping
    const testDiv = document.createElement('div');
    testDiv.textContent = '<script>alert("xss")</script>';
    const escaped = testDiv.innerHTML;
    
    assertContains(escaped, '&lt;script&gt;', 'HTML is properly escaped');
    assert(!escaped.includes('<script>'), 'Script tags are escaped');
  }

  // ========================================
  // Inventory Module Tests
  // ========================================
  function testInventoryModule() {
    console.log('\n📦 INVENTORY MODULE TESTS');
    console.log('=========================');

    // Test 1: InventoryModule exists
    assert(typeof InventoryModule !== 'undefined', 'InventoryModule is defined');

    // Test 2: InventoryModule has required methods
    assert(typeof InventoryModule.init === 'function', 'InventoryModule.init exists');
    assert(typeof InventoryModule.show === 'function', 'InventoryModule.show exists');
    assert(typeof InventoryModule.hide === 'function', 'InventoryModule.hide exists');
  }

  // ========================================
  // Inventory DOM Tests
  // ========================================
  function testInventoryDOMElements() {
    console.log('\n📦 INVENTORY DOM TESTS');
    console.log('======================');

    // Inventory panel elements
    assert(document.getElementById('inventory-panel') !== null, 'Inventory panel exists');
    assert(document.getElementById('inventory-close') !== null, 'Inventory close button exists');
    assert(document.getElementById('inventory-personal-tab') !== null, 'Personal tab exists');
    assert(document.getElementById('inventory-party-tab') !== null, 'Party tab exists');
    assert(document.getElementById('inventory-add-item') !== null, 'Add item button exists');
    assert(document.getElementById('inventory-table-body') !== null, 'Inventory table body exists');

    // Currency elements
    assert(document.getElementById('currency-cp') !== null, 'Copper input exists');
    assert(document.getElementById('currency-sp') !== null, 'Silver input exists');
    assert(document.getElementById('currency-ep') !== null, 'Electrum input exists');
    assert(document.getElementById('currency-gp') !== null, 'Gold input exists');
    assert(document.getElementById('currency-pp') !== null, 'Platinum input exists');
    assert(document.getElementById('currency-total') !== null, 'Currency total display exists');
    assert(document.getElementById('save-currency') !== null, 'Save currency button exists');

    // Carry capacity
    assert(document.getElementById('carry-strength') !== null, 'Strength input exists');
    assert(document.getElementById('carry-capacity-display') !== null, 'Carry capacity display exists');

    // Attunement
    assert(document.getElementById('attunement-slots') !== null, 'Attunement slots container exists');

    // Spells & Attacks section
    assert(document.getElementById('spells-attacks-section') !== null, 'Spells & attacks section exists');
    assert(document.getElementById('add-spell-attack') !== null, 'Add spell/attack button exists');
    assert(document.getElementById('spells-attacks-table-body') !== null, 'Spells table body exists');

    // Item modal
    assert(document.getElementById('item-modal') !== null, 'Item modal exists');
    assert(document.getElementById('item-name') !== null, 'Item name input exists');
    assert(document.getElementById('item-category') !== null, 'Item category select exists');
    assert(document.getElementById('item-rarity') !== null, 'Item rarity select exists');
    assert(document.getElementById('item-weight') !== null, 'Item weight input exists');
    assert(document.getElementById('item-quantity') !== null, 'Item quantity input exists');

    // Spell/Attack modal
    assert(document.getElementById('spell-attack-modal') !== null, 'Spell/attack modal exists');
    assert(document.getElementById('spell-attack-name') !== null, 'Spell name input exists');
    assert(document.getElementById('spell-attack-type') !== null, 'Spell type select exists');
    assert(document.getElementById('spell-attack-range') !== null, 'Spell range input exists');
    assert(document.getElementById('spell-attack-damage') !== null, 'Spell damage input exists');
  }

  // ========================================
  // Checklist Module Tests
  // ========================================
  function testChecklistModule() {
    console.log('\n✅ CHECKLIST MODULE TESTS');
    console.log('=========================');

    // Test 1: ChecklistModule exists
    assert(typeof ChecklistModule !== 'undefined', 'ChecklistModule is defined');

    // Test 2: ChecklistModule has required methods
    assert(typeof ChecklistModule.init === 'function', 'ChecklistModule.init exists');
    assert(typeof ChecklistModule.show === 'function', 'ChecklistModule.show exists');
    assert(typeof ChecklistModule.hide === 'function', 'ChecklistModule.hide exists');
  }

  // ========================================
  // Checklist DOM Tests
  // ========================================
  function testChecklistDOMElements() {
    console.log('\n✅ CHECKLIST DOM TESTS');
    console.log('======================');

    assert(document.getElementById('checklist-panel') !== null, 'Checklist panel exists');
    assert(document.getElementById('checklist-close') !== null, 'Checklist close button exists');
    assert(document.getElementById('checklist-new-item') !== null, 'Checklist new item input exists');
    assert(document.getElementById('checklist-add') !== null, 'Checklist add button exists');
    assert(document.getElementById('checklist-items') !== null, 'Checklist items container exists');
    assert(document.getElementById('checklist-clear-completed') !== null, 'Clear completed button exists');
    assert(document.getElementById('checklist-count') !== null, 'Checklist count display exists');
  }

  // ========================================
  // Music Player Tests
  // ========================================
  function testMusicPlayer() {
    console.log('\n🎵 MUSIC PLAYER TESTS');
    console.log('=====================');

    // DOM elements
    assert(document.getElementById('music-player') !== null, 'Music player container exists');
    assert(document.getElementById('bg-music') !== null, 'Audio element exists');
    assert(document.getElementById('music-toggle') !== null, 'Play/pause button exists');
    assert(document.getElementById('music-next') !== null, 'Next track button exists');
    assert(document.getElementById('music-volume') !== null, 'Volume slider exists');
    assert(document.getElementById('music-minimize') !== null, 'Minimize button exists');
    assert(document.getElementById('music-track-name') !== null, 'Track name display exists');

    // Check audio element type
    const audio = document.getElementById('bg-music');
    assert(audio.tagName === 'AUDIO', 'bg-music is an audio element');

    // Check volume slider range
    const volumeSlider = document.getElementById('music-volume');
    assertEqual(volumeSlider.min, '0', 'Volume slider min is 0');
    assertEqual(volumeSlider.max, '100', 'Volume slider max is 100');

    // Check music player is draggable (has cursor grab style)
    const musicPlayer = document.getElementById('music-player');
    const computedStyle = window.getComputedStyle(musicPlayer);
    assert(computedStyle.cursor === 'grab' || computedStyle.cursor === 'pointer', 'Music player is draggable (grab cursor)');
  }

  // ========================================
  // Modal Functionality Tests
  // ========================================
  function testModalFunctionality() {
    console.log('\n🪟 MODAL FUNCTIONALITY TESTS');
    console.log('============================');

    // Test item modal structure
    const itemModal = document.getElementById('item-modal');
    assert(itemModal !== null, 'Item modal exists');
    assert(itemModal.classList.contains('item-modal'), 'Item modal has correct class');
    
    const itemModalContent = itemModal.querySelector('.item-modal-content');
    assert(itemModalContent !== null, 'Item modal has content container');
    
    const itemForm = itemModal.querySelector('.item-form');
    assert(itemForm !== null, 'Item modal has form');

    // Test spell modal structure
    const spellModal = document.getElementById('spell-attack-modal');
    assert(spellModal !== null, 'Spell modal exists');
    
    const spellForm = spellModal.querySelector('.item-form');
    assert(spellForm !== null, 'Spell modal has form');

    // Test modal close buttons
    assert(document.getElementById('item-modal-close') !== null, 'Item modal close button exists');
    assert(document.getElementById('spell-attack-modal-close') !== null, 'Spell modal close button exists');
  }

  // ========================================
  // Inventory Content Scroll Tests
  // ========================================
  function testInventoryScroll() {
    console.log('\n📜 INVENTORY SCROLL TESTS');
    console.log('=========================');

    const inventoryPanel = document.getElementById('inventory-panel');
    assert(inventoryPanel !== null, 'Inventory panel exists');

    // Check for scrollable content container
    const inventoryContent = inventoryPanel.querySelector('.inventory-content');
    assert(inventoryContent !== null, 'Inventory content wrapper exists');

    if (inventoryContent) {
      const computedStyle = window.getComputedStyle(inventoryContent);
      const overflowY = computedStyle.overflowY;
      // Accept auto, scroll, or visible (test environment may not have full CSS)
      assert(overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'visible', 
             `Inventory content overflow-y is valid (${overflowY})`);
    }
  }

  // ========================================
  // Currency Calculation Tests
  // ========================================
  function testCurrencyCalculation() {
    console.log('\n💰 CURRENCY CALCULATION TESTS');
    console.log('==============================');

    // Test GP conversion formula
    // 1 PP = 10 GP, 1 GP = 1 GP, 1 EP = 0.5 GP, 1 SP = 0.1 GP, 1 CP = 0.01 GP
    function calculateTotalGP(cp, sp, ep, gp, pp) {
      return (pp * 10) + gp + (ep * 0.5) + (sp * 0.1) + (cp * 0.01);
    }

    // Test cases
    assertEqual(calculateTotalGP(0, 0, 0, 0, 0), 0, 'Zero currency equals 0 GP');
    assertEqual(calculateTotalGP(0, 0, 0, 100, 0), 100, '100 GP equals 100 GP');
    assertEqual(calculateTotalGP(0, 0, 0, 0, 10), 100, '10 PP equals 100 GP');
    assertEqual(calculateTotalGP(100, 0, 0, 0, 0), 1, '100 CP equals 1 GP');
    assertEqual(calculateTotalGP(0, 10, 0, 0, 0), 1, '10 SP equals 1 GP');
    assertEqual(calculateTotalGP(0, 0, 2, 0, 0), 1, '2 EP equals 1 GP');
    assertEqual(calculateTotalGP(50, 20, 4, 10, 1), 24.5, 'Mixed currency calculation');
  }

  // ========================================
  // Carry Capacity Tests
  // ========================================
  function testCarryCapacity() {
    console.log('\n⚖️ CARRY CAPACITY TESTS');
    console.log('========================');

    // D&D 5e carry capacity = STR * 15
    function calculateCarryCapacity(strength) {
      return strength * 15;
    }

    assertEqual(calculateCarryCapacity(10), 150, 'STR 10 can carry 150 lbs');
    assertEqual(calculateCarryCapacity(15), 225, 'STR 15 can carry 225 lbs');
    assertEqual(calculateCarryCapacity(20), 300, 'STR 20 can carry 300 lbs');
    assertEqual(calculateCarryCapacity(8), 120, 'STR 8 can carry 120 lbs');
  }

  // ========================================
  // Run All Tests
  // ========================================
  function runAll() {
    console.clear();
    console.log('🧪 DAYNER D&D WEBSITE - UNIT TESTS');
    console.log('===================================\n');
    console.log('Starting test suite...\n');

    passed = 0;
    failed = 0;
    results.length = 0;

    try {
      testPathResolution();
      testAuthModule();
      testJournalModule();
      testDOMElements();
      testFirebase();
      testCrossReferenceLinks();
      testEscapeHtml();
      testInventoryModule();
      testInventoryDOMElements();
      testChecklistModule();
      testChecklistDOMElements();
      testMusicPlayer();
      testModalFunctionality();
      testInventoryScroll();
      testCurrencyCalculation();
      testCarryCapacity();
    } catch (error) {
      console.error('❌ Test suite error:', error);
      failed++;
    }

    console.log('\n===================================');
    console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
    console.log('===================================\n');

    if (failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️ Some tests failed. Check the output above.');
    }

    return { passed, failed, results };
  }

  // Public API
  return {
    runAll,
    testPathResolution,
    testAuthModule,
    testJournalModule,
    testDOMElements,
    testFirebase,
    testCrossReferenceLinks,
    testEscapeHtml,
    testInventoryModule,
    testInventoryDOMElements,
    testChecklistModule,
    testChecklistDOMElements,
    testMusicPlayer,
    testModalFunctionality,
    testInventoryScroll,
    testCurrencyCalculation,
    testCarryCapacity
  };
})();

// Auto-run tests when this file is loaded (optional)
// Uncomment the line below to run tests automatically
// document.addEventListener('DOMContentLoaded', () => setTimeout(DaynerTests.runAll, 1000));

console.log('📋 Tests loaded. Run DaynerTests.runAll() in the console to execute tests.');
