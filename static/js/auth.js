/**
 * Authentication Module
 * Dayner D&D Lore Website
 * Firebase Auth with name selection and password
 */

const AuthModule = (function() {
  let currentUser = null;
  let userProfile = null;
  
  // Player list - add your players here
  // Email format: firstname@dayner.local (used internally, players just see their name)
  const PLAYERS = [
    { id: 'aaron', firstName: 'Aaron', lastName: '', character: 'Amdir Aeristel', email: 'aaron@dayner.local' },
    { id: 'kirk', firstName: 'Kirk', lastName: '', character: 'Blorf of Clan Beren', email: 'kirk@dayner.local' },
    { id: 'ronan', firstName: 'Ronan', lastName: '', character: 'Leontius', email: 'ronan@dayner.local' },
    { id: 'jack', firstName: 'Jack', lastName: '', character: 'Morjor the Enlightened', email: 'jack@dayner.local' },
    { id: 'dylan', firstName: 'Dylan', lastName: '', character: 'Tearitus Dropius Pather', email: 'dylan@dayner.local' },
    { id: 'aiden', firstName: 'Aiden', lastName: '', character: 'Varin', email: 'aiden@dayner.local' }
  ];
  
  // DOM Elements
  let loginModal = null;
  let playerSelect = null;
  let passwordInput = null;
  let userMenu = null;
  let loginBtn = null;
  let logoutBtn = null;
  let userNameDisplay = null;
  let journalBtn = null;
  let loginError = null;

  function init() {
    loginModal = document.getElementById('login-modal');
    playerSelect = document.getElementById('player-select');
    passwordInput = document.getElementById('login-password');
    userMenu = document.getElementById('user-menu');
    loginBtn = document.getElementById('login-btn');
    logoutBtn = document.getElementById('logout-btn');
    userNameDisplay = document.getElementById('user-name');
    journalBtn = document.getElementById('journal-btn');
    loginError = document.getElementById('login-error');

    // Populate player dropdown
    if (playerSelect) {
      PLAYERS.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = `${player.firstName}${player.lastName ? ' ' + player.lastName : ''} (${player.character})`;
        playerSelect.appendChild(option);
      });
    }

    // Set up event listeners
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (journalBtn) journalBtn.addEventListener('click', () => {
      if (window.JournalModule) JournalModule.show();
    });

    const loginConfirmBtn = document.getElementById('login-confirm');
    if (loginConfirmBtn) {
      loginConfirmBtn.addEventListener('click', handleLogin);
    }

    // Handle Enter key in password field
    if (passwordInput) {
      passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
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

  async function handleAuthStateChange(user) {
    currentUser = user;
    
    if (user) {
      // Find the player profile from the email
      const player = PLAYERS.find(p => p.email === user.email);
      if (player) {
        userProfile = player;
      } else {
        userProfile = {
          firstName: user.email.split('@')[0],
          lastName: '',
          character: ''
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
      clearLoginError();
    }
  }

  function hideLoginModal() {
    if (loginModal) {
      loginModal.classList.remove('active');
      if (passwordInput) passwordInput.value = '';
      clearLoginError();
    }
  }

  async function handleLogin() {
    const selectedId = playerSelect ? playerSelect.value : null;
    const password = passwordInput ? passwordInput.value : '';
    
    if (!selectedId) {
      showLoginError('Please select your name');
      return;
    }
    
    if (!password) {
      showLoginError('Please enter your password');
      return;
    }

    const player = PLAYERS.find(p => p.id === selectedId);
    if (!player) {
      showLoginError('Player not found');
      return;
    }

    const loginConfirmBtn = document.getElementById('login-confirm');
    if (loginConfirmBtn) {
      loginConfirmBtn.disabled = true;
      loginConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    }

    try {
      await window.firebaseAuth.signInWithEmailAndPassword(player.email, password);
      hideLoginModal();
    } catch (error) {
      console.error('Login error:', error);
      showLoginError(getErrorMessage(error.code));
    } finally {
      if (loginConfirmBtn) {
        loginConfirmBtn.disabled = false;
        loginConfirmBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Enter';
      }
    }
  }

  async function logout() {
    try {
      await window.firebaseAuth.signOut();
      if (window.JournalModule) JournalModule.hide();
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
        return 'Account not set up. Contact your DM.';
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
      userNameDisplay.textContent = userProfile.firstName;
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

  function getPlayers() {
    return PLAYERS;
  }

  return {
    init,
    showLoginModal,
    hideLoginModal,
    logout,
    getCurrentUser,
    getUserProfile,
    isLoggedIn,
    getPlayers
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.firebaseAuth) {
    AuthModule.init();
  } else {
    console.warn('Firebase not initialized. Auth module disabled.');
  }
});
