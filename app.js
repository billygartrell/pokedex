const TRAINERS = [
  { id: "billy", name: "Billy" },
  { id: "friend", name: "John" }
];

const ACTIVE_TRAINER_KEY = "sv-pokedex-active-trainer";
const ACTIVE_VIEW_KEY = "sv-pokedex-active-view";
const SUPABASE_URL = "https://lyyqelmajfzvwffkdfvt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXFlbG1hamZ6dndmZmtkZnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDEwMzEsImV4cCI6MjA5NDc3NzAzMX0.PWyn0vjX0wzxX8p4dNmL2UObpKhECKz6G6SRq6TtIMc";
const SUPABASE_TABLE = "pokedex_profiles";
const SUPABASE_ACCOLADES_TABLE = "pokedex_accolades";
const SUPABASE_JOURNAL_TABLE = "pokedex_journal";
const CLOUD_REFRESH_INTERVAL = 30000;

const MILESTONE_GROUPS = [
  {
    id: "gym_badges",
    title: "Gym Badges",
    shortTitle: "Badges",
    items: [
      { id: "cortondo", label: "Cortondo", image: "img/badges/cortondo.png" },
      { id: "artazon", label: "Artazon", image: "img/badges/artazon.png" },
      { id: "levincia", label: "Levincia", image: "img/badges/levincia.png" },
      { id: "cascarrafa", label: "Cascarrafa", image: "img/badges/cascarrafa.png" },
      { id: "medali", label: "Medali", image: "img/badges/medali.png" },
      { id: "montenevera", label: "Montenevera", image: "img/badges/montenevera.png" },
      { id: "alfornada", label: "Alfornada", image: "img/badges/alfornada.png" },
      { id: "glaseado", label: "Glaseado", image: "img/badges/glaseado.png" }
    ]
  },
  {
    id: "titans",
    title: "Titans",
    shortTitle: "Titans",
    items: [
      { id: "stony_cliff", label: "Stony Cliff", pokemonId: 950 },
      { id: "open_sky", label: "Open Sky", pokemonId: 962 },
      { id: "lurking_steel", label: "Lurking Steel", pokemonId: 968 },
      { id: "quaking_earth", label: "Quaking Earth", pokemonIds: { billy: 990, friend: 984 } },
      { id: "false_dragon", label: "False Dragon", pokemonId: 977 }
    ]
  },
  {
    id: "team_star",
    title: "Team Star",
    shortTitle: "Starfall",
    items: [
      { id: "dark_crew", label: "Dark Crew", image: "img/team-star/dark_crew.png" },
      { id: "fire_crew", label: "Fire Crew", image: "img/team-star/fire_crew.png" },
      { id: "poison_crew", label: "Poison Crew", image: "img/team-star/poison_crew.png" },
      { id: "fairy_crew", label: "Fairy Crew", image: "img/team-star/fairy_crew.png" },
      { id: "fighting_crew", label: "Fighting Crew", image: "img/team-star/fighting_crew.png" }
    ]
  }
];

const list = document.querySelector("#pokemonList");
const template = document.querySelector("#pokemonCardTemplate");
const pageEyebrow = document.querySelector("#pageEyebrow");
const caughtCount = document.querySelector("#caughtCount");
const progressLabel = document.querySelector("#progressLabel");
const visibleCount = document.querySelector("#visibleCount");
const journeyTotal = document.querySelector("#journeyTotal");
const journeyStats = document.querySelector("#journeyStats");
const milestoneGroups = document.querySelector("#milestoneGroups");
const searchInput = document.querySelector("#searchInput");
const clearSearchButton = document.querySelector("#clearSearch");
const accoladeSearchInput = document.querySelector("#accoladeSearchInput");
const clearAccoladeSearchButton = document.querySelector("#clearAccoladeSearch");
const filterButtons = document.querySelectorAll(".filter-button");
const accoladeFilterButtons = document.querySelectorAll(".accolade-filter-button");
const trainerButtons = document.querySelectorAll(".trainer-button");
const viewButtons = document.querySelectorAll(".view-tab");
const viewSections = document.querySelectorAll(".view-section");
const resetMenu = document.querySelector("#resetMenu");
const clearCaughtButton = document.querySelector("#clearCaught");
const resetDialog = document.querySelector("#resetDialog");
const resetTrainerName = document.querySelector("#resetTrainerName");
const cancelResetButton = document.querySelector("#cancelReset");
const confirmResetButton = document.querySelector("#confirmReset");
const emptyState = document.querySelector("#emptyState");
const cloudStatus = document.querySelector("#cloudStatus");
const syncNowButton = document.querySelector("#syncNow");

const validPokemonIds = new Set(POKEMON.map((pokemon) => pokemon.id));
const validMilestones = Object.fromEntries(
  MILESTONE_GROUPS.map((group) => [group.id, new Set(group.items.map((item) => item.id))])
);

let activeFilter = "all";
let activeAccoladeFilter = "all";
let activeTrainerId = loadActiveTrainerId();
let activeView = loadActiveView();
let caughtByTrainer = loadAllCaught();
let milestonesByTrainer = loadAllMilestones();
let isSyncing = false;
let pendingCloudSave = false;

function caughtStorageKey(trainerId) {
  return `sv-pokedex-caught-${trainerId}`;
}

function milestonesStorageKey(trainerId) {
  return `sv-pokedex-milestones-${trainerId}`;
}

function loadActiveTrainerId() {
  try {
    const saved = localStorage.getItem(ACTIVE_TRAINER_KEY);
    if (TRAINERS.some((trainer) => trainer.id === saved)) return saved;
  } catch {}

  return TRAINERS[0].id;
}

function saveActiveTrainerId() {
  try {
    localStorage.setItem(ACTIVE_TRAINER_KEY, activeTrainerId);
  } catch {}
}

function loadActiveView() {
  try {
    const saved = localStorage.getItem(ACTIVE_VIEW_KEY);
    if (["pokedex", "accolades"].includes(saved)) return saved;
  } catch {}

  return "pokedex";
}

function saveActiveView() {
  try {
    localStorage.setItem(ACTIVE_VIEW_KEY, activeView);
  } catch {}
}

function normalizeCaughtIds(ids) {
  return [...new Set(ids)]
    .map(Number)
    .filter((id) => Number.isInteger(id) && validPokemonIds.has(id))
    .sort((a, b) => a - b);
}

function loadCaught(trainerId) {
  try {
    return new Set(normalizeCaughtIds(JSON.parse(localStorage.getItem(caughtStorageKey(trainerId))) || []));
  } catch {
    return new Set();
  }
}

function loadAllCaught() {
  return Object.fromEntries(TRAINERS.map((trainer) => [trainer.id, loadCaught(trainer.id)]));
}

function saveCaught(trainerId) {
  try {
    localStorage.setItem(caughtStorageKey(trainerId), JSON.stringify([...caughtByTrainer[trainerId]].sort((a, b) => a - b)));
  } catch {}
}

function normalizeMilestones(value) {
  const normalized = Object.fromEntries(MILESTONE_GROUPS.map((group) => [group.id, []]));
  if (!value || typeof value !== "object") return normalized;

  for (const group of MILESTONE_GROUPS) {
    const ids = Array.isArray(value[group.id]) ? value[group.id] : [];
    normalized[group.id] = [...new Set(ids)]
      .filter((id) => validMilestones[group.id].has(id))
      .sort();
  }

  return normalized;
}

function loadMilestones(trainerId) {
  try {
    return normalizeMilestones(JSON.parse(localStorage.getItem(milestonesStorageKey(trainerId))));
  } catch {
    return normalizeMilestones();
  }
}

function loadAllMilestones() {
  return Object.fromEntries(TRAINERS.map((trainer) => [trainer.id, loadMilestones(trainer.id)]));
}

function saveMilestones(trainerId) {
  try {
    localStorage.setItem(milestonesStorageKey(trainerId), JSON.stringify(normalizeMilestones(milestonesByTrainer[trainerId])));
  } catch {}
}

function activeTrainer() {
  return TRAINERS.find((trainer) => trainer.id === activeTrainerId) || TRAINERS[0];
}

function activeCaught() {
  return caughtByTrainer[activeTrainerId] || new Set();
}

function activeMilestones() {
  return normalizeMilestones(milestonesByTrainer[activeTrainerId]);
}

function setCloudStatus(message) {
  if (!cloudStatus) return;
  cloudStatus.textContent = message;
}

function setSyncing(syncing) {
  isSyncing = syncing;
  if (syncNowButton) {
    syncNowButton.disabled = syncing;
  }
}

function cloudHeaders(extraHeaders = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extraHeaders
  };
}

async function readCloudProfiles() {
  const trainerIds = TRAINERS.map((trainer) => trainer.id).join(",");
  const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?trainer_id=in.(${trainerIds})&select=trainer_id,caught_ids,milestones`;
  const response = await fetch(url, {
    headers: cloudHeaders({ Accept: "application/json" })
  });

  if (!response.ok) {
    const fallbackUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?trainer_id=in.(${trainerIds})&select=trainer_id,caught_ids`;
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: cloudHeaders({ Accept: "application/json" })
    });

    if (!fallbackResponse.ok) {
      throw new Error("Cloud load failed");
    }

    return fallbackResponse.json();
  }

  return response.json();
}

async function readCloudAccolades() {
  const trainerIds = TRAINERS.map((trainer) => trainer.id).join(",");
  const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_ACCOLADES_TABLE}?trainer_id=in.(${trainerIds})&select=trainer_id,milestones`;
  const response = await fetch(url, {
    headers: cloudHeaders({ Accept: "application/json" })
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

async function writeCloudCaught(trainerId) {
  const profile = {
    trainer_id: trainerId,
    caught_ids: normalizeCaughtIds(caughtByTrainer[trainerId]),
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: cloudHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    }),
    body: JSON.stringify(profile)
  });

  if (!response.ok) {
    throw new Error("Cloud save failed");
  }
}

async function writeCloudAccolades(trainerId) {
  const profile = {
    trainer_id: trainerId,
    milestones: normalizeMilestones(milestonesByTrainer[trainerId]),
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_ACCOLADES_TABLE}`, {
    method: "POST",
    headers: cloudHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    }),
    body: JSON.stringify(profile)
  });

  if (!response.ok) {
    throw new Error("Accolades cloud save failed");
  }
}

async function recordCatchEvent(pokemon) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_JOURNAL_TABLE}`, {
    method: "POST",
    headers: cloudHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    }),
    body: JSON.stringify({
      trainer_id: activeTrainerId,
      event_type: "caught",
      pokemon_id: pokemon.id,
      pokemon_name: pokemon.name,
      happened_at: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error("Journal save failed");
  }
}

async function clearJournal(trainerId) {
  const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_JOURNAL_TABLE}?trainer_id=eq.${encodeURIComponent(trainerId)}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: cloudHeaders({ Prefer: "return=minimal" })
  });

  if (!response.ok) {
    throw new Error("Journal reset failed");
  }
}

async function loadFromCloud() {
  if (isSyncing) return;

  try {
    setSyncing(true);
    setCloudStatus("Loading cloud saves...");
    const [profileRows, accoladeRows] = await Promise.all([readCloudProfiles(), readCloudAccolades()]);

    for (const row of profileRows) {
      if (caughtByTrainer[row.trainer_id]) {
        caughtByTrainer[row.trainer_id] = new Set(normalizeCaughtIds(row.caught_ids || []));
        saveCaught(row.trainer_id);

        if (row.milestones) {
          milestonesByTrainer[row.trainer_id] = normalizeMilestones(row.milestones);
          saveMilestones(row.trainer_id);
        }
      }
    }

    for (const row of accoladeRows) {
      if (milestonesByTrainer[row.trainer_id]) {
        milestonesByTrainer[row.trainer_id] = normalizeMilestones(row.milestones);
        saveMilestones(row.trainer_id);
      }
    }

    render();
    setCloudStatus(`${activeTrainer().name}: ${activeCaught().size} caught`);
  } catch (error) {
    setCloudStatus(`${error.message}. Using this browser's save.`);
  } finally {
    setSyncing(false);
  }
}

async function saveToCloud(trainerId = activeTrainerId) {
  if (isSyncing) {
    pendingCloudSave = true;
    return;
  }

  try {
    setSyncing(true);
    setCloudStatus(`Saving ${activeTrainer().name}'s progress...`);
    await writeCloudCaught(trainerId);
    await writeCloudAccolades(trainerId);
    setCloudStatus(`${activeTrainer().name}: ${activeCaught().size} caught`);
  } catch (error) {
    setCloudStatus(`${error.message}. Saved on this browser.`);
  } finally {
    setSyncing(false);

    if (pendingCloudSave) {
      pendingCloudSave = false;
      saveToCloud();
    }
  }
}

async function saveAccoladesToCloud(trainerId = activeTrainerId) {
  if (isSyncing) {
    pendingCloudSave = true;
    return;
  }

  try {
    setSyncing(true);
    setCloudStatus(`Saving ${activeTrainer().name}'s accolades...`);
    await writeCloudAccolades(trainerId);
    setCloudStatus(`${activeTrainer().name}: ${activeCaught().size} caught`);
  } catch (error) {
    setCloudStatus(`${error.message}. Saved on this browser.`);
  } finally {
    setSyncing(false);

    if (pendingCloudSave) {
      pendingCloudSave = false;
      saveToCloud();
    }
  }
}

function formatNumber(entry) {
  return `#${String(entry).padStart(3, "0")}`;
}

function spriteUrl(pokemon) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`;
}

function matchesPokemon(pokemon, query) {
  const haystack = [
    pokemon.name,
    String(pokemon.entry),
    formatNumber(pokemon.entry),
    String(pokemon.id),
    ...pokemon.types
  ].join(" ").toLowerCase();

  return haystack.includes(query);
}

function matchesMilestone(group, item, query) {
  const haystack = [
    item.label,
    item.id,
    group.title,
    group.shortTitle
  ].join(" ").toLowerCase();

  return haystack.includes(query);
}

function filteredPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  const caught = activeCaught();

  return POKEMON.filter((pokemon) => {
    const isCaught = caught.has(pokemon.id);
    const passesFilter =
      activeFilter === "all" ||
      (activeFilter === "caught" && isCaught) ||
      (activeFilter === "missing" && !isCaught);

    return passesFilter && (!query || matchesPokemon(pokemon, query));
  });
}

function filteredMilestoneItems(group, milestones) {
  const query = accoladeSearchInput.value.trim().toLowerCase();

  return group.items.filter((item) => {
    const isComplete = milestones[group.id].includes(item.id);
    const passesFilter =
      activeAccoladeFilter === "all" ||
      (activeAccoladeFilter === "complete" && isComplete) ||
      (activeAccoladeFilter === "missing" && !isComplete);

    return passesFilter && (!query || matchesMilestone(group, item, query));
  });
}

function renderTrainerControls() {
  document.body.dataset.trainer = activeTrainerId;

  trainerButtons.forEach((button) => {
    const isActive = button.dataset.trainer === activeTrainerId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderViewControls() {
  document.body.dataset.view = activeView;
  pageEyebrow.textContent = activeView === "accolades" ? "Paldea Region Accolades" : "Paldea Region Pokedex";

  viewButtons.forEach((button) => {
    const isActive = button.dataset.view === activeView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const activeButton = [...viewButtons].find((button) => button.dataset.view === activeView);
  const tabRow = activeButton?.closest(".view-tabs");
  if (activeButton && tabRow) {
    tabRow.style.setProperty("--active-tab-left", `${activeButton.offsetLeft}px`);
    tabRow.style.setProperty("--active-tab-width", `${activeButton.offsetWidth}px`);
  }

  viewSections.forEach((section) => {
    section.hidden = section.dataset.viewSection !== activeView;
  });
}

function renderSearchControls() {
  clearSearchButton.hidden = searchInput.value.trim().length === 0;
  clearAccoladeSearchButton.hidden = accoladeSearchInput.value.trim().length === 0;
}

function openResetDialog() {
  if (activeCaught().size === 0) return;

  resetTrainerName.textContent = activeTrainer().name;
  resetMenu.removeAttribute("open");

  if (typeof resetDialog.showModal === "function") {
    resetDialog.showModal();
  } else if (window.confirm(`Reset ${activeTrainer().name}'s Pokedex?`)) {
    resetActiveTrainerCaught();
  }
}

function closeResetDialog() {
  if (resetDialog.open) {
    resetDialog.close();
  }
}

function resetActiveTrainerCaught() {
  caughtByTrainer[activeTrainerId] = new Set();
  saveCaught(activeTrainerId);
  render();
  saveToCloud(activeTrainerId);
  clearJournal(activeTrainerId).catch(() => {});
  closeResetDialog();
}

function milestoneCount(group, milestones = activeMilestones()) {
  return milestones[group.id]?.length || 0;
}

function renderMilestones() {
  if (!journeyTotal || !journeyStats || !milestoneGroups) return;

  const milestones = activeMilestones();
  const totalComplete = MILESTONE_GROUPS.reduce((sum, group) => sum + milestoneCount(group, milestones), 0);
  const totalPossible = MILESTONE_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  journeyTotal.textContent = `${totalComplete} / ${totalPossible}`;
  journeyStats.replaceChildren();
  milestoneGroups.replaceChildren();

  for (const group of MILESTONE_GROUPS) {
    const completeCount = milestoneCount(group, milestones);
    const itemsToShow = filteredMilestoneItems(group, milestones);

    const stat = document.createElement("article");
    stat.className = "journey-stat-card";
    stat.innerHTML = `
      <span class="journey-stat-value">${completeCount} / ${group.items.length}</span>
      <span class="journey-stat-label">${group.shortTitle}</span>
    `;
    journeyStats.append(stat);

    for (const item of itemsToShow) {
      const isComplete = milestones[group.id].includes(item.id);
      const button = document.createElement("button");
      button.className = "milestone-card";
      button.type = "button";
      button.dataset.group = group.id;
      button.dataset.milestone = item.id;
      button.setAttribute("aria-pressed", String(isComplete));
      button.innerHTML = `
        ${milestoneVisualHtml(group, item)}
        <span class="milestone-copy">
          <span class="milestone-title">${item.label}</span>
          <span class="milestone-subtitle">${group.title}</span>
        </span>
        <span class="milestone-complete-dot" aria-hidden="true"></span>
      `;
      milestoneGroups.append(button);
    }
  }

  if (milestoneGroups.children.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state accolade-empty-state";
    empty.textContent = "No accolades match that view.";
    milestoneGroups.append(empty);
  }
}

function milestoneSpriteUrl(item) {
  const pokemonId = item.pokemonIds?.[activeTrainerId] || item.pokemonId;
  if (!pokemonId) return "";

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

function milestoneVisualHtml(group, item) {
  if (item.image) {
    return `
      <span class="milestone-visual badge-milestone-visual" aria-hidden="true">
        <img src="${item.image}" alt="">
      </span>
    `;
  }

  const sprite = milestoneSpriteUrl(item);
  if (sprite) {
    return `
      <span class="milestone-visual sprite-milestone-visual" aria-hidden="true">
        <img src="${sprite}" alt="">
      </span>
    `;
  }

  return `<span class="milestone-visual ${group.id}-visual" aria-hidden="true"></span>`;
}

function render() {
  const pokemonToShow = filteredPokemon();
  const caught = activeCaught();
  const milestones = activeMilestones();
  const totalMilestones = MILESTONE_GROUPS.reduce((sum, group) => sum + milestoneCount(group, milestones), 0);
  list.replaceChildren();

  for (const pokemon of pokemonToShow) {
    const card = template.content.cloneNode(true);
    const button = card.querySelector(".catch-toggle");
    const image = card.querySelector("img");
    const number = card.querySelector(".pokemon-number");
    const name = card.querySelector(".pokemon-name");
    const typeRow = card.querySelector(".type-row");
    const caughtLabel = card.querySelector(".caught-label");
    const ownershipDots = card.querySelector(".ownership-dots");
    const billyDot = card.querySelector(".billy-dot");
    const johnDot = card.querySelector(".john-dot");
    const isCaught = caught.has(pokemon.id);
    const isBillyCaught = caughtByTrainer.billy?.has(pokemon.id) || false;
    const isJohnCaught = caughtByTrainer.friend?.has(pokemon.id) || false;

    button.dataset.id = pokemon.id;
    button.setAttribute("aria-pressed", String(isCaught));
    button.setAttribute("aria-label", `${isCaught ? "Mark" : "Catch"} ${pokemon.name} for ${activeTrainer().name}`);
    image.src = spriteUrl(pokemon);
    image.alt = `${pokemon.name} sprite`;
    number.textContent = formatNumber(pokemon.entry);
    name.textContent = pokemon.name;
    caughtLabel.textContent = isCaught ? `${pokemon.name} is caught` : `Catch ${pokemon.name}`;
    ownershipDots.classList.toggle("both-caught", isBillyCaught && isJohnCaught);
    ownershipDots.setAttribute(
      "aria-label",
      `Billy ${isBillyCaught ? "caught" : "missing"}, John ${isJohnCaught ? "caught" : "missing"}`
    );
    billyDot.classList.toggle("caught", isBillyCaught);
    johnDot.classList.toggle("caught", isJohnCaught);

    for (const type of pokemon.types) {
      const chip = document.createElement("span");
      chip.className = "type-chip";
      chip.dataset.type = type;
      chip.textContent = type;
      typeRow.append(chip);
    }

    list.append(card);
  }

  caughtCount.textContent = activeView === "accolades" ? totalMilestones : caught.size;
  progressLabel.textContent = activeView === "accolades" ? "done" : "caught";
  visibleCount.textContent = `${pokemonToShow.length} Pokemon`;
  emptyState.hidden = pokemonToShow.length > 0;
  clearCaughtButton.disabled = caught.size === 0;
  renderTrainerControls();
  renderViewControls();
  renderSearchControls();
  renderMilestones();
}

list.addEventListener("click", (event) => {
  const button = event.target.closest(".catch-toggle");

  if (!button) return;

  const id = Number(button.dataset.id);
  const caught = activeCaught();
  const wasCaught = caught.has(id);
  if (wasCaught) {
    caught.delete(id);
  } else {
    caught.add(id);
  }

  saveCaught(activeTrainerId);
  render();
  saveToCloud(activeTrainerId);

  if (!wasCaught) {
    const pokemon = POKEMON.find((item) => item.id === id);
    if (pokemon) {
      recordCatchEvent(pokemon).catch(() => {});
    }
  }
});

searchInput.addEventListener("input", render);

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  render();
});

accoladeSearchInput.addEventListener("input", render);

clearAccoladeSearchButton.addEventListener("click", () => {
  accoladeSearchInput.value = "";
  accoladeSearchInput.focus();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

accoladeFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeAccoladeFilter = button.dataset.filter;
    accoladeFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

trainerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTrainerId = button.dataset.trainer;
    saveActiveTrainerId();
    render();
    loadFromCloud();
  });
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    saveActiveView();
    render();
  });
});

milestoneGroups.addEventListener("click", (event) => {
  const button = event.target.closest(".milestone-card");
  if (!button) return;

  const milestones = activeMilestones();
  const groupId = button.dataset.group;
  const milestoneId = button.dataset.milestone;
  const groupMilestones = new Set(milestones[groupId] || []);

  if (groupMilestones.has(milestoneId)) {
    groupMilestones.delete(milestoneId);
  } else {
    groupMilestones.add(milestoneId);
  }

  milestones[groupId] = [...groupMilestones].sort();
  milestonesByTrainer[activeTrainerId] = normalizeMilestones(milestones);
  saveMilestones(activeTrainerId);
  render();
  saveAccoladesToCloud(activeTrainerId);
});

clearCaughtButton.addEventListener("click", openResetDialog);

cancelResetButton.addEventListener("click", closeResetDialog);

confirmResetButton.addEventListener("click", resetActiveTrainerCaught);

resetDialog.addEventListener("click", (event) => {
  if (event.target === resetDialog) {
    closeResetDialog();
  }
});

document.addEventListener("click", (event) => {
  if (!resetMenu.open || resetMenu.contains(event.target)) return;
  resetMenu.removeAttribute("open");
});

syncNowButton?.addEventListener("click", () => {
  loadFromCloud();
});

window.addEventListener("focus", () => {
  loadFromCloud();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    loadFromCloud();
  }
});

window.addEventListener("resize", renderViewControls);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js");
}

render();
loadFromCloud();
setInterval(() => {
  if (document.visibilityState === "visible") {
    loadFromCloud();
  }
}, CLOUD_REFRESH_INTERVAL);
