(() => {
  "use strict";
  const fallbackResources = [
    { title: "Équipes en éducation physique", description: "Organisez des équipes et des tournois pour vos cours d'éducation physique.", category: "Organisation", section: "Numérique", icon: "users", url: "https://lapizzaderafa.github.io/equipes-education-physique-/", display_order: 2, is_active: true },
    { title: "Badminton School", description: "Un environnement numérique pour soutenir l'enseignement du badminton.", category: "Badminton", section: "Numérique", icon: "medal", url: "https://raphaelfrenette-a11y.github.io/badminton_school/", display_order: 3, is_active: true }
  ];
  const pedagogicalResources = [
    { title: "Goalball", description: "", category: "Pédagogie", section: "Pédagogique", icon: "activity", placeholder: true, display_order: 1, is_active: true },
    { title: "Badminton", description: "", category: "Pédagogie", section: "Pédagogique", icon: "activity", placeholder: true, display_order: 2, is_active: true },
    { title: "Basketball", description: "", category: "Pédagogie", section: "Pédagogique", icon: "activity", placeholder: true, display_order: 3, is_active: true },
    { title: "DBL", description: "", category: "Pédagogie", section: "Pédagogique", icon: "activity", placeholder: true, display_order: 4, is_active: true },
    { title: "Et plus à suivre...", description: "", category: "Pédagogie", section: "Pédagogique", icon: "activity", placeholder: true, display_order: 5, is_active: true }
  ];
  const iconMap = {
    trophy: ["🏆", "icon-lime"], users: ["◉", "icon-blue"], medal: ["✦", "icon-coral"],
    book: ["▤", "icon-teal"], "book-open": ["▧", "icon-teal"], activity: ["⌁", "icon-lime"],
    dumbbell: ["↗", "icon-blue"], clipboard: ["▣", "icon-coral"], default: ["✳", "icon-teal"]
  };
  const sections = [
    { key: "Pédagogique", title: "Pédagogique", description: "Des idées, des contenus et des ressources pour enrichir l’enseignement." },
    { key: "Numérique", title: "Numérique", description: "Des outils numériques pour organiser, créer et simplifier vos cours." }
  ];
  const sectionRoot = document.getElementById("resourceSections");
  const status = document.getElementById("resourceStatus");
  const empty = document.getElementById("emptyState");
  const search = document.getElementById("searchInput");
  const filters = [...document.querySelectorAll(".filter-button")];
  let resources = fallbackResources;
  let activeFilter = "Toutes";
  let activeSection = "Numérique";
  const tabs = [...document.querySelectorAll(".resource-tab")];
  const panel = document.getElementById("resourcePanel");

  function safeUrl(value) {
    try { const u = new URL(value); return u.protocol === "https:" ? u.href : null; }
    catch { return null; }
  }
  function card(resource) {
    const item = document.createElement("article");
    item.className = "resource-card";
    const icon = document.createElement("div");
    const iconInfo = iconMap[resource.icon] || iconMap.default;
    icon.className = `resource-icon ${iconInfo[1]}`;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = iconInfo[0];

    const category = document.createElement("p");
    category.className = "resource-category";
    category.textContent = String(resource.category || "Ressource").toLocaleUpperCase("fr-CA");

    const title = document.createElement("h3");
    title.textContent = resource.title;

    const description = document.createElement("p");
    description.className = "resource-description";
    description.textContent = resource.description || "";

    if (resource.placeholder) {
      const comingSoon = document.createElement("p");
      comingSoon.className = "coming-soon";
      comingSoon.textContent = "Contenu à venir";
      item.append(icon, category, title, comingSoon);
    } else {
      const link = document.createElement("a");
      link.className = "card-link";
      link.href = safeUrl(resource.url) || "#";
      link.textContent = "Accéder à la ressource ";
      if (link.href === "#" || !safeUrl(resource.url)) {
        link.setAttribute("aria-disabled", "true");
        link.addEventListener("click", e => e.preventDefault());
      } else {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        link.append(arrow);
      }
      item.append(icon, category, title, description, link);
    }
    return item;
  }
  function render() {
    const term = search.value.trim().toLocaleLowerCase("fr-CA");
    const filtered = resources.filter(r => {
      const matchesCategory = activeFilter === "Toutes" || r.category === activeFilter;
      const matchesSection = (r.section || "Numérique") === activeSection;
      const haystack = `${r.title} ${r.description} ${r.category} ${r.section || "Numérique"}`.toLocaleLowerCase("fr-CA");
      return r.is_active !== false && matchesCategory && matchesSection && haystack.includes(term);
    }).sort((a,b) => (a.display_order || 0) - (b.display_order || 0));

    tabs.forEach(tab => {
      const selected = tab.dataset.section === activeSection;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", activeSection === "Numérique" ? "tab-numerique" : "tab-pedagogique");
    sectionRoot.replaceChildren();
    const grid = document.createElement("div");
    grid.className = "resource-grid";
    if (filtered.length) {
      grid.append(...filtered.map(card));
    } else {
      const note = document.createElement("p");
      note.className = "section-empty";
      note.textContent = activeSection === "Pédagogique"
        ? "Les ressources pédagogiques seront ajoutées ici."
        : "Aucune ressource numérique ne correspond à votre recherche.";
      grid.append(note);
    }
    sectionRoot.append(grid);
    empty.hidden = true;
    status.textContent = `${filtered.length} ${filtered.length === 1 ? "ressource disponible" : "ressources disponibles"}`;
    ["Pédagogique", "Numérique"].forEach(section => {
      const count = document.querySelector(`[data-section="${section}"] .tab-count`);
      const total = resources.filter(r => r.is_active !== false && (r.section || "Numérique") === section).length;
      if (count) count.textContent = total;
    });
  }
  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(b => b.classList.toggle("active", b === button));
    render();
  }));
  tabs.forEach(tab => tab.addEventListener("click", () => {
    activeSection = tab.dataset.section;
    render();
  }));
  search.addEventListener("input", render);
  document.getElementById("year").textContent = new Date().getFullYear();

  async function loadResources() {
    const cfg = window.PETEACH_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseKey) {
      resources = [...fallbackResources, ...pedagogicalResources];
      status.textContent = "Ressources locales affichées — configuration Supabase manquante.";
      render();
      return;
    }
    try {
      const endpoint = `${cfg.supabaseUrl}/rest/v1/resources?select=title,description,category,section,icon,url,display_order,is_active&is_active=eq.true&order=display_order.asc`;
      const response = await fetch(endpoint, {
        headers: { apikey: cfg.supabaseKey, Authorization: `Bearer ${cfg.supabaseKey}` }
      });
      if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
      const rows = await response.json();
      resources = [...(Array.isArray(rows) && rows.length ? rows : fallbackResources), ...pedagogicalResources];
      status.textContent = "";
    } catch (error) {
      console.warn("PEteach: impossible de charger les ressources depuis Supabase.", error);
      resources = [...fallbackResources, ...pedagogicalResources];
      status.textContent = "Mode hors connexion : les ressources principales sont affichées.";
    }
    render();
  }
  loadResources();
})();
