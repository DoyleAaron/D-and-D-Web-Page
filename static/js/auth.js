/**
 * Authentication Module
 * Dayner D&D Lore Website
 * Firebase Auth - Character-based login/signup
 */

const AuthModule = (function() {
  let currentUser = null;
  let userProfile = null;
  let currentAuthMode = null; // 'login' or 'signup'
  
  // Character list from Player Characters folder
  const CHARACTERS = [
    { id: 'amdir', name: 'Amdir Aeristel', player: 'Aaron', file: 'Character Lore/Player Characters/Amdir Aeristel (Aaron).md' },
    { id: 'blorf', name: 'Blorf of Clan Beren', player: 'Kirk', file: 'Character Lore/Player Characters/Blorf of Clan Beren(Kirk).md' },
    { id: 'leontius', name: 'Leontius', player: 'Ronan', file: 'Character Lore/Player Characters/Leontius (Ronan).md' },
    { id: 'morjor', name: 'Morjor the Enlightened', player: 'Jack', file: 'Character Lore/Player Characters/Morjor the Enlightened (Jack).md' },
    { id: 'tearitus', name: 'Tearitus Dropius Pather', player: 'Dylan', file: 'Character Lore/Player Characters/Tearitus Dropius Pather (Dylan).md' },
    { id: 'varin', name: 'Varin', player: 'Aiden', file: 'Character Lore/Player Characters/Varin (Aiden).md' },
    { id: 'admin', name: 'Dungeon Master (Admin)', player: 'Admin', file: null, isAdmin: true }
  ];
  
  // DOM Elements
  let loginModal = null;
  let characterSelect = null;
  let passwordInput = null;
  let userMenu = null;
  let loginBtn = null;
  let logoutBtn = null;
  let userNameDisplay = null;
  let journalBtn = null;
  let checklistBtn = null;
  let loginError = null;
  let authModeIndicator = null;

  function init() {
    loginModal = document.getElementById('login-modal');
    characterSelect = document.getElementById('character-select');
    passwordInput = document.getElementById('login-password');
    userMenu = document.getElementById('user-menu');
    loginBtn = document.getElementById('login-btn');
    logoutBtn = document.getElementById('logout-btn');
    userNameDisplay = document.getElementById('user-name');
    journalBtn = document.getElementById('journal-btn');
    checklistBtn = document.getElementById('checklist-btn');
    loginError = document.getElementById('login-error');
    authModeIndicator = document.getElementById('auth-mode-indicator');

    // Populate character dropdown
    if (characterSelect) {
      CHARACTERS.forEach(char => {
        const option = document.createElement('option');
        option.value = char.id;
        if (char.isAdmin) {
          option.textContent = char.name;
        } else {
          option.textContent = `${char.name} (${char.player})`;
        }
        characterSelect.appendChild(option);
      });
      
      // Check account status when character is selected
      characterSelect.addEventListener('change', checkAccountStatus);
    }

    // Set up event listeners
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (journalBtn) {
      journalBtn.addEventListener('click', () => {
        console.log('Journal button clicked');
        if (typeof JournalModule !== 'undefined') {
          JournalModule.show();
        } else {
          console.error('JournalModule not found');
        }
      });
    }
    if (checklistBtn) {
      checklistBtn.addEventListener('click', () => {
        console.log('Checklist button clicked');
        if (typeof ChecklistModule !== 'undefined') {
          ChecklistModule.show();
        } else {
          console.error('ChecklistModule not found');
        }
      });
    }

    const inventoryBtn = document.getElementById('inventory-btn');
    if (inventoryBtn) {
      inventoryBtn.addEventListener('click', () => {
        console.log('Inventory button clicked');
        if (typeof InventoryModule !== 'undefined') {
          InventoryModule.show();
        } else {
          console.error('InventoryModule not found');
        }
      });
    }

    const loginConfirmBtn = document.getElementById('login-confirm');
    if (loginConfirmBtn) {
      loginConfirmBtn.addEventListener('click', handleAuth);
    }

    // Handle Enter key in password field
    if (passwordInput) {
      passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAuth();
      });
    }

    // Handle Enter key in signup password confirm
    const signupPasswordConfirm = document.getElementById('signup-password-confirm');
    if (signupPasswordConfirm) {
      signupPasswordConfirm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAuth();
      });
    }

    if (loginModal) {
      loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) hideLoginModal();
      });
    }

    // Listen for Firebase auth state changes
    if (window.firebaseAuth) {
      window.firebaseAuth.onAuthStateChanged(handleAuthStateChange);
    }
  }

  // Check if the selected character has an account
  async function checkAccountStatus() {
    const selectedId = characterSelect ? characterSelect.value : null;
    if (!selectedId) {
      updateAuthModeUI(null);
      return;
    }

    const character = CHARACTERS.find(c => c.id === selectedId);
    if (!character) {
      updateAuthModeUI(null);
      return;
    }

    // Generate email from character id
    const email = `${selectedId}@dayner.local`;

    // Show loading state
    if (authModeIndicator) {
      authModeIndicator.textContent = 'Checking account...';
      authModeIndicator.className = 'auth-mode-indicator';
    }

    try {
      // Try to sign in with a dummy password to check if account exists
      // This will fail, but the error code tells us if the user exists
      await window.firebaseAuth.signInWithEmailAndPassword(email, '__check_account_exists__');
      // If somehow this succeeds (shouldn't), user exists
      updateAuthModeUI('login');
    } catch (error) {
      console.log('Account check - error code:', error.code);
      console.log('Account check - error message:', error.message);
      
      // auth/user-not-found = user definitely doesn't exist (only in old Firebase)
      if (error.code === 'auth/user-not-found') {
        console.log('-> User not found, showing signup');
        updateAuthModeUI('signup');
      } 
      // auth/wrong-password = user definitely exists (old Firebase behavior)
      else if (error.code === 'auth/wrong-password') {
        console.log('-> Wrong password, showing login');
        updateAuthModeUI('login');
      }
      // Too many requests - show both options
      else if (error.code === 'auth/too-many-requests') {
        console.log('-> Too many requests, showing both');
        updateAuthModeUI('both');
      }
      // For ALL other errors (including auth/invalid-credential), show both options
      // This is the safest approach since Firebase's Email Enumeration Protection
      // returns the same error for both existing and non-existing accounts
      else {
        console.log('-> Other error (' + error.code + '), showing both options');
        updateAuthModeUI('both');
      }
    }
  }

  function updateAuthModeUI(mode) {
    currentAuthMode = mode; // Track current mode
    const loginFields = document.getElementById('login-fields');
    const signupFields = document.getElementById('signup-fields');
    const loginConfirmBtn = document.getElementById('login-confirm');
    const modeToggleBtn = document.getElementById('auth-mode-toggle');
    
    if (!mode) {
      // No character selected
      if (loginFields) loginFields.style.display = 'none';
      if (signupFields) signupFields.style.display = 'none';
      if (authModeIndicator) authModeIndicator.textContent = '';
      if (loginConfirmBtn) loginConfirmBtn.style.display = 'none';
      if (modeToggleBtn) modeToggleBtn.style.display = 'none';
      return;
    }

    // Hide mode toggle by default (show only in 'both' mode initially)
    if (modeToggleBtn) modeToggleBtn.style.display = 'none';

    if (mode === 'login') {
      if (loginFields) loginFields.style.display = 'block';
      if (signupFields) signupFields.style.display = 'none';
      if (authModeIndicator) {
        authModeIndicator.textContent = 'Welcome back! Enter your password to login.';
        authModeIndicator.className = 'auth-mode-indicator login-mode';
      }
      if (loginConfirmBtn) {
        loginConfirmBtn.style.display = 'block';
        loginConfirmBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Enter the Realm';
      }
    } else if (mode === 'signup') {
      // Signup mode
      if (loginFields) loginFields.style.display = 'none';
      if (signupFields) signupFields.style.display = 'block';
      if (authModeIndicator) {
        authModeIndicator.textContent = 'First time? Create your password to begin.';
        authModeIndicator.className = 'auth-mode-indicator signup-mode';
      }
      if (loginConfirmBtn) {
        loginConfirmBtn.style.display = 'block';
        loginConfirmBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
      }
    } else if (mode === 'both') {
      // Show both options - default to login with toggle to signup
      if (loginFields) loginFields.style.display = 'block';
      if (signupFields) signupFields.style.display = 'none';
      if (authModeIndicator) {
        authModeIndicator.textContent = 'Enter your password to login. New here? Click "Create Account".';
        authModeIndicator.className = 'auth-mode-indicator login-mode';
      }
      if (loginConfirmBtn) {
        loginConfirmBtn.style.display = 'block';
        loginConfirmBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Enter the Realm';
      }
      if (modeToggleBtn) {
        modeToggleBtn.style.display = 'block';
        modeToggleBtn.textContent = 'Create Account';
        modeToggleBtn.onclick = () => updateAuthModeUI('signup');
      }
      // Set mode to login for form handling
      currentAuthMode = 'login';
    }
  }

  async function handleAuthStateChange(user) {
    currentUser = user;
    
    if (user) {
      // Load user profile from Firestore
      try {
        const profileDoc = await window.firebaseDb.collection('users').doc(user.uid).get();
        if (profileDoc.exists) {
          userProfile = profileDoc.data();
        } else {
          // Build fallback profile from email/displayName
          const characterId = user.email ? user.email.split('@')[0] : 'unknown';
          const characterData = CHARACTERS.find(c => c.id === characterId) || {};
          userProfile = {
            characterId: characterId,
            character: user.displayName || characterData.name || 'Unknown',
            player: characterData.player || 'Unknown',
            email: user.email,
            isAdmin: user.email === 'admin@dayner.local',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          };
          // Save the profile to Firestore so rules can check it
          try {
            await window.firebaseDb.collection('users').doc(user.uid).set(userProfile);
            console.log('Created missing user profile in Firestore');
          } catch (saveError) {
            console.error('Failed to save user profile:', saveError);
          }
        }
      } catch (e) {
        // Build fallback profile from email/displayName
        const characterId = user.email ? user.email.split('@')[0] : 'unknown';
        const characterData = CHARACTERS.find(c => c.id === characterId) || {};
        userProfile = {
          character: user.displayName || characterData.name || 'Unknown',
          player: characterData.player || 'Unknown',
          characterId: characterId,
          isAdmin: user.email === 'admin@dayner.local'
        };
      }
      updateUIForLoggedInUser();
    } else {
      userProfile = null;
      updateUIForLoggedOutUser();
    }
  }

  function showLoginModal() {
    if (loginModal) {
      loginModal.classList.add('active');
      if (characterSelect) characterSelect.value = '';
      if (passwordInput) passwordInput.value = '';
      updateAuthModeUI(null);
      clearLoginError();
    }
  }

  function hideLoginModal() {
    if (loginModal) {
      loginModal.classList.remove('active');
      if (passwordInput) passwordInput.value = '';
      const signupPassword = document.getElementById('signup-password');
      const signupPasswordConfirm = document.getElementById('signup-password-confirm');
      if (signupPassword) signupPassword.value = '';
      if (signupPasswordConfirm) signupPasswordConfirm.value = '';
      clearLoginError();
    }
  }

  async function handleAuth() {
    const selectedId = characterSelect ? characterSelect.value : null;
    
    if (!selectedId) {
      showLoginError('Please select your character');
      return;
    }

    const character = CHARACTERS.find(c => c.id === selectedId);
    if (!character) {
      showLoginError('Character not found');
      return;
    }

    const email = `${selectedId}@dayner.local`;
    
    // Check if this is login or signup based on tracked mode
    if (currentAuthMode === 'signup') {
      await handleSignup(character, email);
    } else {
      await handleLogin(character, email);
    }
  }

  async function handleLogin(character, email) {
    const password = passwordInput ? passwordInput.value : '';
    
    if (!password) {
      showLoginError('Please enter your password');
      return;
    }

    const loginConfirmBtn = document.getElementById('login-confirm');
    if (loginConfirmBtn) {
      loginConfirmBtn.disabled = true;
      loginConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entering...';
    }

    try {
      await window.firebaseAuth.signInWithEmailAndPassword(email, password);
      hideLoginModal();
    } catch (error) {
      console.error('Login error:', error);
      showLoginError(getErrorMessage(error.code));
    } finally {
      if (loginConfirmBtn) {
        loginConfirmBtn.disabled = false;
        loginConfirmBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Enter the Realm';
      }
    }
  }

  async function handleSignup(character, email) {
    const password = document.getElementById('signup-password')?.value;
    const passwordConfirm = document.getElementById('signup-password-confirm')?.value;

    if (!password) {
      showLoginError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      showLoginError('Password must be at least 6 characters');
      return;
    }

    if (password !== passwordConfirm) {
      showLoginError('Passwords do not match');
      return;
    }

    const loginConfirmBtn = document.getElementById('login-confirm');
    if (loginConfirmBtn) {
      loginConfirmBtn.disabled = true;
      loginConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    }

    try {
      // Create the user account
      const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
      
      // Update display name
      await userCredential.user.updateProfile({
        displayName: character.name
      });

      // Save user profile to Firestore
      await window.firebaseDb.collection('users').doc(userCredential.user.uid).set({
        characterId: character.id,
        character: character.name,
        player: character.player,
        email: email,
        isAdmin: character.isAdmin || false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      hideLoginModal();
      showNotification(`Welcome, ${character.name}!`, 'success');
    } catch (error) {
      console.error('Signup error:', error);
      
      // If account already exists, switch to login mode
      if (error.code === 'auth/email-already-in-use') {
        updateAuthModeUI('login');
        showLoginError('Account exists! Enter your password to login.');
        return;
      }
      
      showLoginError(getSignupErrorMessage(error.code));
    } finally {
      if (loginConfirmBtn) {
        loginConfirmBtn.disabled = false;
        loginConfirmBtn.innerHTML = currentAuthMode === 'login' 
          ? '<i class="fas fa-sign-in-alt"></i> Enter the Realm'
          : '<i class="fas fa-user-plus"></i> Create Account';
      }
    }
  }

  function getSignupErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Account exists! Switching to login...';
      case 'auth/invalid-email':
        return 'Invalid character selection.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      default:
        return 'Signup failed. Please try again.';
    }
  }

  async function logout() {
    try {
      await window.firebaseAuth.signOut();
      if (window.JournalModule) JournalModule.hide();
      if (window.ChecklistModule) ChecklistModule.hide();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  function showLoginError(message) {
    if (loginError) {
      loginError.textContent = message;
      loginError.style.display = 'block';
    }
  }

  function clearLoginError() {
    if (loginError) {
      loginError.textContent = '';
      loginError.style.display = 'none';
    }
  }

  function getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found. Please sign up first.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      default:
        return 'Login failed. Please try again.';
    }
  }

  function updateUIForLoggedInUser() {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userNameDisplay && userProfile) {
      // Show character name, or "Admin" for admin
      userNameDisplay.textContent = userProfile.isAdmin ? 'Admin' : userProfile.character;
    }
  }

  function updateUIForLoggedOutUser() {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }

  function getCurrentUser() {
    return currentUser;
  }

  function getUserProfile() {
    return userProfile;
  }

  function isLoggedIn() {
    return currentUser !== null;
  }

  function isAdmin() {
    return !!(userProfile && userProfile.isAdmin === true);
  }

  function getCharacters() {
    return CHARACTERS;
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  return {
    init,
    showLoginModal,
    hideLoginModal,
    logout,
    getCurrentUser,
    getUserProfile,
    isLoggedIn,
    isAdmin,
    getCharacters,
    showNotification
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.firebaseAuth) {
    AuthModule.init();
  } else {
    console.warn('Firebase not initialized. Auth module disabled.');
  }
});
