/**
 * Journal Module
 * Dayner D&D Lore Website
 * Player journals stored in Firestore, rendered as markdown
 */

const JournalModule = (function() {
  let journalPanel = null;
  let journalList = null;
  let journalEditor = null;
  let currentEntryId = null;
  let entries = [];

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
  }

  async function show() {
    if (!AuthModule.isLoggedIn()) {
      AuthModule.showLoginModal();
      return;
    }

    if (journalPanel) {
      journalPanel.classList.add('active');
      showList();
      await loadEntries();
    }
  }

  function hide() {
    if (journalPanel) {
      journalPanel.classList.remove('active');
      currentEntryId = null;
    }
  }

  function showList() {
    if (journalList) journalList.style.display = 'block';
    if (journalEditor) journalEditor.style.display = 'none';
    currentEntryId = null;
    renderEntryList();
  }

  function showEditor(entry = null) {
    if (journalList) journalList.style.display = 'none';
    if (journalEditor) journalEditor.style.display = 'block';

    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const dateDisplay = document.getElementById('journal-date');
    const deleteBtn = document.getElementById('journal-delete');

    if (entry) {
      currentEntryId = entry.id;
      if (titleInput) titleInput.value = entry.title || '';
      if (contentInput) contentInput.value = entry.content || '';
      if (dateDisplay) {
        const date = entry.updatedAt ? entry.updatedAt.toDate() : new Date();
        dateDisplay.textContent = 'Last updated: ' + formatDate(date);
      }
      if (deleteBtn) deleteBtn.style.display = 'block';
    } else {
      currentEntryId = null;
      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
      if (dateDisplay) dateDisplay.textContent = 'New entry';
      if (deleteBtn) deleteBtn.style.display = 'none';
    }
  }

  async function loadEntries() {
    const player = AuthModule.getCurrentPlayer();
    if (!player) return;

    try {
      const snapshot = await window.firebaseDb
        .collection('journals')
        .where('playerId', '==', player.id)
        .orderBy('updatedAt', 'desc')
        .get();

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

    const player = AuthModule.getCurrentPlayer();

    if (entries.length === 0) {
      listContainer.innerHTML = `
        <div class="journal-empty">
          <i class="fas fa-book-open"></i>
          <p>No journal entries yet</p>
          <p class="text-muted">Click "New Entry" to start writing, ${player ? player.firstName : 'Adventurer'}!</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = entries.map(entry => `
      <div class="journal-entry-item" data-id="${entry.id}">
        <div class="journal-entry-title">${escapeHtml(entry.title || 'Untitled')}</div>
        <div class="journal-entry-preview">${escapeHtml(truncate(entry.content || '', 100))}</div>
        <div class="journal-entry-date">${formatDate(entry.updatedAt ? entry.updatedAt.toDate() : new Date())}</div>
      </div>
    `).join('');

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

  async function saveEntry() {
    const player = AuthModule.getCurrentPlayer();
    if (!player) return;

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
      const entryData = {
        playerId: player.id,
        playerName: player.firstName + (player.lastName ? ' ' + player.lastName : ''),
        title: title,
        content: content,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (currentEntryId) {
        await window.firebaseDb.collection('journals').doc(currentEntryId).update(entryData);
        showNotification('Entry saved', 'success');
      } else {
        entryData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const docRef = await window.firebaseDb.collection('journals').add(entryData);
        currentEntryId = docRef.id;
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

    const confirmed = confirm('Are you sure you want to delete this journal entry?');
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
    show,
    hide,
    loadEntries
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  JournalModule.init();
});
