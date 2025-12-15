/**
 * Checklist Module
 * Dayner D&D Lore Website
 * Player checklists stored in Firestore with Firebase Auth
 */

const ChecklistModule = (function() {
  let checklistPanel = null;
  let checklistItems = [];
  let currentFilter = 'all';

  function init() {
    checklistPanel = document.getElementById('checklist-panel');
    
    const closeBtn = document.getElementById('checklist-close');
    if (closeBtn) closeBtn.addEventListener('click', hide);

    const addBtn = document.getElementById('checklist-add');
    if (addBtn) addBtn.addEventListener('click', addItem);

    const newItemInput = document.getElementById('checklist-new-item');
    if (newItemInput) {
      newItemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
      });
    }

    const clearBtn = document.getElementById('checklist-clear-completed');
    if (clearBtn) clearBtn.addEventListener('click', clearCompleted);

    // Filter buttons
    document.querySelectorAll('.checklist-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        document.querySelectorAll('.checklist-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderItems();
      });
    });
  }

  async function show() {
    if (!AuthModule.isLoggedIn()) {
      AuthModule.showLoginModal();
      return;
    }

    if (checklistPanel) {
      checklistPanel.classList.add('active');
      await loadItems();
    }
  }

  function hide() {
    if (checklistPanel) {
      checklistPanel.classList.remove('active');
    }
  }

  async function loadItems() {
    const user = AuthModule.getCurrentUser();
    if (!user) return;

    try {
      const snapshot = await window.firebaseDb
        .collection('checklists')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      checklistItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      renderItems();
      updateCount();
    } catch (error) {
      console.error('Error loading checklist items:', error);
      showNotification('Failed to load checklist', 'error');
    }
  }

  function renderItems() {
    const container = document.getElementById('checklist-items');
    if (!container) return;

    let filteredItems = checklistItems;
    if (currentFilter === 'active') {
      filteredItems = checklistItems.filter(item => !item.completed);
    } else if (currentFilter === 'completed') {
      filteredItems = checklistItems.filter(item => item.completed);
    }

    if (filteredItems.length === 0) {
      const emptyMessage = currentFilter === 'all' 
        ? 'No tasks yet. Add one above!' 
        : currentFilter === 'active' 
          ? 'No active tasks. Well done!' 
          : 'No completed tasks yet.';
      
      container.innerHTML = `
        <div class="checklist-empty">
          <i class="fas fa-check-circle"></i>
          <p>${emptyMessage}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredItems.map(item => `
      <div class="checklist-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
        <label class="checklist-checkbox">
          <input type="checkbox" ${item.completed ? 'checked' : ''}>
          <span class="checkmark"><i class="fas fa-check"></i></span>
        </label>
        <span class="checklist-item-text">${escapeHtml(item.text)}</span>
        <button class="checklist-item-delete" aria-label="Delete task">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.checklist-item').forEach(itemEl => {
      const id = itemEl.dataset.id;
      
      const checkbox = itemEl.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.addEventListener('change', () => toggleItem(id));
      }
      
      const deleteBtn = itemEl.querySelector('.checklist-item-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteItem(id));
      }
    });
  }

  async function addItem() {
    const user = AuthModule.getCurrentUser();
    if (!user) return;

    const input = document.getElementById('checklist-new-item');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.disabled = true;

    try {
      const docRef = await window.firebaseDb.collection('checklists').add({
        userId: user.uid,
        text: text,
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      checklistItems.unshift({
        id: docRef.id,
        text: text,
        completed: false,
        createdAt: new Date()
      });

      input.value = '';
      renderItems();
      updateCount();
    } catch (error) {
      console.error('Error adding checklist item:', error);
      showNotification('Failed to add task', 'error');
    } finally {
      input.disabled = false;
      input.focus();
    }
  }

  async function toggleItem(id) {
    const item = checklistItems.find(i => i.id === id);
    if (!item) return;

    const newCompleted = !item.completed;

    try {
      await window.firebaseDb.collection('checklists').doc(id).update({
        completed: newCompleted
      });

      item.completed = newCompleted;
      renderItems();
      updateCount();
    } catch (error) {
      console.error('Error toggling checklist item:', error);
      showNotification('Failed to update task', 'error');
    }
  }

  async function deleteItem(id) {
    try {
      await window.firebaseDb.collection('checklists').doc(id).delete();
      checklistItems = checklistItems.filter(i => i.id !== id);
      renderItems();
      updateCount();
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      showNotification('Failed to delete task', 'error');
    }
  }

  async function clearCompleted() {
    const user = AuthModule.getCurrentUser();
    if (!user) return;

    const completedItems = checklistItems.filter(i => i.completed);
    if (completedItems.length === 0) return;

    try {
      const batch = window.firebaseDb.batch();
      completedItems.forEach(item => {
        batch.delete(window.firebaseDb.collection('checklists').doc(item.id));
      });
      await batch.commit();

      checklistItems = checklistItems.filter(i => !i.completed);
      renderItems();
      updateCount();
      showNotification('Completed tasks cleared', 'success');
    } catch (error) {
      console.error('Error clearing completed items:', error);
      showNotification('Failed to clear tasks', 'error');
    }
  }

  function updateCount() {
    const countEl = document.getElementById('checklist-count');
    if (!countEl) return;

    const activeCount = checklistItems.filter(i => !i.completed).length;
    const totalCount = checklistItems.length;
    countEl.textContent = `${activeCount} active / ${totalCount} total`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showNotification(message, type = 'info') {
    if (AuthModule && AuthModule.showNotification) {
      AuthModule.showNotification(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  }

  return {
    init,
    show,
    hide
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.firebaseAuth) {
    ChecklistModule.init();
  }
});
