(() => {
  "use strict";
  const fallbackResources = [
    { title: "Badminton ELO", description: "Gérez les joueurs, les matchs et les classements avec un système de cote ELO.", category: "Badminton", icon: "trophy", url: "https://peteach.github.io/badminton-elo/", display_order: 1, is_active: true },
    { title: "Équipes en éducation physique", description: "Organisez des équipes et des tournois pour vos cours d'éducation physique.", category: "Organisation", icon: "users", url: "https://lapizzaderafa.github.io/equipes-education-physique-/", display_order: 2, is_active: true },
    { title: "Badminton School", description: "Un environnement numérique pour soutenir l'enseignement du badminton.", category: "Badminton", icon: "medal", url: "https://raphaelfrenette-a11y.github.io/badminton_school/", display_order: 3, is_active: true }
  ];
  const iconMap = {
    trophy: ["🏆", "icon-lime"], users: ["◉", "icon-blue"], medal: ["✦", "icon-coral"],
    book: ["▤", "icon-teal"], "book-open": ["▧", "icon-teal"], activity: ["⌁", "icon-lime"],
    dumbbell: ["↗", "icon-blue"], clipboard: ["▣", "icon-coral"], default: ["✳", "icon-teal"]
  };
  const grid = document.getElementById("resourceGrid");
  const status = document.getElementById("resourceStatus");
  const empty = document.getElementById("emptyState");
  const search = document.getElementById("searchInput");
  const filters = [...document.querySelectorAll(".filter-button")];
  let resources = fallbackResources;
  let activeFilter = "Toutes";

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
    return item;
  }
  function render() {
    const term = search.value.trim().toLocaleLowerCase("fr-CA");
    const filtered = resources.filter(r => {
      const matchesCategory = activeFilter === "Toutes" || r.category === activeFilter;
      const haystack = `${r.title} ${r.description} ${r.category}`.toLocaleLowerCase("fr-CA");
      return r.is_active !== false && matchesCategory && haystack.includes(term);
    }).sort((a,b) => (a.display_order || 0) - (b.display_order || 0));
    grid.replaceChildren(...filtered.map(card));
    empty.hidden = filtered.length > 0;
    status.textContent = `${filtered.length} ${filtered.length === 1 ? "ressource disponible" : "ressources disponibles"}`;
  }
  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(b => b.classList.toggle("active", b === button));
    render();
  }));
  search.addEventListener("input", render);
  document.getElementById("year").textContent = new Date().getFullYear();

  async function loadResources() {
    const cfg = window.PETEACH_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseKey) {
      status.textContent = "Ressources locales affichées — configuration Supabase manquante.";
      render();
      return;
    }
    try {
      const endpoint = `${cfg.supabaseUrl}/rest/v1/resources?select=title,description,category,icon,url,display_order,is_active&is_active=eq.true&order=display_order.asc`;
      const response = await fetch(endpoint, {
        headers: { apikey: cfg.supabaseKey, Authorization: `Bearer ${cfg.supabaseKey}` }
      });
      if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
      const rows = await response.json();
      if (Array.isArray(rows) && rows.length) resources = rows;
      status.textContent = "";
    } catch (error) {
      console.warn("PEteach: impossible de charger les ressources depuis Supabase.", error);
      status.textContent = "Mode hors connexion : les ressources principales sont affichées.";
    }
    render();
  }
  loadResources();
})();
