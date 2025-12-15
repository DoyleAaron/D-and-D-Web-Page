/**
 * Journal Module
 * Dayner D&D Lore Website
 * Player journals stored in Firestore with Firebase Auth
 * Admin can view and edit all journals
 */

const JournalModule = (function() {
  let journalPanel = null;
  let journalList = null;
  let journalEditor = null;
  let currentEntryId = null;
  let currentEntryOwnerId = null; // Track owner for admin editing
  let entries = [];
  let viewingAllJournals = false; // Admin toggle

  function init() {
    journalPanel = document.getElementById('journal-panel');
    journalList = document.getElementById('journal-list');
    journalEditor = document.getElementById('journal-editor');

    const closeBtn = document.getElementById('journal-close');
    if (closeBtn) closeBtn.addEventListener('click', hide);

    const newEntryBtn = document.getElementById('journal-new');
    if (newEntryBtn) newEntryBtn.addEventListener('click', createNewEntry);

    const saveBtn = document.getElementById('journal-save');
    if (saveBtn) saveBtn.addEventListener('click', saveEntry);

    const deleteBtn = document.getElementById('journal-delete');
    if (deleteBtn) deleteBtn.addEventListener('click', deleteEntry);

    const backBtn = document.getElementById('journal-back');
    if (backBtn) backBtn.addEventListener('click', showList);
    
    // Admin toggle for viewing all journals
    const adminToggle = document.getElementById('journal-admin-toggle');
    if (adminToggle) {
      adminToggle.addEventListener('click', toggleAdminView);
    }
  }

  async function show() {
    if (!AuthModule.isLoggedIn()) {
      AuthModule.showLoginModal();
      return;
    }

    if (journalPanel) {
      journalPanel.classList.add('active');
      
      // Show/hide admin toggle
      const adminToggle = document.getElementById('journal-admin-toggle');
      if (adminToggle) {
        adminToggle.style.display = AuthModule.isAdmin() ? 'block' : 'none';
      }
      
      // Admin starts in "All Journals" view by default
      if (AuthModule.isAdmin()) {
        viewingAllJournals = true;
        if (adminToggle) {
          adminToggle.innerHTML = '<i class="fas fa-user"></i> My Journals';
          adminToggle.classList.add('active');
        }
        // Create default journals for all players if they don't exist
        await createAllPlayerJournals();
      } else {
        // For non-admin: Try to claim placeholder journal first
        await claimOrCreateJournal();
      }
      
      // Update header based on admin status
      updateJournalHeader();
      
      showList();
      await loadEntries();
    }
  }

  function hide() {
    if (journalPanel) {
      journalPanel.classList.remove('active');
      currentEntryId = null;
      currentEntryOwnerId = null;
      viewingAllJournals = false;
    }
  }
  
  function updateJournalHeader() {
    const headerTitle = journalPanel?.querySelector('.journal-header h2');
    if (headerTitle) {
      if (AuthModule.isAdmin() && viewingAllJournals) {
        headerTitle.innerHTML = '<i class="fas fa-book"></i> All Journals (Admin)';
      } else {
        headerTitle.innerHTML = '<i class="fas fa-book"></i> My Journal';
      }
    }
  }
  
  async function toggleAdminView() {
    viewingAllJournals = !viewingAllJournals;
    
    const adminToggle = document.getElementById('journal-admin-toggle');
    if (adminToggle) {
      if (viewingAllJournals) {
        adminToggle.innerHTML = '<i class="fas fa-user"></i> My Journals';
        adminToggle.classList.add('active');
      } else {
        adminToggle.innerHTML = '<i class="fas fa-users"></i> All Journals';
        adminToggle.classList.remove('active');
      }
    }
    
    updateJournalHeader();
    await loadEntries();
  }

  function showList() {
    if (journalList) journalList.style.display = 'flex';
    if (journalEditor) journalEditor.style.display = 'none';
    currentEntryId = null;
    currentEntryOwnerId = null;
    renderEntryList();
  }

  function showEditor(entry = null) {
    if (journalList) journalList.style.display = 'none';
    if (journalEditor) journalEditor.style.display = 'flex';

    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const dateDisplay = document.getElementById('journal-date');
    const deleteBtn = document.getElementById('journal-delete');
    const ownerDisplay = document.getElementById('journal-owner');

    if (entry) {
      currentEntryId = entry.id;
      currentEntryOwnerId = entry.userId;
      if (titleInput) titleInput.value = entry.title || '';
      if (contentInput) contentInput.value = entry.content || '';
      if (dateDisplay) {
        const date = entry.updatedAt ? entry.updatedAt.toDate() : new Date();
        dateDisplay.textContent = 'Last updated: ' + formatDate(date);
      }
      if (deleteBtn) deleteBtn.style.display = 'block';
      
      // Show owner info for admin viewing others' entries
      if (ownerDisplay) {
        if (AuthModule.isAdmin() && entry.userId !== AuthModule.getCurrentUser().uid) {
          ownerDisplay.textContent = `Owner: ${entry.playerName || entry.character || 'Unknown'}`;
          ownerDisplay.style.display = 'block';
        } else {
          ownerDisplay.style.display = 'none';
        }
      }
    } else {
      currentEntryId = null;
      currentEntryOwnerId = null;
      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
      if (dateDisplay) dateDisplay.textContent = 'New entry';
      if (deleteBtn) deleteBtn.style.display = 'none';
      if (ownerDisplay) ownerDisplay.style.display = 'none';
    }
  }

  async function loadEntries() {
    const user = AuthModule.getCurrentUser();
    if (!user) return;

    try {
      let query;
      
      if (AuthModule.isAdmin() && viewingAllJournals) {
        // Admin viewing all journals
        query = window.firebaseDb
          .collection('journals')
          .orderBy('updatedAt', 'desc');
      } else {
        // Regular user or admin viewing own journals
        query = window.firebaseDb
          .collection('journals')
          .where('userId', '==', user.uid)
          .orderBy('updatedAt', 'desc');
      }
      
      const snapshot = await query.get();

      entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      renderEntryList();
    } catch (error) {
      console.error('Error loading journal entries:', error);
      showNotification('Failed to load journal entries', 'error');
    }
  }

  function renderEntryList() {
    const listContainer = document.getElementById('journal-entries');
    if (!listContainer) return;

    const profile = AuthModule.getUserProfile();
    const isAdmin = AuthModule.isAdmin();
    const currentUserId = AuthModule.getCurrentUser()?.uid;

    if (entries.length === 0) {
      const emptyMessage = isAdmin && viewingAllJournals 
        ? 'No journal entries from any player yet.'
        : `No journal entries yet. Click "New Entry" to start writing, ${profile ? profile.character : 'Adventurer'}!`;
      
      listContainer.innerHTML = `
        <div class="journal-empty">
          <i class="fas fa-book-open"></i>
          <p>${emptyMessage}</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = entries.map(entry => {
      const isOwnEntry = entry.userId === currentUserId;
      const ownerBadge = (isAdmin && viewingAllJournals && !isOwnEntry) 
        ? `<span class="journal-owner-badge">${escapeHtml(entry.playerName || entry.character || 'Unknown')}</span>` 
        : '';
      
      return `
        <div class="journal-entry-item ${!isOwnEntry && isAdmin ? 'other-player' : ''}" data-id="${entry.id}">
          <div class="journal-entry-header">
            <div class="journal-entry-title">${escapeHtml(entry.title || 'Untitled')}</div>
            ${ownerBadge}
          </div>
          <div class="journal-entry-preview">${escapeHtml(truncate(entry.content || '', 100))}</div>
          <div class="journal-entry-date">${formatDate(entry.updatedAt ? entry.updatedAt.toDate() : new Date())}</div>
        </div>
      `;
    }).join('');

    listContainer.querySelectorAll('.journal-entry-item').forEach(item => {
      item.addEventListener('click', () => {
        const entryId = item.dataset.id;
        const entry = entries.find(e => e.id === entryId);
        if (entry) showEditor(entry);
      });
    });
  }

  function createNewEntry() {
    showEditor(null);
  }
  
  // Admin function: Create default journals for all player characters
  async function createAllPlayerJournals() {
    if (!AuthModule.isAdmin()) return;
    
    try {
      // Get all characters (excluding admin)
      const characters = AuthModule.getCharacters().filter(c => !c.isAdmin);
      
      // Get existing journals to see which characters already have one
      const existingSnapshot = await window.firebaseDb
        .collection('journals')
        .where('isDefault', '==', true)
        .get();
      
      const existingCharacters = new Set(
        existingSnapshot.docs.map(doc => doc.data().character)
      );
      
      // Create journals for characters that don't have one
      const journalsToCreate = characters.filter(c => !existingCharacters.has(c.name));
      
      if (journalsToCreate.length === 0) return;
      
      const calendarDates = [
        { date: 'February 9, 1225', heading: '## February 9, 1225 - The Meeting' },
        { date: 'February 10, 1225', heading: '## February 10, 1225' },
        { date: 'February 11, 1225', heading: '## February 11, 1225' },
        { date: 'February 12, 1225', heading: '## February 12, 1225' },
        { date: 'February 13, 1225', heading: '## February 13, 1225' },
        { date: 'February 14, 1225', heading: '## February 14, 1225' },
        { date: 'February 15, 1225', heading: '## February 15, 1225' },
        { date: 'February 16, 1225', heading: '## February 16, 1225' },
        { date: 'February 17, 1225', heading: '## February 17, 1225' },
        { date: 'February 18, 1225', heading: '## February 18, 1225' },
        { date: 'February 19, 1225', heading: '## February 19, 1225' },
        { date: 'February 20, 1225', heading: '## February 20, 1225' },
        { date: 'February 21, 1225', heading: '## February 21, 1225' }
      ];
      
      const batch = window.firebaseDb.batch();
      
      for (const character of journalsToCreate) {
        const headingsContent = calendarDates.map(d => `${d.heading}\n\n*What happened on this day...*\n`).join('\n---\n\n');
        const defaultContent = `# ${character.name}'s Journal

*A record of my adventures in the realm of Dayner...*

---

${headingsContent}`;

        const docRef = window.firebaseDb.collection('journals').doc();
        batch.set(docRef, {
          userId: `placeholder-${character.id}`, // Placeholder until player logs in
          playerName: character.player,
          character: character.name,
          characterId: character.id,
          title: `${character.name}'s Journal`,
          content: defaultContent,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          isDefault: true,
          createdByAdmin: true
        });
      }
      
      await batch.commit();
      showNotification(`Created ${journalsToCreate.length} player journal(s)`, 'success');
    } catch (error) {
      console.error('Error creating player journals:', error);
    }
  }
  
  // Claim an admin-created placeholder journal or create a new one for a player
  async function claimOrCreateJournal() {
    const user = AuthModule.getCurrentUser();
    const profile = AuthModule.getUserProfile();
    if (!user || !profile) return;

    const characterId = profile.characterId;
    const characterName = profile.character || 'Adventurer';

    try {
      // First check if user already has a journal
      const existingQuery = await window.firebaseDb
        .collection('journals')
        .where('userId', '==', user.uid)
        .limit(1)
        .get();
      
      if (!existingQuery.empty) {
        // User already has a journal, nothing to do
        return;
      }

      // Check if there's an admin-created placeholder journal for this character
      const placeholderQuery = await window.firebaseDb
        .collection('journals')
        .where('characterId', '==', characterId)
        .where('createdByAdmin', '==', true)
        .get();
      
      if (!placeholderQuery.empty) {
        // Claim the placeholder journal by updating the userId
        const placeholderDoc = placeholderQuery.docs[0];
        await window.firebaseDb.collection('journals').doc(placeholderDoc.id).update({
          userId: user.uid,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showNotification(`Welcome, ${characterName}! Your journal is ready.`, 'success');
        return;
      }

      // No placeholder found, create a new journal
      const calendarDates = [
        { date: 'February 9, 1225', heading: '## February 9, 1225 - The Meeting' },
        { date: 'February 10, 1225', heading: '## February 10, 1225' },
        { date: 'February 11, 1225', heading: '## February 11, 1225' },
        { date: 'February 12, 1225', heading: '## February 12, 1225' },
        { date: 'February 13, 1225', heading: '## February 13, 1225' },
        { date: 'February 14, 1225', heading: '## February 14, 1225' },
        { date: 'February 15, 1225', heading: '## February 15, 1225' },
        { date: 'February 16, 1225', heading: '## February 16, 1225' },
        { date: 'February 17, 1225', heading: '## February 17, 1225' },
        { date: 'February 18, 1225', heading: '## February 18, 1225' },
        { date: 'February 19, 1225', heading: '## February 19, 1225' },
        { date: 'February 20, 1225', heading: '## February 20, 1225' },
        { date: 'February 21, 1225', heading: '## February 21, 1225' }
      ];

      const headingsContent = calendarDates.map(d => `${d.heading}\n\n*What happened on this day...*\n`).join('\n---\n\n');
      
      const defaultContent = `# ${characterName}'s Journal

*A record of my adventures in the realm of Dayner...*

---

${headingsContent}`;

      const entryData = {
        userId: user.uid,
        playerName: profile?.player || 'Unknown',
        character: characterName,
        characterId: characterId,
        title: `${characterName}'s Journal`,
        content: defaultContent,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        isDefault: true
      };
      
      await window.firebaseDb.collection('journals').add(entryData);
      showNotification(`Welcome, ${characterName}! Your journal has been created.`, 'success');
    } catch (error) {
      console.error('Error claiming/creating journal:', error);
    }
  }

  async function saveEntry() {
    const user = AuthModule.getCurrentUser();
    const profile = AuthModule.getUserProfile();
    if (!user) return;

    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const saveBtn = document.getElementById('journal-save');

    const title = titleInput ? titleInput.value.trim() : '';
    const content = contentInput ? contentInput.value.trim() : '';

    if (!title && !content) {
      showNotification('Please enter a title or content', 'warning');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    try {
      if (currentEntryId) {
        // Update existing entry
        const updateData = {
          title: title,
          content: content,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // If admin editing someone else's entry, add edit note
        if (AuthModule.isAdmin() && currentEntryOwnerId !== user.uid) {
          updateData.lastEditedBy = 'Admin';
          updateData.lastEditedAt = firebase.firestore.FieldValue.serverTimestamp();
        }
        
        await window.firebaseDb.collection('journals').doc(currentEntryId).update(updateData);
        showNotification('Entry saved', 'success');
      } else {
        // Create new entry
        const entryData = {
          userId: user.uid,
          playerName: profile?.player || 'Unknown',
          character: profile?.character || 'Unknown',
          title: title,
          content: content,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await window.firebaseDb.collection('journals').add(entryData);
        currentEntryId = docRef.id;
        currentEntryOwnerId = user.uid;
        showNotification('Entry created', 'success');
      }

      await loadEntries();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      showNotification('Failed to save entry', 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
      }
    }
  }

  async function deleteEntry() {
    if (!currentEntryId) return;
    
    const isOwnEntry = currentEntryOwnerId === AuthModule.getCurrentUser()?.uid;
    const confirmMessage = isOwnEntry 
      ? 'Are you sure you want to delete this journal entry?'
      : 'Are you sure you want to delete this player\'s journal entry? (Admin action)';

    const confirmed = confirm(confirmMessage);
    if (!confirmed) return;

    const deleteBtn = document.getElementById('journal-delete');
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    try {
      await window.firebaseDb.collection('journals').doc(currentEntryId).delete();
      showNotification('Entry deleted', 'success');
      currentEntryId = null;
      currentEntryOwnerId = null;
      await loadEntries();
      showList();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      showNotification('Failed to delete entry', 'error');
    } finally {
      if (deleteBtn) {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
      }
    }
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showNotification(message, type = 'info') {
    if (AuthModule.showNotification) {
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
    hide,
    loadEntries
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  JournalModule.init();
});
