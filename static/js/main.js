/**
 * Dayner D&D Lore Website - Main JavaScript
 * Consolidated, simplified version for static hosting
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION
  // ========================================
  const LORE_BASE_PATH = 'Lore/DND/';
  
  const CALENDAR_EVENTS = {
    '1225-02-09': 'Calendar/1225-02-09.md',
    '1225-02-10': 'Calendar/1225-02-10.md',
    '1225-02-11': 'Calendar/1225-02-11.md',
    '1225-02-12': 'Calendar/1225-02-12.md',
    '1225-02-13': 'Calendar/1225-02-13.md',
    '1225-02-14': 'Calendar/1225-02-14.md',
    '1225-02-15': 'Calendar/1225-02-15.md',
    '1225-02-16': 'Calendar/1225-02-16.md',
    '1225-02-17': 'Calendar/1225-02-17.md',
    '1225-02-18': 'Calendar/1225-02-18.md',
    '1225-02-19': 'Calendar/1225-02-19.md',
    '1225-02-20': 'Calendar/1225-02-20.md',
    '1225-02-21': 'Calendar/1225-02-21.md'
  };

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function extractTitle(path) {
    const filename = path.split(/[\/\\]/).pop();
    return filename.replace(/\.md$/, '').replace(/_/g, ' ').replace(/-/g, ' ');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========================================
  // DOM ELEMENTS
  // ========================================
  let sidebar, overlay, contentArea, breadcrumb, loading, searchInput, searchResults;

  function initElements() {
    sidebar = document.getElementById('sidebar');
    overlay = document.getElementById('sidebar-overlay');
    contentArea = document.getElementById('content-area');
    breadcrumb = document.getElementById('breadcrumb');
    loading = document.getElementById('loading');
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
  }

  // ========================================
  // THEME MANAGEMENT
  // ========================================
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // ========================================
  // SIDEBAR / NAVIGATION
  // ========================================
  let sidebarOpen = false;

  function initNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleSidebar);
    }

    // Overlay click closes sidebar
    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    // Escape key closes sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebarOpen) closeSidebar();
    });

    // Sidebar collapse button
    const collapseBtn = document.querySelector('.sidebar-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', toggleCollapse);
    }

    // Logo/title clicks go home
    const logo = document.querySelector('.sidebar-logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
      });
    }

    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
      headerTitle.addEventListener('click', showHome);
    }

    // Bind submenu toggles
    bindSubmenus();

    // Bind navigation items
    bindNavItems();
  }

  function bindSubmenus() {
    const submenus = document.querySelectorAll('.nav-item.has-submenu');
    
    submenus.forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Find the next sibling submenu
        let submenu = this.nextElementSibling;
        while (submenu && !submenu.classList.contains('submenu')) {
          submenu = submenu.nextElementSibling;
        }
        
        if (submenu) {
          const isOpen = this.classList.contains('open');
          this.classList.toggle('open', !isOpen);
          submenu.classList.toggle('open', !isOpen);
        }
      });
    });
  }

  function bindNavItems() {
    const navItems = document.querySelectorAll('.nav-item[data-file]');
    
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Remove active from all
        document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));
        
        // Add active to this
        this.classList.add('active');
        
        // Load content
        const file = this.dataset.file;
        if (file) {
          loadContent(file);
        }

        // Close sidebar on mobile
        if (window.innerWidth <= 991) {
          closeSidebar();
        }
      });
    });
    
    // Bind the calendar nav link
    const calendarNav = document.getElementById('calendar-nav');
    if (calendarNav) {
      calendarNav.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Remove active from all nav items
        document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));
        
        // Add active to this
        this.classList.add('active');
        
        // Show calendar view
        showCalendarView();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 991) {
          closeSidebar();
        }
      });
    }
  }

  function toggleSidebar() {
    sidebarOpen ? closeSidebar() : openSidebar();
  }

  function openSidebar() {
    sidebarOpen = true;
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebarOpen = false;
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function toggleCollapse() {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', document.body.classList.contains('sidebar-collapsed'));
  }

  // ========================================
  // CONTENT LOADING
  // ========================================
  async function loadContent(filePath) {
    showLoading();
    hideSearchResults();

    try {
      const response = await fetch(LORE_BASE_PATH + filePath);
      
      if (!response.ok) {
        throw new Error('File not found: ' + filePath);
      }
      
      const mdText = await response.text();
      
      // DEBUG: Check if markdown contains image
      const hasImageMd = mdText.includes('![');
      console.log('DEBUG: Markdown has image syntax:', hasImageMd);
      if (hasImageMd) {
        const imgMatch = mdText.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        console.log('DEBUG: Image match:', imgMatch);
      }
      
      const html = marked.parse(mdText);
      
      // DEBUG: Check if HTML contains img tag
      const hasImgTag = html.includes('<img');
      console.log('DEBUG: HTML has img tag:', hasImgTag);
      if (hasImgTag) {
        const imgTagMatch = html.match(/<img[^>]+>/);
        console.log('DEBUG: Img tag:', imgTagMatch);
      }
      
      const title = extractTitle(filePath);
      
      renderContent(html, title, filePath);
      updateBreadcrumb(filePath);
      
    } catch (error) {
      console.error('Error loading content:', error);
      showError('Content not found', 'The requested lore entry could not be loaded: ' + filePath);
    }

    hideLoading();
  }

  function renderContent(html, title, filePath) {
    const icon = getIconForPath(filePath);
    
    // Auto-link known terms (characters, places) in the content
    const linkedHtml = autoLinkTerms(html, filePath);
    
    contentArea.innerHTML = `
      <div class="content-card">
        <h1><i class="fas ${icon}"></i> ${escapeHtml(title)}</h1>
        <div class="lore-content">${linkedHtml}</div>
      </div>
    `;
    
    contentArea.scrollTop = 0;
    
    // Set up click handlers for cross-reference links
    setupContentLinks(filePath);
  }

  // Build a dictionary of linkable terms from the search index
  function getLinkableTerms() {
    const terms = {};
    
    // Use the search index which has all file paths
    searchIndex.forEach(item => {
      if (item.type === 'file' && item.path) {
        // Extract the filename without extension as a term
        const filename = item.path.split('/').pop().replace('.md', '');
        // Skip very short names or generic files
        if (filename.length > 2 && !['DND', 'README', 'index'].includes(filename)) {
          terms[filename.toLowerCase()] = {
            name: filename,
            path: item.path,
            title: item.title
          };
        }
      }
    });
    
    return terms;
  }

  // Auto-link known terms in HTML content
  function autoLinkTerms(html, currentFilePath) {
    const terms = getLinkableTerms();
    const termKeys = Object.keys(terms).sort((a, b) => b.length - a.length); // Longer terms first
    
    if (termKeys.length === 0) return html;
    
    // Don't process if we're still loading the index
    const currentFileName = currentFilePath.split('/').pop().replace('.md', '').toLowerCase();
    
    // Create a temporary element to work with
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Process text nodes only (not inside links, headings, or code)
    const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        const parent = node.parentNode;
        const parentTag = parent.tagName?.toLowerCase();
        // Skip if inside a link, heading, code, or script
        if (['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'script', 'style'].includes(parentTag)) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip if already inside an auto-link
        if (parent.classList?.contains('auto-link')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    
    // Process each text node
    textNodes.forEach(textNode => {
      let text = textNode.nodeValue;
      let hasMatch = false;
      
      // Check each term
      for (const termKey of termKeys) {
        const term = terms[termKey];
        // Don't link to the current page
        if (termKey === currentFileName) continue;
        
        // Create regex that matches whole words only (case insensitive)
        const regex = new RegExp(`\\b(${escapeRegExp(term.name)})\\b`, 'gi');
        
        // Properly escape path and title for HTML attributes
        const escapedPath = term.path.replace(/"/g, '&quot;');
        const escapedTitle = (term.title || term.name).replace(/"/g, '&quot;');
        const replacement = `<a href="#" class="auto-link" data-path="${escapedPath}" title="${escapedTitle}">$1</a>`;
        
        const newText = text.replace(regex, replacement);
        if (newText !== text) {
          hasMatch = true;
          text = newText;
        }
      }
      
      if (hasMatch) {
        const span = document.createElement('span');
        span.innerHTML = text;
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
    
    return temp.innerHTML;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Handle clicks on markdown links within content
  function setupContentLinks(currentFilePath) {
    const contentLinks = contentArea.querySelectorAll('.lore-content a');
    
    contentLinks.forEach(link => {
      const href = link.getAttribute('href');
      const dataPath = link.dataset.path;
      
      // Handle auto-linked terms
      if (link.classList.contains('auto-link') && dataPath) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          loadContent(dataPath);
        });
        return;
      }
      
      // Only handle internal .md links
      if (href && href.endsWith('.md')) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Convert relative path to path relative to LORE_BASE_PATH
          const resolvedPath = resolveRelativePath(currentFilePath, href);
          loadContent(resolvedPath);
        });
        
        // Add visual styling for internal links
        link.classList.add('internal-link');
      }
    });
  }

  // Resolve a relative path from the current file's location
  function resolveRelativePath(currentFilePath, relativePath) {
    // Decode URL-encoded characters (spaces, etc.)
    relativePath = decodeURIComponent(relativePath);
    
    // Get the directory of the current file
    const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/') + 1);
    
    // Split both paths
    let baseParts = currentDir.split('/').filter(p => p);
    const relativeParts = relativePath.split('/');
    
    // Process each part of the relative path
    for (const part of relativeParts) {
      if (part === '..') {
        // Go up one directory
        baseParts.pop();
      } else if (part !== '.' && part !== '') {
        // Add the part to the path
        baseParts.push(part);
      }
    }
    
    return baseParts.join('/');
  }

  function getIconForPath(path) {
    const p = path.toLowerCase();
    if (p.includes('character')) return 'fa-user';
    if (p.includes('kingdom') || p.includes('braewood') || p.includes('islefield') || p.includes('kluimont') || p.includes('lavalto')) return 'fa-chess-rook';
    if (p.includes('calendar')) return 'fa-calendar-day';
    if (p.includes('history')) return 'fa-landmark';
    if (p.includes('politic')) return 'fa-balance-scale';
    if (p.includes('geography')) return 'fa-mountain';
    if (p.includes('population')) return 'fa-users';
    if (p.includes('wealth')) return 'fa-coins';
    return 'fa-scroll';
  }

  function showHome() {
    hideSearchResults();
    document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));

    contentArea.innerHTML = `
      <div class="map-container">
        <img src="map.jpg" alt="Map of Dayner" class="map-image" onerror="this.style.display='none'">
        <div class="map-overlay">
          <h3><i class="fas fa-globe"></i> The World of Dayner</h3>
          <p>A realm of ancient kingdoms, epic battles, and untold adventures.</p>
        </div>
      </div>

      <div class="content-card">
        <h1><i class="fas fa-dragon"></i> Welcome to Dayner</h1>
        <p>Welcome to the comprehensive lore compendium of Dayner. Navigate through the categories using the sidebar on the left.</p>
        
        <h2><i class="fas fa-compass"></i> Where to Start</h2>
        <div class="info-grid">
          <div class="feature-card" data-action="load-file" data-file="Character Lore/Modern Characters/Queen Maera Braeden.md">
            <div class="icon"><i class="fas fa-crown"></i></div>
            <h3>Queen Maera Braeden</h3>
            <p>Meet the Queen of Braewood</p>
          </div>
          <div class="feature-card" data-action="load-file" data-file="General Lore of Dayner/Population.md">
            <div class="icon"><i class="fas fa-users"></i></div>
            <h3>Population</h3>
            <p>The peoples and races of Dayner</p>
          </div>
          <div class="feature-card" data-action="load-file" data-file="Kingdoms/Braewood/Braewood.md">
            <div class="icon"><i class="fas fa-chess-rook"></i></div>
            <h3>Braewood</h3>
            <p>Explore the kingdom of Braewood</p>
          </div>
          <div class="feature-card" data-action="calendar">
            <div class="icon"><i class="fas fa-calendar-alt"></i></div>
            <h3>Campaign Calendar</h3>
            <p>Track your adventures through time</p>
          </div>
        </div>
      </div>
    `;

    // Bind feature card clicks
    bindFeatureCards();
    
    updateBreadcrumb(null);
  }
  
  function bindFeatureCards() {
    document.querySelectorAll('.feature-card[data-action]').forEach(card => {
      card.addEventListener('click', function() {
        const action = this.dataset.action;
        
        // Add click animation
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
        
        if (action === 'calendar') {
          showCalendarView();
        } else if (action === 'expand-menu') {
          const menuName = this.dataset.menu;
          scrollToSidebarMenu(menuName);
        } else if (action === 'load-file') {
          const file = this.dataset.file;
          loadContent(file);
        }
      });
    });
  }
  
  function scrollToSidebarMenu(menuName) {
    // Find the matching sidebar menu and scroll to it with highlight
    const sidebar = document.getElementById('sidebar');
    const menuItems = sidebar.querySelectorAll('.nav-item.has-submenu');
    
    menuItems.forEach(item => {
      const textEl = item.querySelector('.menu-text');
      if (!textEl) return;
      
      const text = textEl.textContent.trim();
      if (text === menuName) {
        // Find the next sibling submenu and expand it
        let submenu = item.nextElementSibling;
        while (submenu && !submenu.classList.contains('submenu')) {
          submenu = submenu.nextElementSibling;
        }
        
        if (submenu && !item.classList.contains('open')) {
          item.classList.add('open');
          submenu.classList.add('open');
        }
        
        // Scroll sidebar to show this menu
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        // Add highlight animation
        item.classList.add('highlight-pulse');
        setTimeout(() => item.classList.remove('highlight-pulse'), 1500);
      }
    });
  }

  function updateBreadcrumb(filePath) {
    let html = `
      <div class="breadcrumb-item">
        <a href="#" onclick="showHome(); return false;">
          <i class="fas fa-home"></i> Home
        </a>
      </div>
    `;

    if (filePath) {
      const parts = filePath.replace(/\.md$/, '').split(/[\/\\]/);
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const displayName = part.replace(/_/g, ' ');
        
        if (isLast) {
          html += `<div class="breadcrumb-item active">${escapeHtml(displayName)}</div>`;
        } else {
          html += `<div class="breadcrumb-item"><span>${escapeHtml(displayName)}</span></div>`;
        }
      });
    }

    breadcrumb.innerHTML = html;
  }

  function showLoading() {
    if (loading) loading.classList.add('visible');
    if (contentArea) contentArea.style.opacity = '0.5';
  }

  function hideLoading() {
    if (loading) loading.classList.remove('visible');
    if (contentArea) contentArea.style.opacity = '1';
  }

  function showError(title, message) {
    contentArea.innerHTML = `
      <div class="content-card">
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(message)}</p>
          <button class="btn btn-primary" onclick="showHome()">
            <i class="fas fa-home"></i> Return Home
          </button>
        </div>
      </div>
    `;
  }

  // ========================================
  // SEARCH (Full-text)
  // ========================================
  let searchIndex = [];
  let searchIndexBuilt = false;
  let searchIndexBuilding = false;

  function initSearch() {
    if (!searchInput) return;

    // Build basic index from DOM first (fast)
    buildBasicSearchIndex();
    
    // Build full-text index in background
    buildFullTextSearchIndex();

    // Search on input
    searchInput.addEventListener('input', debounce(function() {
      performSearch(this.value.trim());
    }, 300));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        hideSearchResults();
        searchInput.blur();
      }
    });
  }

  function buildBasicSearchIndex() {
    const navItems = document.querySelectorAll('.nav-item[data-file]');
    navItems.forEach(item => {
      const file = item.dataset.file;
      const title = item.querySelector('.menu-text')?.textContent || item.textContent.trim();
      searchIndex.push({ 
        title, 
        path: file, 
        content: '', 
        type: 'file',
        settlement: null 
      });
    });
  }

  async function buildFullTextSearchIndex() {
    if (searchIndexBuilding || searchIndexBuilt) return;
    searchIndexBuilding = true;
    
    // Fetch content for each indexed file
    for (let i = 0; i < searchIndex.length; i++) {
      const item = searchIndex[i];
      try {
        const response = await fetch(LORE_BASE_PATH + item.path);
        if (response.ok) {
          const text = await response.text();
          // Store plain text content (strip markdown syntax for better search)
          searchIndex[i].content = stripMarkdown(text).toLowerCase();
        }
      } catch (e) {
        // Silently continue on fetch errors
      }
    }
    
    // Also index map settlements for "search navigates to map" feature
    if (window.MapModule && typeof MapModule.getAllSettlements === 'function') {
      const settlements = MapModule.getAllSettlements();
      settlements.forEach(s => {
        searchIndex.push({
          title: s.name,
          path: s.file || '',
          content: `${s.name} ${s.type} ${s.kingdom} ${s.description || ''}`.toLowerCase(),
          type: 'settlement',
          settlement: s
        });
      });
    }
    
    searchIndexBuilt = true;
    searchIndexBuilding = false;
    console.log('Full-text search index built with', searchIndex.length, 'items');
  }

  function stripMarkdown(text) {
    return text
      .replace(/#+\s*/g, '') // Headers
      .replace(/\*\*|__/g, '') // Bold
      .replace(/\*|_/g, '') // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/`[^`]+`/g, '') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/>\s*/g, '') // Blockquotes
      .replace(/[-*+]\s+/g, '') // List items
      .replace(/\d+\.\s+/g, ''); // Numbered lists
  }

  function performSearch(query) {
    if (query.length < 2) {
      hideSearchResults();
      return;
    }

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
    
    const results = searchIndex
      .map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const pathLower = item.path.toLowerCase();
        
        // Title exact match (highest priority)
        if (titleLower === queryLower) score += 100;
        // Title contains query
        else if (titleLower.includes(queryLower)) score += 50;
        // Title contains query words
        else {
          queryWords.forEach(word => {
            if (titleLower.includes(word)) score += 20;
          });
        }
        
        // Path match
        if (pathLower.includes(queryLower)) score += 10;
        
        // Content match (full-text search)
        if (item.content) {
          if (item.content.includes(queryLower)) {
            score += 30;
          } else {
            queryWords.forEach(word => {
              if (item.content.includes(word)) score += 5;
            });
          }
        }
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    displaySearchResults(results, query);
  }

  function displaySearchResults(results, query) {
    const resultsList = document.getElementById('results-list');
    if (!resultsList || !searchResults) return;

    if (results.length === 0) {
      resultsList.innerHTML = `<div class="result-item"><p class="text-muted">No results found for "${escapeHtml(query)}"</p></div>`;
    } else {
      resultsList.innerHTML = results.map(r => {
        const typeIcon = r.type === 'settlement' 
          ? '<i class="fas fa-map-marker-alt" style="color: var(--color-gold);"></i>' 
          : '<i class="fas fa-file-alt"></i>';
        const typeLabel = r.type === 'settlement' ? 'Map Location' : r.path;
        const snippet = r.content ? getSearchSnippet(r.content, query) : '';
        
        return `
          <div class="result-item" data-path="${escapeHtml(r.path)}" data-type="${r.type}" ${r.type === 'settlement' ? `data-settlement="${escapeHtml(r.title)}"` : ''}>
            <div class="result-header">
              ${typeIcon}
              <h3>${highlightQuery(r.title, query)}</h3>
            </div>
            <div class="result-path">${typeLabel}</div>
            ${snippet ? `<div class="result-snippet">${snippet}</div>` : ''}
          </div>
        `;
      }).join('');

      // Bind clicks
      resultsList.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
          const type = item.dataset.type;
          const path = item.dataset.path;
          const settlementName = item.dataset.settlement;
          
          if (type === 'settlement' && settlementName) {
            // Navigate to map and focus on settlement
            navigateToMapSettlement(settlementName);
          } else if (path) {
            loadContent(path);
          }
          
          hideSearchResults();
          searchInput.value = '';
        });
      });
    }

    searchResults.classList.add('visible');
  }

  function getSearchSnippet(content, query) {
    const queryLower = query.toLowerCase();
    const index = content.indexOf(queryLower);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 40);
    const end = Math.min(content.length, index + query.length + 60);
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return highlightQuery(snippet, query);
  }

  function highlightQuery(text, query) {
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  function navigateToMapSettlement(settlementName) {
    // Navigate to map page
    window.location.href = 'map.html?settlement=' + encodeURIComponent(settlementName);
  }

  function hideSearchResults() {
    if (searchResults) searchResults.classList.remove('visible');
  }

  // ========================================
  // CALENDAR
  // ========================================
  let calendarState = { year: 1225, month: 1, day: 14 };

  function renderCalendar(containerId, year, month, selectedDay) {
    const container = document.getElementById(containerId);
    if (!container) return;

    calendarState = { year, month, day: selectedDay };

    const firstOfMonth = new Date(year, month, 1);
    const startDow = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let html = `
      <div class="calendar-nav">
        <button class="calendar-nav-btn" onclick="calendarPrev('${containerId}')"><i class="fas fa-chevron-left"></i></button>
        <span class="calendar-month-year">${MONTHS[month]} ${year}</span>
        <button class="calendar-nav-btn" onclick="calendarNext('${containerId}')"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="calendar">
    `;

    // Day headers
    DAYS.forEach(d => { html += `<div class="cal-dow">${d}</div>`; });

    // Previous month days
    for (let i = 0; i < startDow; i++) {
      const day = prevMonthDays - startDow + 1 + i;
      html += `<div class="cal-day other-month">${day}</div>`;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = CALENDAR_EVENTS[dateKey];
      const isSelected = day === selectedDay;
      
      let classes = 'cal-day';
      if (isSelected) classes += ' selected';
      if (hasEvent) classes += ' clickable has-event';
      
      html += `<div class="${classes}" data-date="${dateKey}">${day}</div>`;
    }

    // Fill remaining
    const totalCells = startDow + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="cal-day other-month">${i}</div>`;
    }

    html += '</div>';
    container.innerHTML = html;

    // Bind clicks on event days
    container.querySelectorAll('.cal-day.clickable').forEach(dayEl => {
      dayEl.addEventListener('click', function() {
        // Add click animation
        this.classList.add('clicked');
        
        const dateKey = this.dataset.date;
        if (CALENDAR_EVENTS[dateKey]) {
          // Small delay for animation
          setTimeout(() => {
            loadCalendarContent(CALENDAR_EVENTS[dateKey]);
          }, 150);
        }
      });
    });
  }

  // Load calendar content with back navigation
  async function loadCalendarContent(filePath) {
    showLoading();
    hideSearchResults();

    try {
      const response = await fetch(LORE_BASE_PATH + filePath);
      
      if (!response.ok) {
        throw new Error('File not found: ' + filePath);
      }
      
      const mdText = await response.text();
      const html = marked.parse(mdText);
      const title = extractTitle(filePath);
      
      // Render with back to calendar button
      contentArea.innerHTML = `
        <div class="content-card">
          <div class="content-nav">
            <button class="btn btn-secondary" onclick="showCalendarView()">
              <i class="fas fa-arrow-left"></i> Back to Calendar
            </button>
          </div>
          <h1><i class="fas fa-calendar-day"></i> ${escapeHtml(title)}</h1>
          <div class="lore-content">${html}</div>
        </div>
      `;
      
      updateBreadcrumb(filePath);
      
    } catch (error) {
      console.error('Error loading content:', error);
      showError('Content not found', 'The requested calendar entry could not be loaded: ' + filePath);
    }

    hideLoading();
  }

  // Global calendar navigation functions
  window.calendarPrev = function(containerId) {
    calendarState.month--;
    if (calendarState.month < 0) {
      calendarState.month = 11;
      calendarState.year--;
    }
    renderCalendar(containerId, calendarState.year, calendarState.month, 1);
  };

  window.calendarNext = function(containerId) {
    calendarState.month++;
    if (calendarState.month > 11) {
      calendarState.month = 0;
      calendarState.year++;
    }
    renderCalendar(containerId, calendarState.year, calendarState.month, 1);
  };

  window.showCalendarView = function() {
    hideSearchResults();
    document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));

    contentArea.innerHTML = `
      <div class="calendar-card">
        <h2><i class="fas fa-calendar-alt"></i> Campaign Calendar</h2>
        <div id="main-calendar"></div>
        <p class="calendar-hint"><i class="fas fa-info-circle"></i> Click a highlighted date to view that day's session log.</p>
      </div>
    `;

    renderCalendar('main-calendar', 1225, 1, 21);
    updateBreadcrumb('Calendar');
  };

  // ========================================
  // GLOBAL EXPORTS
  // ========================================
  window.showHome = showHome;
  window.loadContent = loadContent;

  // ========================================
  // BACKGROUND MUSIC PLAYER
  // ========================================
  function initBackgroundMusic() {
    const audio = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('music-toggle');
    const nextBtn = document.getElementById('music-next');
    const volumeSlider = document.getElementById('music-volume');
    const trackName = document.getElementById('music-track-name');
    const minimizeBtn = document.getElementById('music-minimize');
    const musicPlayer = document.getElementById('music-player');

    if (!audio || !toggleBtn) {
      console.log('Music player elements not found');
      return;
    }

    // Track list - update these paths to match your files
    const tracks = [
      'static/audio/Lorien Testard - Clair Obscur- Expedition 33 (Original Soundtrack) - 129 Lettre à Maelle.mp3',
      'static/audio/Lorien Testard - Clair Obscur- Expedition 33 (Original Soundtrack) - 140 Lumière\'s Opera - Nuit sur Lumière.mp3',
      'static/audio/Lorien Testard - Clair Obscur- Expedition 33 (Original Soundtrack) - 92 World Map - Gustave\'s Legacy.mp3',
      'static/audio/Lorien Testard and Alice Duport-Percier - Clair Obscur- Expedition 33 (Original Soundtrack) - 47 Sciel.mp3',
      'static/audio/Lorien Testard and Alice Duport-Percier - Clair Obscur- Expedition 33 (Original Soundtrack) - 68 Lost Voice.mp3'
    ];

    let currentTrack = parseInt(localStorage.getItem('musicTrack')) || 0;
    let isPlaying = false;

    // Load saved preferences
    const savedVolume = localStorage.getItem('musicVolume');
    const savedMinimized = localStorage.getItem('musicMinimized');
    
    if (savedVolume !== null) {
      audio.volume = parseFloat(savedVolume);
      volumeSlider.value = parseFloat(savedVolume) * 100;
    } else {
      audio.volume = 0.3;
    }

    if (savedMinimized === 'true') {
      musicPlayer.classList.add('minimized');
      minimizeBtn.querySelector('i').classList.replace('fa-chevron-right', 'fa-chevron-left');
    }

    // Extract short track name for display
    function getShortName(path) {
      const filename = path.split('/').pop();
      // Extract the descriptive part after the number
      const match = filename.match(/- \d+ (.+)\.mp3$/i);
      if (match) return match[1];
      return filename.replace('.mp3', '').substring(0, 25) + '...';
    }

    function loadTrack(index) {
      currentTrack = index % tracks.length;
      audio.src = tracks[currentTrack];
      trackName.textContent = getShortName(tracks[currentTrack]);
      localStorage.setItem('musicTrack', currentTrack);
    }

    function play() {
      audio.play().then(() => {
        isPlaying = true;
        toggleBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        toggleBtn.classList.add('playing');
      }).catch(err => {
        console.log('Playback failed:', err);
        trackName.textContent = 'Click to play';
      });
    }

    function pause() {
      audio.pause();
      isPlaying = false;
      toggleBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
      toggleBtn.classList.remove('playing');
    }

    function nextTrack() {
      loadTrack(currentTrack + 1);
      if (isPlaying) play();
    }

    // Event listeners
    toggleBtn.addEventListener('click', () => {
      if (!audio.src || audio.src === '') {
        loadTrack(currentTrack);
      }
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    });

    nextBtn.addEventListener('click', nextTrack);

    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      audio.volume = volume;
      localStorage.setItem('musicVolume', volume);
    });

    minimizeBtn.addEventListener('click', () => {
      musicPlayer.classList.toggle('minimized');
      const isMinimized = musicPlayer.classList.contains('minimized');
      minimizeBtn.querySelector('i').classList.toggle('fa-chevron-right', !isMinimized);
      minimizeBtn.querySelector('i').classList.toggle('fa-chevron-left', isMinimized);
      localStorage.setItem('musicMinimized', isMinimized);
    });

    // Auto-play next track when current ends
    audio.addEventListener('ended', () => {
      nextTrack();
      play();
    });

    // Load initial track (but don't auto-play due to browser restrictions)
    loadTrack(currentTrack);

    console.log('🎵 Background music player initialized');
  }

  // ========================================
  // INTRO VIDEO
  // ========================================
  function initIntroVideo() {
    const overlay = document.getElementById('intro-overlay');
    const video = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');
    
    if (!overlay || !video) {
      console.log('No intro video elements found');
      return;
    }

    // Check if user has seen intro recently (session-based)
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      overlay.classList.add('hidden');
      return;
    }

    function dismissIntro() {
      overlay.classList.add('fade-out');
      sessionStorage.setItem('hasSeenIntro', 'true');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 800);
    }

    // When video ends, fade out
    video.addEventListener('ended', dismissIntro);

    // Skip button
    if (skipBtn) {
      skipBtn.addEventListener('click', dismissIntro);
    }

    // Also allow clicking anywhere to skip
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === video) {
        dismissIntro();
      }
    });

    // Fallback: if video fails to load or errors out
    video.addEventListener('error', () => {
      console.log('Intro video failed to load, dismissing overlay');
      overlay.classList.add('hidden');
    });

    // Fallback: if video can't autoplay (browser policy), dismiss after timeout
    video.play().catch(() => {
      console.log('Video autoplay blocked, dismissing overlay after timeout');
      setTimeout(dismissIntro, 2000);
    });

    // Ultimate fallback: dismiss after 15 seconds regardless
    setTimeout(() => {
      if (!overlay.classList.contains('hidden') && !overlay.classList.contains('fade-out')) {
        console.log('Intro video timeout, dismissing overlay');
        dismissIntro();
      }
    }, 15000);

    console.log('🎬 Intro video initialized');
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  function init() {
    console.log('🐉 Initializing Dayner Lore Website...');
    
    initIntroVideo();
    initBackgroundMusic();
    initElements();
    initTheme();
    initNavigation();
    initSearch();
    
    // Check for file parameter in URL (from map navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    if (fileParam) {
      loadContent(fileParam);
      // Clean up URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      showHome();
    }

    console.log('✨ Dayner Lore Website ready!');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
