/**
 * Inventory Module
 * Dayner D&D Lore Website
 * Player inventories stored in Firestore with Firebase Auth
 * Admin can view and edit all inventories
 * Party inventory shared among party members
 */

const InventoryModule = (function() {
  let inventoryPanel = null;
  let currentInventoryType = 'personal'; // 'personal' or 'party'
  let currentOwnerId = null;
  let currentPartyId = null;
  let items = [];
  let spellsAttacks = []; // Spells and attacks list
  let viewingPlayerId = null; // For admin viewing specific player

  // Spell/Attack types
  const SPELL_ATTACK_TYPES = [
    { id: 'spell', name: 'Spell' },
    { id: 'cantrip', name: 'Cantrip' },
    { id: 'melee', name: 'Melee Attack' },
    { id: 'ranged', name: 'Ranged Attack' },
    { id: 'ability', name: 'Special Ability' }
  ];

  // Item categories
  const ITEM_CATEGORIES = [
    { id: 'weapon', name: 'Weapons', icon: 'fa-gavel' },
    { id: 'armor', name: 'Armor', icon: 'fa-shield-alt' },
    { id: 'potion', name: 'Potions', icon: 'fa-flask' },
    { id: 'scroll', name: 'Scrolls & Spells', icon: 'fa-scroll' },
    { id: 'gear', name: 'Adventuring Gear', icon: 'fa-toolbox' },
    { id: 'treasure', name: 'Treasure & Valuables', icon: 'fa-gem' },
    { id: 'consumable', name: 'Consumables', icon: 'fa-utensils' },
    { id: 'misc', name: 'Miscellaneous', icon: 'fa-box' }
  ];

  // Item rarities
  const ITEM_RARITIES = [
    { id: 'common', name: 'Common', color: '#9e9e9e' },
    { id: 'uncommon', name: 'Uncommon', color: '#4caf50' },
    { id: 'rare', name: 'Rare', color: '#2196f3' },
    { id: 'very-rare', name: 'Very Rare', color: '#9c27b0' },
    { id: 'legendary', name: 'Legendary', color: '#ff9800' },
    { id: 'artifact', name: 'Artifact', color: '#f44336' }
  ];

  // Parties definition - can be expanded later
  const PARTIES = [
    { 
      id: 'season-1', 
      name: 'Season 1 Party', 
      members: ['morjor', 'amdir', 'varin', 'tearitus'],
      description: 'The original adventuring party'
    }
    // Add more parties here as campaigns expand
    // { id: 'season-2', name: 'Season 2 Party', members: ['char1', 'char2'], description: '...' }
  ];

  function init() {
    inventoryPanel = document.getElementById('inventory-panel');
    if (!inventoryPanel) return;

    // Close button
    const closeBtn = document.getElementById('inventory-close');
    if (closeBtn) closeBtn.addEventListener('click', hide);

    // Tab buttons
    const personalTab = document.getElementById('inventory-personal-tab');
    const partyTab = document.getElementById('inventory-party-tab');
    if (personalTab) personalTab.addEventListener('click', () => switchTab('personal'));
    if (partyTab) partyTab.addEventListener('click', () => switchTab('party'));

    // Add item button
    const addItemBtn = document.getElementById('inventory-add-item');
    if (addItemBtn) addItemBtn.addEventListener('click', showAddItemModal);

    // Admin player selector
    const playerSelector = document.getElementById('inventory-player-select');
    if (playerSelector) {
      playerSelector.addEventListener('change', (e) => {
        viewingPlayerId = e.target.value || null;
        loadInventory();
      });
    }

    // Party selector
    const partySelector = document.getElementById('inventory-party-select');
    if (partySelector) {
      partySelector.addEventListener('change', (e) => {
        currentPartyId = e.target.value || null;
        if (currentPartyId) loadInventory();
      });
    }

    // Modal close
    const modalClose = document.getElementById('item-modal-close');
    if (modalClose) modalClose.addEventListener('click', hideItemModal);

    const modalCancel = document.getElementById('item-modal-cancel');
    if (modalCancel) modalCancel.addEventListener('click', hideItemModal);

    const modalSave = document.getElementById('item-modal-save');
    if (modalSave) modalSave.addEventListener('click', saveItem);

    // Currency save
    const saveCurrencyBtn = document.getElementById('save-currency');
    if (saveCurrencyBtn) saveCurrencyBtn.addEventListener('click', saveCurrency);

    // Strength input change
    const strengthInput = document.getElementById('carry-strength');
    if (strengthInput) {
      strengthInput.addEventListener('change', () => {
        renderCarryCapacity(parseInt(strengthInput.value) || 15);
      });
    }

    // Spells & Attacks
    const addSpellBtn = document.getElementById('add-spell-attack');
    if (addSpellBtn) addSpellBtn.addEventListener('click', () => showSpellAttackModal());

    const spellModalClose = document.getElementById('spell-attack-modal-close');
    if (spellModalClose) spellModalClose.addEventListener('click', hideSpellAttackModal);

    const spellModalCancel = document.getElementById('spell-attack-modal-cancel');
    if (spellModalCancel) spellModalCancel.addEventListener('click', hideSpellAttackModal);

    const spellModalSave = document.getElementById('spell-attack-modal-save');
    if (spellModalSave) spellModalSave.addEventListener('click', saveSpellAttack);

    console.log('📦 Inventory module initialized');
  }

  // Get parties the current user is a member of
  function getUserParties() {
    const profile = AuthModule.getUserProfile();
    const isAdmin = AuthModule.isAdmin();
    
    if (isAdmin) {
      // Admin sees all parties
      return PARTIES;
    }
    
    if (!profile?.characterId) return [];
    
    // Filter parties where user is a member
    return PARTIES.filter(party => party.members.includes(profile.characterId));
  }

  async function show() {
    if (!AuthModule.isLoggedIn()) {
      AuthModule.showLoginModal();
      return;
    }

    if (inventoryPanel) {
      inventoryPanel.classList.add('active');
      
      // Show/hide admin controls
      const adminControls = document.getElementById('inventory-admin-controls');
      if (adminControls) {
        adminControls.style.display = AuthModule.isAdmin() ? 'flex' : 'none';
        populatePlayerSelector();
      }

      // Check if user can access any party inventory
      const userParties = getUserParties();
      const partyTab = document.getElementById('inventory-party-tab');
      if (partyTab) {
        partyTab.style.display = userParties.length > 0 ? 'flex' : 'none';
      }

      // Populate party selector
      populatePartySelector(userParties);

      // Set default party if user has access
      if (userParties.length > 0) {
        currentPartyId = userParties[0].id;
      }

      switchTab('personal');
    }
  }

  function hide() {
    if (inventoryPanel) {
      inventoryPanel.classList.remove('active');
    }
  }

  function populatePlayerSelector() {
    const selector = document.getElementById('inventory-player-select');
    if (!selector) return;

    const characters = AuthModule.getCharacters().filter(c => !c.isAdmin);
    selector.innerHTML = '<option value="">-- View Player --</option>' +
      characters.map(c => `<option value="${c.id}">${c.name} (${c.player})</option>`).join('');
  }

  function populatePartySelector(parties) {
    const selector = document.getElementById('inventory-party-select');
    const container = document.getElementById('party-selector-container');
    
    if (!selector) return;
    
    if (parties.length === 0) {
      if (container) container.style.display = 'none';
      return;
    }
    
    if (container) container.style.display = 'block';
    
    selector.innerHTML = parties.map(p => 
      `<option value="${p.id}">${p.name}</option>`
    ).join('');
    
    // Set first party as default
    if (parties.length > 0 && !currentPartyId) {
      currentPartyId = parties[0].id;
    }
  }

  async function switchTab(type) {
    currentInventoryType = type;

    // Update tab UI
    const personalTab = document.getElementById('inventory-personal-tab');
    const partyTab = document.getElementById('inventory-party-tab');
    if (personalTab) personalTab.classList.toggle('active', type === 'personal');
    if (partyTab) partyTab.classList.toggle('active', type === 'party');

    // Show/hide party selector
    const partyContainer = document.getElementById('party-selector-container');
    if (partyContainer) {
      partyContainer.style.display = type === 'party' ? 'block' : 'none';
    }

    // Hide admin player controls on Party tab (only show on Personal tab)
    const adminControls = document.getElementById('inventory-admin-controls');
    if (adminControls && AuthModule.isAdmin()) {
      adminControls.style.display = type === 'personal' ? 'flex' : 'none';
    }

    // Show/hide party members display
    const partyMembersDisplay = document.getElementById('party-members-display');
    if (partyMembersDisplay) {
      if (type === 'party') {
        partyMembersDisplay.style.display = 'block';
        renderPartyMembers();
      } else {
        partyMembersDisplay.style.display = 'none';
      }
    }

    // Show/hide carry capacity and attunement (hide for party)
    const capacitySection = document.querySelector('.inventory-capacity');
    const attunementSection = document.querySelector('.inventory-attunement');
    const addItemBtn = document.getElementById('inventory-add-item');
    if (capacitySection) capacitySection.style.display = type === 'party' ? 'none' : 'block';
    if (attunementSection) attunementSection.style.display = type === 'party' ? 'none' : 'block';
    if (addItemBtn) addItemBtn.style.display = type === 'party' ? 'none' : 'inline-flex';

    // Restore personal currency UI if switching to personal
    if (type === 'personal') {
      restorePersonalCurrencyUI();
    }

    // Update header
    const header = inventoryPanel?.querySelector('.inventory-header h2');
    if (header) {
      if (type === 'party') {
        const party = PARTIES.find(p => p.id === currentPartyId);
        header.innerHTML = `<i class="fas fa-users"></i> ${party?.name || 'Party'} Inventory`;
      } else {
        const profile = AuthModule.getUserProfile();
        const name = profile?.character || 'My';
        header.innerHTML = `<i class="fas fa-box-open"></i> ${name}'s Inventory`;
      }
    }

    await loadInventory();
  }

  function renderPartyMembers() {
    const container = document.getElementById('party-members-list');
    if (!container) return;

    const party = PARTIES.find(p => p.id === currentPartyId);
    if (!party) {
      container.innerHTML = '<span class="party-member-tag">No party selected</span>';
      return;
    }

    // Get character names from AuthModule
    const characters = AuthModule.getCharacters ? AuthModule.getCharacters() : [];
    
    container.innerHTML = party.members.map(memberId => {
      const char = characters.find(c => c.id === memberId);
      const name = char ? char.name : memberId.charAt(0).toUpperCase() + memberId.slice(1);
      const player = char ? char.player : '';
      return `
        <span class="party-member-tag">
          <i class="fas fa-user"></i>
          ${escapeHtml(name)}${player ? ` (${escapeHtml(player)})` : ''}
        </span>
      `;
    }).join('');
  }

  async function loadInventory() {
    const user = AuthModule.getCurrentUser();
    if (!user) return;

    const profile = AuthModule.getUserProfile();
    const isAdmin = AuthModule.isAdmin();

    try {
      let docId;
      
      if (currentInventoryType === 'party') {
        // Use the selected party ID
        docId = `party-${currentPartyId || 'season-1'}`;
      } else if (isAdmin && viewingPlayerId) {
        docId = `player-${viewingPlayerId}`;
      } else if (profile?.characterId) {
        docId = `player-${profile.characterId}`;
      } else {
        docId = `player-${user.uid}`;
      }

      currentOwnerId = docId;

      const doc = await window.firebaseDb.collection('inventories').doc(docId).get();
      
      if (doc.exists) {
        const data = doc.data();
        items = data.items || [];
        spellsAttacks = data.spellsAttacks || [];
        
        if (currentInventoryType === 'party') {
          // For party, show member currency breakdown
          renderPartyCurrency(data.memberCurrency || {});
        } else {
          renderCurrency(data.currency || {});
        }
        renderCarryCapacity(data.carryCapacity || 15);
        renderAttunement(data.attunedItems || []);
      } else {
        items = [];
        spellsAttacks = [];
        if (currentInventoryType === 'party') {
          renderPartyCurrency({});
        } else {
          renderCurrency({});
        }
        renderCarryCapacity(15);
        renderAttunement([]);
      }

      renderInventory();
      renderSpellsAttacks();
    } catch (error) {
      console.error('Error loading inventory:', error);
      showNotification('Failed to load inventory', 'error');
    }
  }

  function renderCurrency(currency) {
    const cp = document.getElementById('currency-cp');
    const sp = document.getElementById('currency-sp');
    const ep = document.getElementById('currency-ep');
    const gp = document.getElementById('currency-gp');
    const pp = document.getElementById('currency-pp');

    if (cp) cp.value = currency.cp || 0;
    if (sp) sp.value = currency.sp || 0;
    if (ep) ep.value = currency.ep || 0;
    if (gp) gp.value = currency.gp || 0;
    if (pp) pp.value = currency.pp || 0;

    // Calculate total value in GP
    const totalGP = (
      (currency.cp || 0) / 100 +
      (currency.sp || 0) / 10 +
      (currency.ep || 0) / 2 +
      (currency.gp || 0) +
      (currency.pp || 0) * 10
    ).toFixed(2);

    const totalDisplay = document.getElementById('currency-total');
    if (totalDisplay) totalDisplay.textContent = `${totalGP} GP`;
  }

  // Render party currency showing each member's contribution
  function renderPartyCurrency(memberCurrency) {
    const currencySection = document.querySelector('.inventory-currency');
    if (!currencySection) return;

    // Calculate totals
    let totalCP = 0, totalSP = 0, totalEP = 0, totalGP = 0, totalPP = 0;
    
    const memberBreakdown = Object.entries(memberCurrency).map(([memberId, data]) => {
      totalCP += data.cp || 0;
      totalSP += data.sp || 0;
      totalEP += data.ep || 0;
      totalGP += data.gp || 0;
      totalPP += data.pp || 0;
      
      const memberTotal = (
        (data.cp || 0) / 100 +
        (data.sp || 0) / 10 +
        (data.ep || 0) / 2 +
        (data.gp || 0) +
        (data.pp || 0) * 10
      ).toFixed(2);
      
      return `
        <div class="party-member-currency">
          <span class="member-name">${escapeHtml(data.ownerName || memberId)}</span>
          <span class="member-gold">${memberTotal} GP</span>
        </div>
      `;
    }).join('');

    const grandTotal = (
      totalCP / 100 + totalSP / 10 + totalEP / 2 + totalGP + totalPP * 10
    ).toFixed(2);

    currencySection.innerHTML = `
      <h4><i class="fas fa-coins"></i> Party Wealth</h4>
      <div class="party-currency-breakdown">
        ${memberBreakdown || '<div class="party-member-currency"><span class="member-name">No member contributions yet</span></div>'}
      </div>
      <div class="party-currency-totals">
        <div class="party-total-row">
          <span>CP: ${totalCP}</span>
          <span>SP: ${totalSP}</span>
          <span>EP: ${totalEP}</span>
          <span>GP: ${totalGP}</span>
          <span>PP: ${totalPP}</span>
        </div>
        <div class="party-grand-total">
          <strong>Total Party Wealth:</strong> <span class="gold-value">${grandTotal} GP</span>
        </div>
      </div>
    `;
  }

  // Restore the editable currency UI for personal inventory
  function restorePersonalCurrencyUI() {
    const currencySection = document.querySelector('.inventory-currency');
    if (!currencySection) return;

    currencySection.innerHTML = `
      <h4><i class="fas fa-coins"></i> Currency</h4>
      <div class="currency-grid">
        <div class="currency-item">
          <label>CP</label>
          <input type="number" id="currency-cp" value="0" min="0">
        </div>
        <div class="currency-item">
          <label>SP</label>
          <input type="number" id="currency-sp" value="0" min="0">
        </div>
        <div class="currency-item">
          <label>EP</label>
          <input type="number" id="currency-ep" value="0" min="0">
        </div>
        <div class="currency-item">
          <label>GP</label>
          <input type="number" id="currency-gp" value="0" min="0">
        </div>
        <div class="currency-item">
          <label>PP</label>
          <input type="number" id="currency-pp" value="0" min="0">
        </div>
        <div class="currency-total">
          <label>Total</label>
          <span id="currency-total">0 GP</span>
        </div>
      </div>
      <button class="save-currency-btn" id="save-currency">
        <i class="fas fa-save"></i> Save Currency
      </button>
    `;

    // Re-attach save currency listener
    const saveCurrencyBtn = document.getElementById('save-currency');
    if (saveCurrencyBtn) saveCurrencyBtn.addEventListener('click', saveCurrency);
  }

  function renderCarryCapacity(strength) {
    const capacityDisplay = document.getElementById('carry-capacity-display');
    const strengthInput = document.getElementById('carry-strength');
    
    if (strengthInput) strengthInput.value = strength;

    const maxCapacity = strength * 15; // Standard D&D carry capacity
    const currentWeight = items.reduce((sum, item) => sum + ((item.weight || 0) * (item.quantity || 1)), 0);
    const percentage = Math.min((currentWeight / maxCapacity) * 100, 100);

    if (capacityDisplay) {
      let statusClass = 'normal';
      let statusText = '';
      
      if (currentWeight > maxCapacity) {
        statusClass = 'encumbered';
        statusText = ' (Encumbered!)';
      } else if (currentWeight > maxCapacity * 0.67) {
        statusClass = 'heavy';
        statusText = ' (Heavy Load)';
      }

      capacityDisplay.innerHTML = `
        <div class="capacity-bar">
          <div class="capacity-fill ${statusClass}" style="width: ${percentage}%"></div>
        </div>
        <span class="capacity-text ${statusClass}">${currentWeight.toFixed(1)} / ${maxCapacity} lbs${statusText}</span>
      `;
    }
  }

  function renderAttunement(attunedItems) {
    const container = document.getElementById('attunement-slots');
    if (!container) return;

    const maxSlots = 3;
    const slots = [];
    const currentSlotCount = attunedItems.length;

    for (let i = 0; i < maxSlots; i++) {
      const item = attunedItems[i];
      if (item) {
        slots.push(`
          <div class="attunement-slot filled" data-index="${i}">
            <i class="fas fa-link"></i>
            <span>${escapeHtml(item.name)}</span>
            <button class="attunement-remove" data-index="${i}" title="Remove attunement">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `);
      } else {
        slots.push(`
          <div class="attunement-slot empty" data-slot="${i}" title="Click to attune an item">
            <i class="fas fa-unlink"></i>
            <span>Empty Slot</span>
          </div>
        `);
      }
    }

    container.innerHTML = slots.join('');

    // Add remove listeners
    container.querySelectorAll('.attunement-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeAttunement(parseInt(btn.dataset.index));
      });
    });

    // Add click listeners for empty slots to open attunement modal
    container.querySelectorAll('.attunement-slot.empty').forEach(slot => {
      slot.addEventListener('click', () => {
        showAttunementPicker();
      });
    });
  }

  function showAttunementPicker() {
    // Get items that require attunement and are not already attuned
    const attunableItems = items.filter(item => item.requiresAttunement);
    
    if (attunableItems.length === 0) {
      showNotification('No items available that require attunement', 'info');
      return;
    }

    // Create a simple modal/dropdown for selecting an item to attune
    const existingPicker = document.getElementById('attunement-picker-modal');
    if (existingPicker) existingPicker.remove();

    const modal = document.createElement('div');
    modal.id = 'attunement-picker-modal';
    modal.className = 'attunement-picker-modal';
    modal.innerHTML = `
      <div class="attunement-picker-content">
        <h4><i class="fas fa-link"></i> Select Item to Attune</h4>
        <div class="attunement-picker-list">
          ${attunableItems.map((item, idx) => `
            <div class="attunement-picker-item" data-item-index="${items.indexOf(item)}">
              <i class="fas fa-magic"></i>
              <span>${escapeHtml(item.name)}</span>
            </div>
          `).join('')}
        </div>
        <button class="attunement-picker-cancel">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.attunement-picker-cancel').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelectorAll('.attunement-picker-item').forEach(itemEl => {
      itemEl.addEventListener('click', async () => {
        const itemIndex = parseInt(itemEl.dataset.itemIndex);
        await attuneItem(items[itemIndex]);
        modal.remove();
      });
    });
  }

  async function attuneItem(item) {
    try {
      const doc = await window.firebaseDb.collection('inventories').doc(currentOwnerId).get();
      let attunedItems = [];
      if (doc.exists) {
        attunedItems = doc.data().attunedItems || [];
      }

      // Check if already at max attunement
      if (attunedItems.length >= 3) {
        showNotification('Maximum attunement slots reached (3)', 'error');
        return;
      }

      // Check if item is already attuned
      if (attunedItems.some(a => a.name === item.name)) {
        showNotification('This item is already attuned', 'error');
        return;
      }

      // Add the item
      attunedItems.push({ name: item.name, itemId: item.id || Date.now() });

      await window.firebaseDb.collection('inventories').doc(currentOwnerId).update({
        attunedItems
      });

      renderAttunement(attunedItems);
      showNotification(`${item.name} attuned!`, 'success');
    } catch (error) {
      console.error('Error attuning item:', error);
      showNotification('Failed to attune item', 'error');
    }
  }

  function renderInventory() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr class="empty-inventory">
          <td colspan="9">
            <div class="empty-message">
              <i class="fas fa-box-open"></i>
              <p>No items in inventory. Click "Add Item" to get started!</p>
            </div>
          </td>
        </tr>
      `;
      renderCarryCapacity(document.getElementById('carry-strength')?.value || 15);
      return;
    }

    tableBody.innerHTML = items.map((item, index) => {
      const rarity = ITEM_RARITIES.find(r => r.id === item.rarity) || ITEM_RARITIES[0];
      const totalWeight = ((item.weight || 0) * (item.quantity || 1)).toFixed(1);
      const category = ITEM_CATEGORIES.find(c => c.id === item.category);
      const isPartyView = currentInventoryType === 'party';
      const ownerTag = isPartyView && item.ownerName ? `<span class="item-owner-tag">${escapeHtml(item.ownerName)}</span>` : '';

      return `
        <tr class="inventory-row" data-index="${index}">
          <td class="item-name">
            <span class="rarity-dot" style="background: ${rarity.color}" title="${rarity.name}"></span>
            <span class="name-text">${escapeHtml(item.name)}</span>
            ${ownerTag}
            ${item.requiresAttunement ? '<i class="fas fa-link attunement-icon" title="Requires Attunement"></i>' : ''}
            ${item.equipped ? '<i class="fas fa-check-circle equipped-icon" title="Equipped"></i>' : ''}
            ${item.isPrivate ? '<i class="fas fa-eye-slash private-indicator is-private" title="Private - not synced to party"></i>' : ''}
          </td>
          <td class="item-category">
            <i class="fas ${category?.icon || 'fa-box'}"></i>
          </td>
          <td class="item-description">
            <div class="description-preview" title="${escapeHtml(item.description || '')}">${escapeHtml(truncate(item.description || '-', 40))}</div>
          </td>
          <td class="item-damage-roll">
            ${item.damageRoll ? `<code>${escapeHtml(item.damageRoll)}</code>` : '-'}
          </td>
          <td class="item-properties">
            ${item.properties ? `<span class="properties-text">${escapeHtml(truncate(item.properties, 30))}</span>` : '-'}
          </td>
          <td class="item-weight">${item.weight || 0}</td>
          <td class="item-total-weight">${totalWeight}</td>
          <td class="item-quantity">
            ${isPartyView ? `<span class="qty-value">${item.quantity || 1}</span>` : `
            <div class="quantity-controls">
              <button class="qty-btn minus" data-index="${index}" title="Decrease">-</button>
              <span class="qty-value">${item.quantity || 1}</span>
              <button class="qty-btn plus" data-index="${index}" title="Increase">+</button>
            </div>`}
          </td>
          <td class="item-actions">
            ${isPartyView ? '<span class="readonly-indicator" title="Edit from personal inventory"><i class="fas fa-lock"></i></span>' : `
            <button class="action-btn edit" data-index="${index}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" data-index="${index}" title="Delete">
              <i class="fas fa-trash"></i>
            </button>`}
          </td>
        </tr>
      `;
    }).join('');

    // Add event listeners (only for personal inventory)
    if (currentInventoryType !== 'party') {
      tableBody.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.index), -1));
      });

      tableBody.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.index), 1));
      });

      tableBody.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => editItem(parseInt(btn.dataset.index)));
      });

      tableBody.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => deleteItem(parseInt(btn.dataset.index)));
      });
    }

    // Update carry capacity
    if (currentInventoryType !== 'party') {
      renderCarryCapacity(document.getElementById('carry-strength')?.value || 15);
    }
  }

  async function updateQuantity(index, delta) {
    if (index < 0 || index >= items.length) return;

    const newQty = (items[index].quantity || 1) + delta;
    if (newQty < 0) return;

    if (newQty === 0) {
      // Remove item if quantity reaches 0
      items.splice(index, 1);
    } else {
      items[index].quantity = newQty;
    }

    await saveInventory();
    renderInventory();
  }

  function showAddItemModal(item = null, editIndex = null) {
    const modal = document.getElementById('item-modal');
    if (!modal) return;

    // Reset form
    const form = document.getElementById('item-form');
    if (form) form.reset();

    // Populate category select
    const categorySelect = document.getElementById('item-category');
    if (categorySelect) {
      categorySelect.innerHTML = ITEM_CATEGORIES.map(c => 
        `<option value="${c.id}">${c.name}</option>`
      ).join('');
    }

    // Populate rarity select
    const raritySelect = document.getElementById('item-rarity');
    if (raritySelect) {
      raritySelect.innerHTML = ITEM_RARITIES.map(r => 
        `<option value="${r.id}">${r.name}</option>`
      ).join('');
    }

    // If editing, fill in values
    if (item) {
      document.getElementById('item-name').value = item.name || '';
      document.getElementById('item-category').value = item.category || 'misc';
      document.getElementById('item-rarity').value = item.rarity || 'common';
      document.getElementById('item-description').value = item.description || '';
      document.getElementById('item-damage-roll').value = item.damageRoll || '';
      document.getElementById('item-properties').value = item.properties || '';
      document.getElementById('item-weight').value = item.weight || 0;
      document.getElementById('item-quantity').value = item.quantity || 1;
      document.getElementById('item-value').value = item.value || '';
      document.getElementById('item-attunement').checked = item.requiresAttunement || false;
      document.getElementById('item-equipped').checked = item.equipped || false;
      document.getElementById('item-private').checked = item.isPrivate || false;
      document.getElementById('item-notes').value = item.notes || '';
    }

    // Store edit index
    modal.dataset.editIndex = editIndex !== null ? editIndex : '';

    // Update modal title
    const modalTitle = modal.querySelector('h3');
    if (modalTitle) {
      modalTitle.textContent = editIndex !== null ? 'Edit Item' : 'Add New Item';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideItemModal() {
    const modal = document.getElementById('item-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.dataset.editIndex = '';
    }
    document.body.style.overflow = '';
  }

  async function saveItem() {
    const modal = document.getElementById('item-modal');
    const editIndex = modal?.dataset.editIndex;

    const newItem = {
      name: document.getElementById('item-name')?.value || 'Unnamed Item',
      category: document.getElementById('item-category')?.value || 'misc',
      rarity: document.getElementById('item-rarity')?.value || 'common',
      description: document.getElementById('item-description')?.value || '',
      damageRoll: document.getElementById('item-damage-roll')?.value || '',
      properties: document.getElementById('item-properties')?.value || '',
      weight: parseFloat(document.getElementById('item-weight')?.value) || 0,
      quantity: parseInt(document.getElementById('item-quantity')?.value) || 1,
      value: document.getElementById('item-value')?.value || '',
      requiresAttunement: document.getElementById('item-attunement')?.checked || false,
      equipped: document.getElementById('item-equipped')?.checked || false,
      isPrivate: document.getElementById('item-private')?.checked || false,
      notes: document.getElementById('item-notes')?.value || '',
      addedAt: firebase.firestore.Timestamp.now()
    };

    if (editIndex !== '' && editIndex !== undefined) {
      // Update existing item
      items[parseInt(editIndex)] = { ...items[parseInt(editIndex)], ...newItem };
    } else {
      // Add new item
      items.push(newItem);
    }

    await saveInventory();
    hideItemModal();
    renderInventory();
    showNotification(editIndex ? 'Item updated!' : 'Item added!', 'success');
  }

  function editItem(index) {
    if (index >= 0 && index < items.length) {
      showAddItemModal(items[index], index);
    }
  }

  async function deleteItem(index) {
    if (index < 0 || index >= items.length) return;

    if (confirm(`Delete "${items[index].name}"?`)) {
      items.splice(index, 1);
      await saveInventory();
      renderInventory();
      showNotification('Item deleted', 'success');
    }
  }

  async function saveCurrency() {
    const currency = {
      cp: parseInt(document.getElementById('currency-cp')?.value) || 0,
      sp: parseInt(document.getElementById('currency-sp')?.value) || 0,
      ep: parseInt(document.getElementById('currency-ep')?.value) || 0,
      gp: parseInt(document.getElementById('currency-gp')?.value) || 0,
      pp: parseInt(document.getElementById('currency-pp')?.value) || 0
    };

    try {
      await window.firebaseDb.collection('inventories').doc(currentOwnerId).set({
        currency,
        items,
        carryCapacity: parseInt(document.getElementById('carry-strength')?.value) || 15,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      renderCurrency(currency);
      showNotification('Currency saved!', 'success');
      
      // Also sync to party if this is a personal inventory
      if (currentInventoryType === 'personal') {
        await syncToPartyInventories(items, currency);
      }
    } catch (error) {
      console.error('Error saving currency:', error);
      showNotification('Failed to save currency', 'error');
    }
  }

  async function saveInventory() {
    if (!currentOwnerId) return;

    try {
      const currency = {
        cp: parseInt(document.getElementById('currency-cp')?.value) || 0,
        sp: parseInt(document.getElementById('currency-sp')?.value) || 0,
        ep: parseInt(document.getElementById('currency-ep')?.value) || 0,
        gp: parseInt(document.getElementById('currency-gp')?.value) || 0,
        pp: parseInt(document.getElementById('currency-pp')?.value) || 0
      };

      await window.firebaseDb.collection('inventories').doc(currentOwnerId).set({
        items,
        spellsAttacks,
        currency,
        carryCapacity: parseInt(document.getElementById('carry-strength')?.value) || 15,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: currentInventoryType
      }, { merge: true });

      // If this is a personal inventory, sync non-private items to party inventories
      if (currentInventoryType === 'personal') {
        await syncToPartyInventories(items, currency);
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      showNotification('Failed to save inventory', 'error');
    }
  }

  // Sync non-private items and currency to all party inventories the player is a member of
  async function syncToPartyInventories(playerItems, playerCurrency) {
    // Determine whose inventory we're syncing
    // If admin is viewing a player, use that player's ID; otherwise use current user's profile
    let characterId, characterName;
    
    if (viewingPlayerId) {
      // Admin is viewing a specific player
      characterId = viewingPlayerId;
      const characters = AuthModule.getCharacters ? AuthModule.getCharacters() : [];
      const char = characters.find(c => c.id === viewingPlayerId);
      characterName = char ? char.name : viewingPlayerId;
    } else {
      // Current user's own inventory
      const profile = AuthModule.getUserProfile();
      if (!profile?.characterId) {
        console.log('❌ No characterId found, skipping party sync');
        return;
      }
      characterId = profile.characterId;
      characterName = profile.character || characterId;
    }
    
    console.log('🔄 Syncing to party inventories...', { characterId, characterName });

    // Find all parties this player is a member of
    const playerParties = PARTIES.filter(p => p.members.includes(characterId));
    console.log('📋 Player parties:', playerParties.map(p => p.name));
    
    if (playerParties.length === 0) {
      console.log('❌ Player is not a member of any party. Members check:', { characterId, partiesMembers: PARTIES.map(p => p.members) });
      return;
    }

    // Get non-private items only
    const publicItems = playerItems.filter(item => !item.isPrivate).map(item => ({
      ...item,
      ownerId: characterId,
      ownerName: characterName
    }));
    console.log('📦 Public items to sync:', publicItems.length);

    for (const party of playerParties) {
      const partyDocId = `party-${party.id}`;
      console.log(`🎯 Syncing to party: ${party.name} (${partyDocId})`);
      
      try {
        const partyDoc = await window.firebaseDb.collection('inventories').doc(partyDocId).get();
        let partyData = partyDoc.exists ? partyDoc.data() : { items: [], memberCurrency: {} };
        
        // Remove old items from this player
        const otherPlayersItems = (partyData.items || []).filter(item => item.ownerId !== characterId);
        
        // Add current player's public items
        const newPartyItems = [...otherPlayersItems, ...publicItems];
        
        // Store each member's currency separately
        const memberCurrency = partyData.memberCurrency || {};
        memberCurrency[characterId] = {
          ...playerCurrency,
          ownerName: characterName
        };
        
        await window.firebaseDb.collection('inventories').doc(partyDocId).set({
          items: newPartyItems,
          memberCurrency,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          type: 'party'
        }, { merge: true });
        
        console.log(`✅ Successfully synced to ${party.name}`);
      } catch (error) {
        console.error(`Error syncing to party ${party.id}:`, error);
      }
    }
  }

  async function removeAttunement(index) {
    try {
      const doc = await window.firebaseDb.collection('inventories').doc(currentOwnerId).get();
      if (doc.exists) {
        const data = doc.data();
        const attunedItems = data.attunedItems || [];
        attunedItems.splice(index, 1);
        
        await window.firebaseDb.collection('inventories').doc(currentOwnerId).update({
          attunedItems
        });
        
        renderAttunement(attunedItems);
        showNotification('Attunement removed', 'success');
      }
    } catch (error) {
      console.error('Error removing attunement:', error);
    }
  }

  function truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============== SPELLS & ATTACKS ==============

  function renderSpellsAttacks() {
    const tableBody = document.getElementById('spells-attacks-table-body');
    const section = document.getElementById('spells-attacks-section');
    if (!tableBody) return;

    // Hide section for party view
    if (section) {
      section.style.display = currentInventoryType === 'party' ? 'none' : 'block';
    }

    if (spellsAttacks.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="spell-empty-message">
            <i class="fas fa-magic"></i> No spells or attacks added yet
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = spellsAttacks.map((sa, index) => {
      return `
        <tr class="spell-attack-row" data-index="${index}">
          <td class="spell-attack-name">
            ${escapeHtml(sa.name)}
            ${sa.isPrivate ? '<i class="fas fa-eye-slash private-indicator is-private" title="Private"></i>' : ''}
          </td>
          <td>
            <span class="spell-type-badge ${sa.type}">${escapeHtml(sa.type)}</span>
          </td>
          <td>${escapeHtml(sa.range || '-')}</td>
          <td>${escapeHtml(sa.hitDC || '-')}</td>
          <td>
            ${sa.damage ? `<span class="spell-damage">${escapeHtml(sa.damage)}</span>` : '-'}
          </td>
          <td>${escapeHtml(truncate(sa.notes || '', 30))}</td>
          <td class="item-actions">
            <button class="action-btn edit spell-edit" data-index="${index}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete spell-delete" data-index="${index}" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Add event listeners
    tableBody.querySelectorAll('.spell-edit').forEach(btn => {
      btn.addEventListener('click', () => editSpellAttack(parseInt(btn.dataset.index)));
    });

    tableBody.querySelectorAll('.spell-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteSpellAttack(parseInt(btn.dataset.index)));
    });
  }

  function showSpellAttackModal(sa = null, editIndex = null) {
    const modal = document.getElementById('spell-attack-modal');
    if (!modal) return;

    // Reset form
    const form = document.getElementById('spell-attack-form');
    if (form) form.reset();

    // If editing, fill in values
    if (sa) {
      document.getElementById('spell-attack-name').value = sa.name || '';
      document.getElementById('spell-attack-type').value = sa.type || 'spell';
      document.getElementById('spell-attack-range').value = sa.range || '';
      document.getElementById('spell-attack-hit-dc').value = sa.hitDC || '';
      document.getElementById('spell-attack-damage').value = sa.damage || '';
      document.getElementById('spell-attack-level').value = sa.level || '';
      document.getElementById('spell-attack-notes').value = sa.notes || '';
    }

    // Store edit index
    modal.dataset.editIndex = editIndex !== null ? editIndex : '';

    // Update modal title
    const modalTitle = modal.querySelector('h3');
    if (modalTitle) {
      modalTitle.textContent = editIndex !== null ? 'Edit Spell/Attack' : 'Add Spell/Attack';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideSpellAttackModal() {
    const modal = document.getElementById('spell-attack-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.dataset.editIndex = '';
    }
    document.body.style.overflow = '';
  }

  async function saveSpellAttack() {
    const modal = document.getElementById('spell-attack-modal');
    const editIndex = modal?.dataset.editIndex;

    const newSpellAttack = {
      name: document.getElementById('spell-attack-name')?.value || 'Unnamed',
      type: document.getElementById('spell-attack-type')?.value || 'spell',
      range: document.getElementById('spell-attack-range')?.value || '',
      hitDC: document.getElementById('spell-attack-hit-dc')?.value || '',
      damage: document.getElementById('spell-attack-damage')?.value || '',
      level: document.getElementById('spell-attack-level')?.value || '',
      notes: document.getElementById('spell-attack-notes')?.value || '',
      addedAt: firebase.firestore.Timestamp.now()
    };

    if (editIndex !== '' && editIndex !== undefined) {
      spellsAttacks[parseInt(editIndex)] = { ...spellsAttacks[parseInt(editIndex)], ...newSpellAttack };
    } else {
      spellsAttacks.push(newSpellAttack);
    }

    await saveSpellsAttacksToFirestore();
    hideSpellAttackModal();
    renderSpellsAttacks();
    showNotification(editIndex ? 'Updated!' : 'Added!', 'success');
  }

  function editSpellAttack(index) {
    if (index >= 0 && index < spellsAttacks.length) {
      showSpellAttackModal(spellsAttacks[index], index);
    }
  }

  async function deleteSpellAttack(index) {
    if (index < 0 || index >= spellsAttacks.length) return;

    if (confirm(`Delete "${spellsAttacks[index].name}"?`)) {
      spellsAttacks.splice(index, 1);
      await saveSpellsAttacksToFirestore();
      renderSpellsAttacks();
      showNotification('Deleted', 'success');
    }
  }

  async function saveSpellsAttacksToFirestore() {
    if (!currentOwnerId) return;

    try {
      await window.firebaseDb.collection('inventories').doc(currentOwnerId).set({
        spellsAttacks,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving spells/attacks:', error);
      showNotification('Failed to save', 'error');
    }
  }

  function showNotification(message, type = 'info') {
    if (typeof AuthModule !== 'undefined' && AuthModule.showNotification) {
      AuthModule.showNotification(message, type);
    } else {
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
  }

  return {
    init,
    show,
    hide
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  InventoryModule.init();
});
