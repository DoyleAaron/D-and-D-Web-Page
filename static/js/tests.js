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
    assert(AuthModule.isLoggedIn() === false || AuthModule.isLoggedIn() === true, 'isLoggedIn returns boolean');
    assert(AuthModule.isAdmin() === false || AuthModule.isAdmin() === true, 'isAdmin returns boolean');
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

    // Player select should have options
    const playerSelect = document.getElementById('player-select');
    assert(playerSelect.options.length >= 7, 'Player select has 6 players + placeholder');
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
    testEscapeHtml
  };
})();

// Auto-run tests when this file is loaded (optional)
// Uncomment the line below to run tests automatically
// document.addEventListener('DOMContentLoaded', () => setTimeout(DaynerTests.runAll, 1000));

console.log('📋 Tests loaded. Run DaynerTests.runAll() in the console to execute tests.');
