(() => {
  const apps = window.SHORTCUT_APPS || [];
  const el = {
    appGrid: document.getElementById("appGrid"),
    search: document.getElementById("searchInput"),
    categories: document.getElementById("categoryFilters"),
    favoritesToggle: document.getElementById("favoritesToggle"),
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon"),
    randomButton: document.getElementById("randomButton"),
    resultCount: document.getElementById("resultCount"),
    resultsTitle: document.getElementById("resultsTitle"),
    emptyState: document.getElementById("emptyState"),
    resetButton: document.getElementById("resetButton"),
    toast: document.getElementById("toast"),
    softwareStat: document.getElementById("softwareStat"),
    shortcutStat: document.getElementById("shortcutStat")
  };

  const savedPlatform = localStorage.getItem("shortcutHubPlatform");
  const state = {
    platform: savedPlatform === "mac" ? "mac" : "windows",
    category: "All",
    query: "",
    favoritesOnly: false,
    favorites: new Set(JSON.parse(localStorage.getItem("shortcutHubFavorites") || "[]"))
  };

  const categories = ["All", ...new Set(apps.map(app => app.category))];

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("shortcutHubTheme", theme);
    el.themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#090d18" : "#f4f6fb");
  }

  const initialTheme = localStorage.getItem("shortcutHubTheme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  setTheme(initialTheme);

  function appSupportsPlatform(app) {
    return app.platform === "both" || app.platform === state.platform;
  }

  function shortcutId(appId, index) {
    return `${appId}:${index}`;
  }

  function getCombo(shortcut) {
    return shortcut[state.platform] || "";
  }

  function splitCombo(combo) {
    if (combo.includes(" → ")) {
      return { parts: combo.split(" → "), separator: "→" };
    }
    if (combo.includes(" + ")) {
      return { parts: combo.split(" + "), separator: "+" };
    }
    return { parts: [combo], separator: "" };
  }

  function renderKeyCombo(combo) {
    const { parts, separator } = splitCombo(combo);
    return parts.map((key, index) => {
      const sep = index < parts.length - 1
        ? `<span class="key-separator" aria-hidden="true">${separator}</span>`
        : "";
      return `<span class="keycap">${escapeHTML(key)}</span>${sep}`;
    }).join("");
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function matchesQuery(app, shortcut) {
    if (!state.query) return true;
    const haystack = `${app.name} ${app.category} ${shortcut.action} ${getCombo(shortcut)}`.toLowerCase();
    return haystack.includes(state.query.toLowerCase());
  }

  function filteredApps() {
    return apps
      .filter(app => appSupportsPlatform(app))
      .filter(app => state.category === "All" || app.category === state.category)
      .map(app => ({
        ...app,
        visibleShortcuts: app.shortcuts
          .map((shortcut, index) => ({ ...shortcut, originalIndex: index }))
          .filter(shortcut => getCombo(shortcut))
          .filter(shortcut => matchesQuery(app, shortcut))
          .filter(shortcut => !state.favoritesOnly || state.favorites.has(shortcutId(app.id, shortcut.originalIndex)))
      }))
      .filter(app => app.visibleShortcuts.length > 0);
  }

  function renderCategories() {
    el.categories.innerHTML = categories.map(category => `
      <button type="button"
        class="category-button ${state.category === category ? "active" : ""}"
        data-category="${escapeHTML(category)}">
        ${escapeHTML(category)}
      </button>
    `).join("");
  }

  function render() {
    const visibleApps = filteredApps();
    const visibleShortcuts = visibleApps.reduce((sum, app) => sum + app.visibleShortcuts.length, 0);

    el.resultsTitle.textContent = state.favoritesOnly
      ? "Your favorites"
      : state.query
        ? `Results for “${state.query}”`
        : state.category === "All" ? "Popular shortcuts" : state.category;

    el.resultCount.textContent = `${visibleShortcuts} shortcut${visibleShortcuts === 1 ? "" : "s"} · ${visibleApps.length} software`;
    el.emptyState.hidden = visibleApps.length !== 0;
    el.appGrid.hidden = visibleApps.length === 0;

    el.appGrid.innerHTML = visibleApps.map(app => `
      <article class="app-card" style="--app-accent:${app.accent}">
        <header class="app-card-header">
          <div class="app-identity">
            <div class="app-icon" aria-hidden="true">${escapeHTML(app.icon)}</div>
            <div>
              <div class="app-title-row">
                <h3 class="app-title">${escapeHTML(app.name)}</h3>
                ${app.popular ? '<span class="popular-badge">POPULAR</span>' : ""}
              </div>
              <p class="app-description">${escapeHTML(app.description)}</p>
            </div>
          </div>
          <a class="source-link" href="${app.source}" target="_blank" rel="noreferrer noopener"
             aria-label="Open official ${escapeHTML(app.name)} shortcut documentation">
             Official ↗
          </a>
        </header>
        <div class="shortcut-list">
          ${app.visibleShortcuts.map(shortcut => {
            const id = shortcutId(app.id, shortcut.originalIndex);
            const favorite = state.favorites.has(id);
            const combo = getCombo(shortcut);
            return `
              <div class="shortcut-row">
                <div class="shortcut-action">${escapeHTML(shortcut.action)}</div>
                <div class="key-combo" aria-label="${escapeHTML(combo)}">
                  ${renderKeyCombo(combo)}
                </div>
                <div class="row-actions">
                  <button class="tiny-button ${favorite ? "favorite" : ""}"
                    type="button" data-favorite="${id}" title="${favorite ? "Remove from favorites" : "Add to favorites"}"
                    aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}">
                    ${favorite ? "★" : "☆"}
                  </button>
                  <button class="tiny-button" type="button"
                    data-copy="${escapeHTML(combo)}"
                    data-action="${escapeHTML(shortcut.action)}"
                    title="Copy shortcut" aria-label="Copy shortcut">
                    ⧉
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </article>
    `).join("");

    updateStats();
  }

  function updateStats() {
    const platformApps = apps.filter(appSupportsPlatform);
    const totalShortcuts = platformApps.reduce((sum, app) =>
      sum + app.shortcuts.filter(s => getCombo(s)).length, 0);
    el.softwareStat.textContent = platformApps.length;
    el.shortcutStat.textContent = totalShortcuts;
  }

  function syncPlatformButtons() {
    document.querySelectorAll(".platform-button").forEach(button => {
      button.classList.toggle("active", button.dataset.platform === state.platform);
    });
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => el.toast.classList.remove("show"), 1600);
  }

  async function copyShortcut(combo, action) {
    const text = `${action} — ${combo}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied: ${combo}`);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      showToast(`Copied: ${combo}`);
    }
  }

  function randomShortcut() {
    const pool = [];
    apps.filter(appSupportsPlatform).forEach(app => {
      app.shortcuts.forEach((shortcut, index) => {
        const combo = getCombo(shortcut);
        if (combo) pool.push({ app, shortcut, index, combo });
      });
    });
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.query = pick.shortcut.action;
    state.category = "All";
    state.favoritesOnly = false;
    el.search.value = pick.shortcut.action;
    el.favoritesToggle.setAttribute("aria-pressed", "false");
    renderCategories();
    render();
    document.querySelector(".results-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(`${pick.app.name}: ${pick.combo}`);
  }

  function resetFilters() {
    state.category = "All";
    state.query = "";
    state.favoritesOnly = false;
    el.search.value = "";
    el.favoritesToggle.setAttribute("aria-pressed", "false");
    renderCategories();
    render();
  }

  document.querySelectorAll(".platform-button").forEach(button => {
    button.addEventListener("click", () => {
      state.platform = button.dataset.platform;
      localStorage.setItem("shortcutHubPlatform", state.platform);
      syncPlatformButtons();
      render();
    });
  });

  el.search.addEventListener("input", event => {
    state.query = event.target.value.trim();
    render();
  });

  el.categories.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    render();
  });

  el.appGrid.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      const id = favoriteButton.dataset.favorite;
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      localStorage.setItem("shortcutHubFavorites", JSON.stringify([...state.favorites]));
      render();
      return;
    }

    const copyButton = event.target.closest("[data-copy]");
    if (copyButton) copyShortcut(copyButton.dataset.copy, copyButton.dataset.action);
  });

  el.favoritesToggle.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    el.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
    render();
  });

  el.themeToggle.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  el.randomButton.addEventListener("click", randomShortcut);
  el.resetButton.addEventListener("click", resetFilters);

  document.addEventListener("keydown", event => {
    const target = event.target;
    const typing = target.matches("input, textarea, [contenteditable='true']");
    if (event.key === "/" && !typing) {
      event.preventDefault();
      el.search.focus();
    }
    if (event.key === "Escape" && document.activeElement === el.search) {
      el.search.value = "";
      state.query = "";
      el.search.blur();
      render();
    }
  });

  renderCategories();
  syncPlatformButtons();
  render();
})();
