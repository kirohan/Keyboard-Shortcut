(() => {
  const apps = window.SHORTCUT_APPS || [];
  const PAGE_SIZE = 24;

  const el = {
    appGrid: document.getElementById('appGrid'),
    search: document.getElementById('searchInput'),
    categorySelect: document.getElementById('categorySelect'),
    professionSelect: document.getElementById('professionSelect'),
    favoritesToggle: document.getElementById('favoritesToggle'),
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    randomButton: document.getElementById('randomButton'),
    resultCount: document.getElementById('resultCount'),
    resultsTitle: document.getElementById('resultsTitle'),
    emptyState: document.getElementById('emptyState'),
    resetButton: document.getElementById('resetButton'),
    toast: document.getElementById('toast'),
    softwareStat: document.getElementById('softwareStat'),
    shortcutStat: document.getElementById('shortcutStat'),
    verifiedStat: document.getElementById('verifiedStat'),
    categoryStat: document.getElementById('categoryStat'),
    loadMoreWrap: document.getElementById('loadMoreWrap'),
    loadMoreButton: document.getElementById('loadMoreButton')
  };

  const savedPlatform = localStorage.getItem('shortcutHubPlatform');
  const state = {
    platform: savedPlatform === 'mac' ? 'mac' : 'windows',
    category: 'All',
    profession: 'All',
    status: 'all',
    query: '',
    favoritesOnly: false,
    favorites: new Set(JSON.parse(localStorage.getItem('shortcutHubFavorites') || '[]')),
    expandedApps: new Set(),
    displayLimit: PAGE_SIZE
  };

  const categories = ['All', ...new Set(apps.map(app => app.category).filter(Boolean))]
    .sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
  const professions = ['All', ...new Set(apps.flatMap(app => app.professions || []))]
    .sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));

  const logoAliases = {
    windows: 'windows11', macos: 'macos', chrome: 'googlechrome', vscode: 'visualstudiocode',
    photoshop: 'adobephotoshop', illustrator: 'adobeillustrator', indesign: 'adobeindesign',
    premiere: 'adobepremierepro', aftereffects: 'adobeaftereffects',
    'premiere-pro': 'adobepremierepro', 'after-effects': 'adobeaftereffects',
    'davinci-resolve': 'davinciresolve', capcut: 'capcut', autocad: 'autocad',
    'autodesk-revit': 'autodeskrevit', sketchup: 'sketchup', blender: 'blender',
    maya: 'autodeskmaya', unreal: 'unrealengine', unity: 'unity', godot: 'godotengine',
    figma: 'figma', canva: 'canva', github: 'github', slack: 'slack', discord: 'discord',
    notion: 'notion', obs: 'obsstudio', 'power-bi': 'powerbi', tableau: 'tableau',
    word: 'microsoftword', excel: 'microsoftexcel', powerpoint: 'microsoftpowerpoint',
    onenote: 'microsoftonenote', outlook: 'microsoftoutlook', teams: 'microsoftteams'
  };

  // Product-specific full-colour marks are intentionally preferred for suites whose
  // monochrome brand glyphs are easy to confuse (notably Microsoft 365 and Adobe CC).
  // Multiple candidates make the site resilient if one public icon endpoint changes.
  const logoUrlOverrides = {
    // Microsoft 365 — product-specific Microsoft domains first so icon refreshes can flow through.
    word: [
      'https://www.google.com/s2/favicons?domain_url=https://word.cloud.microsoft&sz=256',
      'https://api.iconify.design/logos/microsoft-word.svg'
    ],
    excel: [
      'https://www.google.com/s2/favicons?domain_url=https://excel.cloud.microsoft&sz=256',
      'https://api.iconify.design/logos/microsoft-excel.svg'
    ],
    powerpoint: [
      'https://www.google.com/s2/favicons?domain_url=https://powerpoint.cloud.microsoft&sz=256',
      'https://api.iconify.design/logos/microsoft-powerpoint.svg'
    ],
    onenote: [
      'https://www.google.com/s2/favicons?domain_url=https://www.onenote.com&sz=256',
      'https://api.iconify.design/logos/microsoft-onenote.svg'
    ],
    outlook: [
      'https://www.google.com/s2/favicons?domain_url=https://outlook.cloud.microsoft&sz=256',
      'https://api.iconify.design/logos/microsoft-outlook.svg'
    ],
    teams: [
      'https://www.google.com/s2/favicons?domain_url=https://teams.microsoft.com&sz=256',
      'https://api.iconify.design/logos/microsoft-teams.svg'
    ],
    'microsoft-loop': [
      'https://www.google.com/s2/favicons?domain_url=https://loop.cloud.microsoft&sz=256',
      'https://api.iconify.design/logos/microsoft-loop.svg'
    ],
    'microsoft-onedrive': [
      'https://api.iconify.design/logos/microsoft-onedrive.svg',
      'https://www.google.com/s2/favicons?domain_url=https://onedrive.live.com&sz=256'
    ],
    'microsoft-copilot': [
      'https://www.google.com/s2/favicons?domain_url=https://copilot.microsoft.com&sz=256',
      'https://api.iconify.design/logos/microsoft-copilot.svg'
    ],
    'power-bi': [
      'https://api.iconify.design/logos/microsoft-power-bi.svg',
      'https://www.google.com/s2/favicons?domain_url=https://app.powerbi.com&sz=256'
    ],
    'microsoft-publisher': [
      'https://api.iconify.design/logos/microsoft-publisher.svg',
      'https://api.iconify.design/simple-icons/microsoftpublisher.svg?color=%230771C5'
    ],
    'microsoft-visio': [
      'https://api.iconify.design/logos/microsoft-visio.svg',
      'https://api.iconify.design/simple-icons/microsoftvisio.svg?color=%233956A3'
    ],
    'microsoft-project': [
      'https://www.google.com/s2/favicons?domain_url=https://project.microsoft.com&sz=256',
      'https://api.iconify.design/logos/microsoft-project.svg'
    ],

    // Adobe Creative Cloud — full-colour, product-specific marks before monochrome fallbacks.
    photoshop: [
      'https://api.iconify.design/logos/adobe-photoshop.svg',
      'https://api.iconify.design/skill-icons/photoshop.svg'
    ],
    illustrator: [
      'https://api.iconify.design/logos/adobe-illustrator.svg',
      'https://api.iconify.design/skill-icons/illustrator.svg'
    ],
    indesign: [
      'https://api.iconify.design/logos/adobe-indesign.svg',
      'https://api.iconify.design/skill-icons/indesign.svg'
    ],
    premiere: [
      'https://api.iconify.design/logos/adobe-premiere.svg',
      'https://api.iconify.design/skill-icons/premiere.svg'
    ],
    aftereffects: [
      'https://api.iconify.design/logos/adobe-after-effects.svg',
      'https://api.iconify.design/skill-icons/aftereffects.svg'
    ],
    'adobe-audition': [
      'https://api.iconify.design/logos/adobe-audition.svg',
      'https://api.iconify.design/skill-icons/audition.svg'
    ],
    'adobe-lightroom': [
      'https://api.iconify.design/logos/adobe-lightroom.svg',
      'https://api.iconify.design/skill-icons/lightroom.svg'
    ],
    'lightroom-classic': [
      'https://api.iconify.design/logos/adobe-lightroom.svg',
      'https://api.iconify.design/skill-icons/lightroom.svg'
    ],
    'adobe-acrobat-pro': [
      'https://api.iconify.design/logos/adobe-acrobat.svg',
      'https://www.google.com/s2/favicons?domain_url=https://acrobat.adobe.com&sz=256'
    ],
    'adobe-acrobat-reader': [
      'https://api.iconify.design/logos/adobe-acrobat.svg',
      'https://www.google.com/s2/favicons?domain_url=https://acrobat.adobe.com&sz=256'
    ],
    'adobe-express': [
      'https://www.google.com/s2/favicons?domain_url=https://www.adobe.com/express&sz=256',
      'https://api.iconify.design/simple-icons/adobeexpress.svg?color=%23FF61F6'
    ],
    'adobe-animate': [
      'https://api.iconify.design/logos/adobe-animate.svg',
      'https://api.iconify.design/simple-icons/adobeanimate.svg?color=%239999FF'
    ],
    'adobe-media-encoder': [
      'https://api.iconify.design/simple-icons/adobemediaencoder.svg?color=%239999FF'
    ],
    'adobe-bridge': [
      'https://api.iconify.design/simple-icons/adobebridge.svg?color=%23FF9A00'
    ]
  };

  function escapeHTML(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('shortcutHubTheme', theme);
    el.themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#090d18' : '#f4f6fb');
  }

  const initialTheme = localStorage.getItem('shortcutHubTheme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(initialTheme);

  function appSupportsPlatform(app) {
    return app.platform === 'both' || app.platform === state.platform;
  }

  function shortcutId(appId, index) {
    return `${appId}:${index}`;
  }

  function getCombo(shortcut) {
    return shortcut[state.platform] || '';
  }

  function splitCombo(combo) {
    if (combo.includes(' → ')) return { parts: combo.split(' → '), separator: '→' };
    if (combo.includes(' + ')) return { parts: combo.split(' + '), separator: '+' };
    return { parts: [combo], separator: '' };
  }

  function renderKeyCombo(combo) {
    const { parts, separator } = splitCombo(combo);
    return parts.map((key, index) => {
      const sep = index < parts.length - 1
        ? `<span class="key-separator" aria-hidden="true">${separator}</span>`
        : '';
      return `<span class="keycap">${escapeHTML(key)}</span>${sep}`;
    }).join('');
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function appText(app) {
    return normalize([
      app.name,
      app.category,
      ...(app.professions || []),
      app.description
    ].join(' '));
  }

  function filteredApps() {
    const q = normalize(state.query);

    return apps
      .filter(app => appSupportsPlatform(app))
      .filter(app => state.category === 'All' || app.category === state.category)
      .filter(app => state.profession === 'All' || (app.professions || []).includes(state.profession))
      .filter(app => state.status === 'all' ||
        (state.status === 'verified' && (app.shortcuts || []).length > 0) ||
        (state.status === 'catalog' && (app.shortcuts || []).length === 0))
      .map(app => {
        const appMatches = !q || appText(app).includes(q);
        const visibleShortcuts = (app.shortcuts || [])
          .map((shortcut, index) => ({ ...shortcut, originalIndex: index }))
          .filter(shortcut => getCombo(shortcut))
          .filter(shortcut => {
            if (!q) return true;
            const text = normalize(`${shortcut.action} ${getCombo(shortcut)}`);
            return text.includes(q) || appMatches;
          })
          .filter(shortcut => !state.favoritesOnly || state.favorites.has(shortcutId(app.id, shortcut.originalIndex)));

        return { ...app, appMatches, visibleShortcuts };
      })
      .filter(app => {
        if (state.favoritesOnly) return app.visibleShortcuts.length > 0;
        if (!q) return true;
        return app.appMatches || app.visibleShortcuts.some(shortcut => {
          const text = normalize(`${shortcut.action} ${getCombo(shortcut)}`);
          return text.includes(q);
        });
      });
  }

  function populateSelect(select, values, label) {
    select.innerHTML = values.map(value =>
      `<option value="${escapeHTML(value)}">${value === 'All' ? `All ${label}` : escapeHTML(value)}</option>`
    ).join('');
  }

  function renderFilters() {
    populateSelect(el.categorySelect, categories, 'genres');
    populateSelect(el.professionSelect, professions, 'professions');
    el.categorySelect.value = state.category;
    el.professionSelect.value = state.profession;

    document.querySelectorAll('.platform-button').forEach(button => {
      button.classList.toggle('active', button.dataset.platform === state.platform);
    });
    document.querySelectorAll('.status-button').forEach(button => {
      button.classList.toggle('active', button.dataset.status === state.status);
    });
  }

  function logoSlugs(app) {
    const full = String(app.name || '').toLowerCase().replace(/\+/g, 'plus').replace(/#/g, 'sharp').replace(/[^a-z0-9]/g, '');
    const stripped = String(app.name || '')
      .replace(/^(Adobe|Microsoft|Google|Autodesk|Oracle|Apple|JetBrains|IBM|Cisco|Blackmagic|Avid|Chaos|Trimble|Bentley|Siemens|Altair|Corel)\s+/i, '')
      .toLowerCase().replace(/\+/g, 'plus').replace(/#/g, 'sharp').replace(/[^a-z0-9]/g, '');
    return [...new Set([logoAliases[app.id], app.logoSlug, full, stripped].filter(Boolean))];
  }

  function logoDomain(app) {
    if (app.logoDomain) return String(app.logoDomain).replace(/^www\./, '');
    try { return new URL(app.source).hostname.replace(/^www\./, ''); }
    catch { return ''; }
  }

  function hydrateLogos() {
    document.querySelectorAll('img[data-logo-app]').forEach(img => {
      const app = apps.find(item => item.id === img.dataset.logoApp);
      if (!app || img.dataset.hydrated === 'true') return;
      img.dataset.hydrated = 'true';

      const candidates = [
        ...(logoUrlOverrides[app.id] || []),
        ...logoSlugs(app).map(slug => `https://cdn.simpleicons.org/${encodeURIComponent(slug)}?viewbox=auto&size=64`)
      ];
      const domain = logoDomain(app);
      if (domain && !domain.includes(' ')) {
        candidates.push(`https://www.google.com/s2/favicons?domain_url=https://${encodeURIComponent(domain)}&sz=128`);
      }

      let index = 0;
      const fallback = img.parentElement.querySelector('.logo-fallback');
      const next = () => {
        if (index >= candidates.length) {
          img.hidden = true;
          if (fallback) fallback.hidden = false;
          return;
        }
        img.src = candidates[index++];
      };
      img.addEventListener('error', next);
      next();
    });
  }

  function cardHTML(app) {
    const verified = (app.shortcuts || []).length > 0;
    const shortcutsToRender = state.query || state.favoritesOnly || state.expandedApps.has(app.id)
      ? app.visibleShortcuts
      : app.visibleShortcuts.slice(0, 8);
    const officialLabel = verified ? 'Official ↗' : 'Official site ↗';
    const sourceLink = app.source
      ? `<a class="source-link" href="${escapeHTML(app.source)}" target="_blank" rel="noreferrer noopener" aria-label="Open ${escapeHTML(app.name)} official reference">${officialLabel}</a>`
      : '';

    return `
      <article class="app-card ${verified ? 'verified-card' : 'catalog-card'}" style="--app-accent:${escapeHTML(app.accent || '#64748b')}">
        <header class="app-card-header">
          <div class="app-identity">
            <div class="app-logo-box" aria-hidden="true">
              <img class="app-logo-img" data-logo-app="${escapeHTML(app.id)}" alt="" loading="lazy" decoding="async" />
              <span class="logo-fallback" hidden>${escapeHTML(app.icon || app.name.slice(0, 2))}</span>
            </div>
            <div>
              <div class="app-title-row">
                <h3 class="app-title">${escapeHTML(app.name)}</h3>
                ${app.popular ? '<span class="popular-badge">POPULAR</span>' : ''}
                <span class="status-badge ${verified ? 'status-verified' : 'status-catalog'}">${verified ? 'VERIFIED PACK' : 'CATALOG'}</span>
              </div>
              <p class="app-description">${escapeHTML(app.description || app.category)}</p>
              <p class="app-taxonomy">${escapeHTML(app.category)}${app.professions?.length ? ` · ${escapeHTML(app.professions.slice(0, 2).join(' / '))}` : ''}</p>
            </div>
          </div>
          ${sourceLink}
        </header>

        ${verified ? `
          <div class="shortcut-list">
            ${shortcutsToRender.map(shortcut => {
              const id = shortcutId(app.id, shortcut.originalIndex);
              const favorite = state.favorites.has(id);
              const combo = getCombo(shortcut);
              return `
                <div class="shortcut-row">
                  <div class="shortcut-action">${escapeHTML(shortcut.action)}</div>
                  <div class="key-combo" aria-label="${escapeHTML(combo)}">${renderKeyCombo(combo)}</div>
                  <div class="row-actions">
                    <button class="tiny-button ${favorite ? 'favorite' : ''}" type="button" data-favorite="${id}" title="${favorite ? 'Remove from favorites' : 'Add to favorites'}" aria-label="${favorite ? 'Remove from favorites' : 'Add to favorites'}">${favorite ? '★' : '☆'}</button>
                    <button class="tiny-button" type="button" data-copy="${escapeHTML(combo)}" data-action="${escapeHTML(shortcut.action)}" title="Copy shortcut" aria-label="Copy shortcut">⧉</button>
                  </div>
                </div>`;
            }).join('')}
            ${(!state.query && !state.favoritesOnly && app.visibleShortcuts.length > 8) ? `
              <button type="button" class="expand-app-button" data-expand-app="${escapeHTML(app.id)}">
                ${state.expandedApps.has(app.id) ? 'Show fewer' : `Show all ${app.visibleShortcuts.length} shortcuts`}
                <span aria-hidden="true">${state.expandedApps.has(app.id) ? '↑' : '↓'}</span>
              </button>` : ''}
          </div>` : `
          <div class="catalog-state">
            <div class="catalog-state-icon" aria-hidden="true">⌨</div>
            <div>
              <strong>Shortcut pack awaiting verification</strong>
              <p>This software is indexed so people can find it, but ShortcutHub will not publish guessed keybindings.</p>
              <button type="button" class="request-pack-button" data-request-pack="${escapeHTML(app.name)}">Copy contribution request</button>
            </div>
          </div>`}
      </article>`;
  }

  function resultsTitle() {
    if (state.favoritesOnly) return 'Your favorites';
    if (state.query) return `Results for “${state.query}”`;
    if (state.profession !== 'All') return state.profession;
    if (state.category !== 'All') return state.category;
    if (state.status === 'verified') return 'Verified shortcut packs';
    if (state.status === 'catalog') return 'Catalog awaiting shortcut packs';
    return 'All software';
  }

  function render() {
    const matches = filteredApps();
    const shown = matches.slice(0, state.displayLimit);
    const visibleShortcuts = matches.reduce((sum, app) => sum + app.visibleShortcuts.length, 0);
    const verifiedCount = matches.filter(app => (app.shortcuts || []).length > 0).length;

    el.resultsTitle.textContent = resultsTitle();
    el.resultCount.textContent = `${matches.length.toLocaleString()} software · ${visibleShortcuts.toLocaleString()} matching shortcuts · ${verifiedCount.toLocaleString()} verified packs`;
    el.emptyState.hidden = matches.length !== 0;
    el.appGrid.hidden = matches.length === 0;
    el.appGrid.innerHTML = shown.map(cardHTML).join('');

    const more = matches.length > shown.length;
    el.loadMoreWrap.hidden = !more;
    if (more) el.loadMoreButton.textContent = `Load ${Math.min(PAGE_SIZE, matches.length - shown.length)} more · ${matches.length - shown.length} remaining`;

    updateStats();
    hydrateLogos();
  }

  function updateStats() {
    const totalShortcuts = apps.reduce((sum, app) => sum + (app.shortcuts || []).length, 0);
    const verified = apps.filter(app => (app.shortcuts || []).length > 0).length;
    el.softwareStat.textContent = apps.length.toLocaleString();
    el.shortcutStat.textContent = totalShortcuts.toLocaleString();
    el.verifiedStat.textContent = verified.toLocaleString();
    el.categoryStat.textContent = new Set(apps.map(app => app.category)).size.toLocaleString();
  }

  function resetDisplayLimit() {
    state.displayLimit = PAGE_SIZE;
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => el.toast.classList.remove('show'), 1800);
  }

  async function copyText(text, success) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast(success);
  }

  function randomShortcut() {
    const pool = [];
    apps.filter(appSupportsPlatform).forEach(app => {
      (app.shortcuts || []).forEach(shortcut => {
        const combo = getCombo(shortcut);
        if (combo) pool.push({ app, shortcut, combo });
      });
    });
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.query = pick.app.name;
    state.category = 'All';
    state.profession = 'All';
    state.status = 'verified';
    state.favoritesOnly = false;
    resetDisplayLimit();
    el.search.value = pick.app.name;
    el.favoritesToggle.setAttribute('aria-pressed', 'false');
    renderFilters();
    render();
    document.querySelector('.results-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`${pick.app.name}: ${pick.combo}`);
  }

  function resetFilters() {
    state.category = 'All';
    state.profession = 'All';
    state.status = 'all';
    state.query = '';
    state.favoritesOnly = false;
    state.expandedApps.clear();
    resetDisplayLimit();
    el.search.value = '';
    el.favoritesToggle.setAttribute('aria-pressed', 'false');
    renderFilters();
    render();
  }

  document.querySelectorAll('.platform-button').forEach(button => {
    button.addEventListener('click', () => {
      state.platform = button.dataset.platform;
      localStorage.setItem('shortcutHubPlatform', state.platform);
      resetDisplayLimit();
      renderFilters();
      render();
    });
  });

  document.querySelectorAll('.status-button').forEach(button => {
    button.addEventListener('click', () => {
      state.status = button.dataset.status;
      resetDisplayLimit();
      renderFilters();
      render();
    });
  });

  el.search.addEventListener('input', event => {
    state.query = event.target.value.trim();
    resetDisplayLimit();
    render();
  });

  el.categorySelect.addEventListener('change', event => {
    state.category = event.target.value;
    resetDisplayLimit();
    render();
  });

  el.professionSelect.addEventListener('change', event => {
    state.profession = event.target.value;
    resetDisplayLimit();
    render();
  });

  el.appGrid.addEventListener('click', event => {
    const expandButton = event.target.closest('[data-expand-app]');
    if (expandButton) {
      const id = expandButton.dataset.expandApp;
      state.expandedApps.has(id) ? state.expandedApps.delete(id) : state.expandedApps.add(id);
      render();
      return;
    }

    const favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton) {
      const id = favoriteButton.dataset.favorite;
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      localStorage.setItem('shortcutHubFavorites', JSON.stringify([...state.favorites]));
      render();
      return;
    }

    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      copyText(`${copyButton.dataset.action} — ${copyButton.dataset.copy}`, `Copied: ${copyButton.dataset.copy}`);
      return;
    }

    const requestButton = event.target.closest('[data-request-pack]');
    if (requestButton) {
      const appName = requestButton.dataset.requestPack;
      copyText(
        `Shortcut pack request: ${appName}\n\nPlease add verified default keyboard shortcuts for ${appName}. Include Windows/macOS differences when applicable and cite the official documentation or vendor manual.`,
        `Contribution request copied for ${appName}`
      );
    }
  });

  el.favoritesToggle.addEventListener('click', () => {
    state.favoritesOnly = !state.favoritesOnly;
    el.favoritesToggle.setAttribute('aria-pressed', String(state.favoritesOnly));
    if (state.favoritesOnly) state.status = 'verified';
    resetDisplayLimit();
    renderFilters();
    render();
  });

  el.themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  el.randomButton.addEventListener('click', randomShortcut);
  el.resetButton.addEventListener('click', resetFilters);
  el.loadMoreButton.addEventListener('click', () => {
    state.displayLimit += PAGE_SIZE;
    render();
  });

  document.addEventListener('keydown', event => {
    const typing = event.target.matches('input, textarea, select, [contenteditable="true"]');
    if (event.key === '/' && !typing) {
      event.preventDefault();
      el.search.focus();
    }
    if (event.key === 'Escape' && document.activeElement === el.search) {
      el.search.value = '';
      state.query = '';
      el.search.blur();
      resetDisplayLimit();
      render();
    }
  });

  renderFilters();
  render();
})();
