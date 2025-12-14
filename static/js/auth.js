/**
 * Authentication Module
 * Dayner D&D Lore Website
 * Simple player selection (no password required)
 */

const AuthModule = (function() {
  let currentPlayer = null;
  
  // Player list - add your players here
  const PLAYERS = [
    { id: 'aaron', firstName: 'Aaron', lastName: '', character: 'Amdir Aeristel' },
    { id: 'kirk', firstName: 'Kirk', lastName: '', character: 'Blorf of Clan Beren' },
    { id: 'ronan', firstName: 'Ronan', lastName: '', character: 'Leontius' },
    { id: 'jack', firstName: 'Jack', lastName: '', character: 'Morjor the Enlightened' },
    { id: 'dylan', firstName: 'Dylan', lastName: '', character: 'Tearitus Dropius Pather' },
    { id: 'aiden', firstName: 'Aiden', lastName: '', character: 'Varin' }
  ];
  
  // DOM Elements
  let loginModal = null;
  let playerSelect = null;
  let userMenu = null;
  let loginBtn = null;
  let logoutBtn = null;
  let userNameDisplay = null;
  let journalBtn = null;

  function init() {
    loginModal = document.getElementById('login-modal');
    playerSelect = document.getElementById('player-select');
    userMenu = document.getElementById('user-menu');
    loginBtn = document.getElementById('login-btn');
    logoutBtn = document.getElementById('logout-btn');
    userNameDisplay = document.getElementById('user-name');
    journalBtn = document.getElementById('journal-btn');

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

    if (loginModal) {
      loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) hideLoginModal();
      });
    }

    // Check for saved session
    const savedPlayer = localStorage.getItem('dayner-player');
    if (savedPlayer) {
      const player = PLAYERS.find(p => p.id === savedPlayer);
      if (player) {
        currentPlayer = player;
        updateUIForLoggedInUser();
      }
    }
  }

  function showLoginModal() {
    if (loginModal) {
      loginModal.classList.add('active');
    }
  }

  function hideLoginModal() {
    if (loginModal) {
      loginModal.classList.remove('active');
    }
  }

  function handleLogin() {
    const selectedId = playerSelect ? playerSelect.value : null;
    if (!selectedId) {
      alert('Please select your name');
      return;
    }

    const player = PLAYERS.find(p => p.id === selectedId);
    if (player) {
      currentPlayer = player;
      localStorage.setItem('dayner-player', player.id);
      updateUIForLoggedInUser();
      hideLoginModal();
    }
  }

  function logout() {
    currentPlayer = null;
    localStorage.removeItem('dayner-player');
    updateUIForLoggedOutUser();
    if (window.JournalModule) JournalModule.hide();
  }

  function updateUIForLoggedInUser() {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userNameDisplay && currentPlayer) {
      userNameDisplay.textContent = currentPlayer.firstName;
    }
  }

  function updateUIForLoggedOutUser() {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function isLoggedIn() {
    return currentPlayer !== null;
  }

  function getPlayers() {
    return PLAYERS;
  }

  return {
    init,
    showLoginModal,
    hideLoginModal,
    logout,
    getCurrentPlayer,
    isLoggedIn,
    getPlayers
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.init();
});
