const TRAINERS = [
  { id: "billy", name: "Billy" },
  { id: "friend", name: "John" }
];

const ACTIVE_TRAINER_KEY = "sv-pokedex-active-trainer";
const SUPABASE_URL = "https://lyyqelmajfzvwffkdfvt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXFlbG1hamZ6dndmZmtkZnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDEwMzEsImV4cCI6MjA5NDc3NzAzMX0.PWyn0vjX0wzxX8p4dNmL2UObpKhECKz6G6SRq6TtIMc";
const SUPABASE_TABLE = "pokedex_profiles";
const SUPABASE_JOURNAL_TABLE = "pokedex_journal";
const CLOUD_REFRESH_INTERVAL = 30000;

const list = document.querySelector("#pokemonList");
const template = document.querySelector("#pokemonCardTemplate");
const caughtCount = document.querySelector("#caughtCount");
const visibleCount = document.querySelector("#visibleCount");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const trainerButtons = document.querySelectorAll(".trainer-button");
const clearCaughtButton = document.querySelector("#clearCaught");
const emptyState = document.querySelector("#emptyState");
const cloudStatus = document.querySelector("#cloudStatus");
const syncNowButton = document.querySelector("#syncNow");

const validPokemonIds = new Set(POKEMON.map((pokemon) => pokemon.id));

let activeFilter = "all";
let activeTrainerId = loadActiveTrainerId();
let caughtByTrainer = loadAllCaught();
let isSyncing = false;
let pendingCloudSave = false;

function caughtStorageKey(trainerId) {
  return `sv-pokedex-caught-${trainerId}`;
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

function activeTrainer() {
  return TRAINERS.find((trainer) => trainer.id === activeTrainerId) || TRAINERS[0];
}

function activeCaught() {
  return caughtByTrainer[activeTrainerId] || new Set();
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
  const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?trainer_id=in.(${trainerIds})&select=trainer_id,caught_ids`;
  const response = await fetch(url, {
    headers: cloudHeaders({ Accept: "application/json" })
  });

  if (!response.ok) {
    throw new Error("Cloud load failed");
  }

  return response.json();
}

async function writeCloudCaught(trainerId) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: cloudHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    }),
    body: JSON.stringify({
      trainer_id: trainerId,
      caught_ids: normalizeCaughtIds(caughtByTrainer[trainerId]),
      updated_at: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error("Cloud save failed");
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
    const rows = await readCloudProfiles();

    for (const row of rows) {
      if (caughtByTrainer[row.trainer_id]) {
        caughtByTrainer[row.trainer_id] = new Set(normalizeCaughtIds(row.caught_ids || []));
        saveCaught(row.trainer_id);
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
    setCloudStatus(`Saving ${activeTrainer().name}'s catches...`);
    await writeCloudCaught(trainerId);
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

function renderTrainerControls() {
  document.body.dataset.trainer = activeTrainerId;

  trainerButtons.forEach((button) => {
    const isActive = button.dataset.trainer === activeTrainerId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function render() {
  const pokemonToShow = filteredPokemon();
  const caught = activeCaught();
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

  caughtCount.textContent = caught.size;
  visibleCount.textContent = `${pokemonToShow.length} Pokemon`;
  emptyState.hidden = pokemonToShow.length > 0;
  clearCaughtButton.disabled = caught.size === 0;
  renderTrainerControls();
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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
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

clearCaughtButton.addEventListener("click", () => {
  caughtByTrainer[activeTrainerId] = new Set();
  saveCaught(activeTrainerId);
  render();
  saveToCloud(activeTrainerId);
  clearJournal(activeTrainerId).catch(() => {});
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
