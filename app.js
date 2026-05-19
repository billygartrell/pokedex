const POKEMON = [
  { id: 1, name: "Bulbasaur", types: ["grass", "poison"] },
  { id: 2, name: "Ivysaur", types: ["grass", "poison"] },
  { id: 3, name: "Venusaur", types: ["grass", "poison"] },
  { id: 4, name: "Charmander", types: ["fire"] },
  { id: 5, name: "Charmeleon", types: ["fire"] },
  { id: 6, name: "Charizard", types: ["fire", "flying"] },
  { id: 7, name: "Squirtle", types: ["water"] },
  { id: 8, name: "Wartortle", types: ["water"] },
  { id: 9, name: "Blastoise", types: ["water"] },
  { id: 10, name: "Caterpie", types: ["bug"] },
  { id: 11, name: "Metapod", types: ["bug"] },
  { id: 12, name: "Butterfree", types: ["bug", "flying"] },
  { id: 13, name: "Weedle", types: ["bug", "poison"] },
  { id: 14, name: "Kakuna", types: ["bug", "poison"] },
  { id: 15, name: "Beedrill", types: ["bug", "poison"] },
  { id: 16, name: "Pidgey", types: ["normal", "flying"] },
  { id: 17, name: "Pidgeotto", types: ["normal", "flying"] },
  { id: 18, name: "Pidgeot", types: ["normal", "flying"] },
  { id: 19, name: "Rattata", types: ["normal"] },
  { id: 20, name: "Raticate", types: ["normal"] },
  { id: 21, name: "Spearow", types: ["normal", "flying"] },
  { id: 22, name: "Fearow", types: ["normal", "flying"] },
  { id: 23, name: "Ekans", types: ["poison"] },
  { id: 24, name: "Arbok", types: ["poison"] },
  { id: 25, name: "Pikachu", types: ["electric"] },
  { id: 26, name: "Raichu", types: ["electric"] },
  { id: 27, name: "Sandshrew", types: ["ground"] },
  { id: 28, name: "Sandslash", types: ["ground"] },
  { id: 29, name: "Nidoran F", types: ["poison"] },
  { id: 30, name: "Nidorina", types: ["poison"] },
  { id: 31, name: "Nidoqueen", types: ["poison", "ground"] },
  { id: 32, name: "Nidoran M", types: ["poison"] },
  { id: 33, name: "Nidorino", types: ["poison"] },
  { id: 34, name: "Nidoking", types: ["poison", "ground"] },
  { id: 35, name: "Clefairy", types: ["fairy"] },
  { id: 36, name: "Clefable", types: ["fairy"] },
  { id: 37, name: "Vulpix", types: ["fire"] },
  { id: 38, name: "Ninetales", types: ["fire"] },
  { id: 39, name: "Jigglypuff", types: ["normal", "fairy"] },
  { id: 40, name: "Wigglytuff", types: ["normal", "fairy"] },
  { id: 41, name: "Zubat", types: ["poison", "flying"] },
  { id: 42, name: "Golbat", types: ["poison", "flying"] },
  { id: 43, name: "Oddish", types: ["grass", "poison"] },
  { id: 44, name: "Gloom", types: ["grass", "poison"] },
  { id: 45, name: "Vileplume", types: ["grass", "poison"] },
  { id: 46, name: "Paras", types: ["bug", "grass"] },
  { id: 47, name: "Parasect", types: ["bug", "grass"] },
  { id: 48, name: "Venonat", types: ["bug", "poison"] },
  { id: 49, name: "Venomoth", types: ["bug", "poison"] },
  { id: 50, name: "Diglett", types: ["ground"] },
  { id: 51, name: "Dugtrio", types: ["ground"] },
  { id: 52, name: "Meowth", types: ["normal"] },
  { id: 53, name: "Persian", types: ["normal"] },
  { id: 54, name: "Psyduck", types: ["water"] },
  { id: 55, name: "Golduck", types: ["water"] },
  { id: 56, name: "Mankey", types: ["fighting"] },
  { id: 57, name: "Primeape", types: ["fighting"] },
  { id: 58, name: "Growlithe", types: ["fire"] },
  { id: 59, name: "Arcanine", types: ["fire"] },
  { id: 60, name: "Poliwag", types: ["water"] },
  { id: 61, name: "Poliwhirl", types: ["water"] },
  { id: 62, name: "Poliwrath", types: ["water", "fighting"] },
  { id: 63, name: "Abra", types: ["psychic"] },
  { id: 64, name: "Kadabra", types: ["psychic"] },
  { id: 65, name: "Alakazam", types: ["psychic"] },
  { id: 66, name: "Machop", types: ["fighting"] },
  { id: 67, name: "Machoke", types: ["fighting"] },
  { id: 68, name: "Machamp", types: ["fighting"] },
  { id: 69, name: "Bellsprout", types: ["grass", "poison"] },
  { id: 70, name: "Weepinbell", types: ["grass", "poison"] },
  { id: 71, name: "Victreebel", types: ["grass", "poison"] },
  { id: 72, name: "Tentacool", types: ["water", "poison"] },
  { id: 73, name: "Tentacruel", types: ["water", "poison"] },
  { id: 74, name: "Geodude", types: ["rock", "ground"] },
  { id: 75, name: "Graveler", types: ["rock", "ground"] },
  { id: 76, name: "Golem", types: ["rock", "ground"] },
  { id: 77, name: "Ponyta", types: ["fire"] },
  { id: 78, name: "Rapidash", types: ["fire"] },
  { id: 79, name: "Slowpoke", types: ["water", "psychic"] },
  { id: 80, name: "Slowbro", types: ["water", "psychic"] },
  { id: 81, name: "Magnemite", types: ["electric", "steel"] },
  { id: 82, name: "Magneton", types: ["electric", "steel"] },
  { id: 83, name: "Farfetch'd", types: ["normal", "flying"] },
  { id: 84, name: "Doduo", types: ["normal", "flying"] },
  { id: 85, name: "Dodrio", types: ["normal", "flying"] },
  { id: 86, name: "Seel", types: ["water"] },
  { id: 87, name: "Dewgong", types: ["water", "ice"] },
  { id: 88, name: "Grimer", types: ["poison"] },
  { id: 89, name: "Muk", types: ["poison"] },
  { id: 90, name: "Shellder", types: ["water"] },
  { id: 91, name: "Cloyster", types: ["water", "ice"] },
  { id: 92, name: "Gastly", types: ["ghost", "poison"] },
  { id: 93, name: "Haunter", types: ["ghost", "poison"] },
  { id: 94, name: "Gengar", types: ["ghost", "poison"] },
  { id: 95, name: "Onix", types: ["rock", "ground"] },
  { id: 96, name: "Drowzee", types: ["psychic"] },
  { id: 97, name: "Hypno", types: ["psychic"] },
  { id: 98, name: "Krabby", types: ["water"] },
  { id: 99, name: "Kingler", types: ["water"] },
  { id: 100, name: "Voltorb", types: ["electric"] },
  { id: 101, name: "Electrode", types: ["electric"] },
  { id: 102, name: "Exeggcute", types: ["grass", "psychic"] },
  { id: 103, name: "Exeggutor", types: ["grass", "psychic"] },
  { id: 104, name: "Cubone", types: ["ground"] },
  { id: 105, name: "Marowak", types: ["ground"] },
  { id: 106, name: "Hitmonlee", types: ["fighting"] },
  { id: 107, name: "Hitmonchan", types: ["fighting"] },
  { id: 108, name: "Lickitung", types: ["normal"] },
  { id: 109, name: "Koffing", types: ["poison"] },
  { id: 110, name: "Weezing", types: ["poison"] },
  { id: 111, name: "Rhyhorn", types: ["ground", "rock"] },
  { id: 112, name: "Rhydon", types: ["ground", "rock"] },
  { id: 113, name: "Chansey", types: ["normal"] },
  { id: 114, name: "Tangela", types: ["grass"] },
  { id: 115, name: "Kangaskhan", types: ["normal"] },
  { id: 116, name: "Horsea", types: ["water"] },
  { id: 117, name: "Seadra", types: ["water"] },
  { id: 118, name: "Goldeen", types: ["water"] },
  { id: 119, name: "Seaking", types: ["water"] },
  { id: 120, name: "Staryu", types: ["water"] },
  { id: 121, name: "Starmie", types: ["water", "psychic"] },
  { id: 122, name: "Mr. Mime", types: ["psychic", "fairy"] },
  { id: 123, name: "Scyther", types: ["bug", "flying"] },
  { id: 124, name: "Jynx", types: ["ice", "psychic"] },
  { id: 125, name: "Electabuzz", types: ["electric"] },
  { id: 126, name: "Magmar", types: ["fire"] },
  { id: 127, name: "Pinsir", types: ["bug"] },
  { id: 128, name: "Tauros", types: ["normal"] },
  { id: 129, name: "Magikarp", types: ["water"] },
  { id: 130, name: "Gyarados", types: ["water", "flying"] },
  { id: 131, name: "Lapras", types: ["water", "ice"] },
  { id: 132, name: "Ditto", types: ["normal"] },
  { id: 133, name: "Eevee", types: ["normal"] },
  { id: 134, name: "Vaporeon", types: ["water"] },
  { id: 135, name: "Jolteon", types: ["electric"] },
  { id: 136, name: "Flareon", types: ["fire"] },
  { id: 137, name: "Porygon", types: ["normal"] },
  { id: 138, name: "Omanyte", types: ["rock", "water"] },
  { id: 139, name: "Omastar", types: ["rock", "water"] },
  { id: 140, name: "Kabuto", types: ["rock", "water"] },
  { id: 141, name: "Kabutops", types: ["rock", "water"] },
  { id: 142, name: "Aerodactyl", types: ["rock", "flying"] },
  { id: 143, name: "Snorlax", types: ["normal"] },
  { id: 144, name: "Articuno", types: ["ice", "flying"] },
  { id: 145, name: "Zapdos", types: ["electric", "flying"] },
  { id: 146, name: "Moltres", types: ["fire", "flying"] },
  { id: 147, name: "Dratini", types: ["dragon"] },
  { id: 148, name: "Dragonair", types: ["dragon"] },
  { id: 149, name: "Dragonite", types: ["dragon", "flying"] },
  { id: 150, name: "Mewtwo", types: ["psychic"] }
];

const STORAGE_KEY = "original-150-pokedex-caught";
const list = document.querySelector("#pokemonList");
const template = document.querySelector("#pokemonCardTemplate");
const caughtCount = document.querySelector("#caughtCount");
const visibleCount = document.querySelector("#visibleCount");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const clearCaughtButton = document.querySelector("#clearCaught");
const emptyState = document.querySelector("#emptyState");

let activeFilter = "all";
let caught = loadCaught();

function loadCaught() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveCaught() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...caught].sort((a, b) => a - b)));
}

function formatNumber(id) {
  return `#${String(id).padStart(3, "0")}`;
}

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function matchesPokemon(pokemon, query) {
  const haystack = [
    pokemon.name,
    String(pokemon.id),
    formatNumber(pokemon.id),
    ...pokemon.types
  ].join(" ").toLowerCase();

  return haystack.includes(query);
}

function filteredPokemon() {
  const query = searchInput.value.trim().toLowerCase();

  return POKEMON.filter((pokemon) => {
    const isCaught = caught.has(pokemon.id);
    const passesFilter =
      activeFilter === "all" ||
      (activeFilter === "caught" && isCaught) ||
      (activeFilter === "missing" && !isCaught);

    return passesFilter && (!query || matchesPokemon(pokemon, query));
  });
}

function render() {
  const pokemonToShow = filteredPokemon();
  list.replaceChildren();

  for (const pokemon of pokemonToShow) {
    const card = template.content.cloneNode(true);
    const button = card.querySelector(".catch-toggle");
    const image = card.querySelector("img");
    const number = card.querySelector(".pokemon-number");
    const name = card.querySelector(".pokemon-name");
    const typeRow = card.querySelector(".type-row");
    const caughtPill = card.querySelector(".caught-pill");
    const isCaught = caught.has(pokemon.id);

    button.dataset.id = pokemon.id;
    button.setAttribute("aria-pressed", String(isCaught));
    button.setAttribute("aria-label", `${isCaught ? "Mark" : "Catch"} ${pokemon.name}`);
    image.src = spriteUrl(pokemon.id);
    image.alt = `${pokemon.name} sprite`;
    number.textContent = formatNumber(pokemon.id);
    name.textContent = pokemon.name;
    caughtPill.textContent = isCaught ? "Caught" : "Catch";

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
}

list.addEventListener("click", (event) => {
  const button = event.target.closest(".catch-toggle");

  if (!button) return;

  const id = Number(button.dataset.id);
  if (caught.has(id)) {
    caught.delete(id);
  } else {
    caught.add(id);
  }

  saveCaught();
  render();
});

searchInput.addEventListener("input", render);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

clearCaughtButton.addEventListener("click", () => {
  caught = new Set();
  saveCaught();
  render();
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js");
}

render();
