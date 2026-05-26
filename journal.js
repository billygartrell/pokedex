const TRAINERS = [
  { id: "billy", name: "Billy" },
  { id: "friend", name: "John" }
];

const ACTIVE_TRAINER_KEY = "sv-pokedex-active-trainer";
const SUPABASE_URL = "https://lyyqelmajfzvwffkdfvt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXFlbG1hamZ6dndmZmtkZnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDEwMzEsImV4cCI6MjA5NDc3NzAzMX0.PWyn0vjX0wzxX8p4dNmL2UObpKhECKz6G6SRq6TtIMc";
const SUPABASE_JOURNAL_TABLE = "pokedex_journal";

const journalCount = document.querySelector("#journalCount");
const journalStatus = document.querySelector("#journalStatus");
const refreshJournalButton = document.querySelector("#refreshJournal");
const trainerButtons = document.querySelectorAll(".trainer-button");
const journeyDays = document.querySelector("#journeyDays");
const caughtEntries = document.querySelector("#caughtEntries");
const timelineList = document.querySelector("#timelineList");
const emptyJournal = document.querySelector("#emptyJournal");

let activeTrainerId = loadActiveTrainerId();

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

function activeTrainer() {
  return TRAINERS.find((trainer) => trainer.id === activeTrainerId) || TRAINERS[0];
}

function cloudHeaders(extraHeaders = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extraHeaders
  };
}

function spriteUrl(id) {
  const pokemon = POKEMON.find((item) => item.id === id);
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.pokemonId || id}.png`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function journeyDayCount(entries) {
  if (entries.length === 0) return 0;

  const firstCatch = new Date(entries[0].happened_at);
  const milliseconds = Date.now() - firstCatch.getTime();
  return Math.max(1, Math.ceil(milliseconds / 86400000));
}

async function readJournalEntries() {
  const params = new URLSearchParams({
    trainer_id: `eq.${activeTrainerId}`,
    event_type: "eq.caught",
    select: "pokemon_id,pokemon_name,happened_at",
    order: "happened_at.asc"
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_JOURNAL_TABLE}?${params}`, {
    headers: cloudHeaders({ Accept: "application/json" })
  });

  if (!response.ok) {
    throw new Error("Journal unavailable");
  }

  return response.json();
}

function renderTrainerControls() {
  trainerButtons.forEach((button) => {
    const isActive = button.dataset.trainer === activeTrainerId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderStats(entries) {
  journalCount.textContent = entries.length;
  journeyDays.textContent = journeyDayCount(entries);
  caughtEntries.textContent = entries.length;
}

function renderTimeline(entries) {
  timelineList.replaceChildren();

  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = "timeline-item";

    item.innerHTML = `
      <span class="sprite-frame">
        <img src="${spriteUrl(entry.pokemon_id)}" alt="${entry.pokemon_name} sprite">
      </span>
      <span class="timeline-copy">
        <p class="timeline-title">Caught ${entry.pokemon_name}</p>
        <p class="timeline-time">${formatDateTime(entry.happened_at)}</p>
      </span>
    `;

    timelineList.append(item);
  }

  emptyJournal.hidden = entries.length > 0;
}

async function loadJournal() {
  try {
    renderTrainerControls();
    refreshJournalButton.disabled = true;
    journalStatus.textContent = `Loading ${activeTrainer().name}'s journal...`;
    const entries = await readJournalEntries();

    renderStats(entries);
    renderTimeline(entries);
    journalStatus.textContent = `${activeTrainer().name}: ${entries.length} entries loaded`;
  } catch (error) {
    journalStatus.textContent = error.message;
  } finally {
    refreshJournalButton.disabled = false;
  }
}

trainerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTrainerId = button.dataset.trainer;
    saveActiveTrainerId();
    loadJournal();
  });
});

refreshJournalButton.addEventListener("click", loadJournal);
loadJournal();
