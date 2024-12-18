class PokemonApp {
    constructor() {
        this.pages = {
            typesPage: document.getElementById("types-page"),
            pokemonsPage: document.getElementById("pokemons-page"),
            detailsPage: document.getElementById("details-page")
        };

        this.containers = {
            typesContainer: document.getElementById("types-container"),
            pokemonsContainer: document.getElementById("pokemons-container"),
            detailsContainer: document.getElementById("details-container")
        };

        this.init();
    }

    // Initialisation de l'application
    init() {
        this.fetchPokemonTypes();

        // Gestionnaires d'événements
        document.getElementById("search-types").addEventListener("input", () => this.searchTypes());
        document.getElementById("search-pokemons").addEventListener("input", () => this.searchPokemons());
        document.getElementById("back-to-types").addEventListener("click", () => this.goBack());
        document.getElementById("back-to-pokemons").addEventListener("click", () => this.goBack());
    }

    // Afficher une page spécifique
    showPage(pageToShow) {
        Object.values(this.pages).forEach(page => page.classList.remove("active"));
        pageToShow.classList.add("active");
    }

    // Retour à la page précédente
    goBack() {
        if (this.pages.detailsPage.classList.contains("active")) {
            this.showPage(this.pages.pokemonsPage);
        } else {
            this.showPage(this.pages.typesPage);
        }
    }

    // Charger les types de Pokémon
    async fetchPokemonTypes() {
        const response = await fetch("https://pokeapi.co/api/v2/type?offset=0&limit=21");
        const data = await response.json();

        this.containers.typesContainer.innerHTML = "";
        data.results.forEach(type => {
            const button = document.createElement("button");
            button.textContent = type.name;
            button.onclick = () => this.fetchPokemonsByType(type.url);
            this.containers.typesContainer.appendChild(button);
        });
    }

    // Charger les Pokémon selon le type
    async fetchPokemonsByType(url) {
        const response = await fetch(url);
        const data = await response.json();

        this.containers.pokemonsContainer.innerHTML = "";
        data.pokemon.forEach(entry => {
            const pokemon = entry.pokemon;

            const card = document.createElement("div");
            card.classList.add("card");

            fetch(pokemon.url)
                .then(response => response.json())
                .then(pokemonData => {
                    const image = document.createElement("img");
                    image.src = pokemonData.sprites.front_default;
                    image.alt = pokemon.name;

                    const name = document.createElement("p");
                    name.textContent = pokemon.name;

                    card.appendChild(image);
                    card.appendChild(name);
                });

            card.onclick = () => this.fetchPokemonDetails(pokemon.url);
            this.containers.pokemonsContainer.appendChild(card);
        });

        this.showPage(this.pages.pokemonsPage);
    }

    // Charger les détails d'un Pokémon
    async fetchPokemonDetails(url) {
        const response = await fetch(url);
        const data = await response.json();

        const soundUrl = `https://play.pokemonshowdown.com/audio/cries/${data.name.toLowerCase()}.mp3`;

        this.containers.detailsContainer.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${data.sprites.other.dream_world.front_default || data.sprites.front_default}" alt="${data.name}">
            <audio controls>
                <source src="${soundUrl}" type="audio/mpeg">
                Votre navigateur ne supporte pas l'audio.
            </audio>
            <table class="details-table">
                <tr><th>Statistique</th><th>Valeur</th></tr>
                <tr><td>HP</td><td>${data.stats[0].base_stat}</td></tr>
                <tr><td>Attaque</td><td>${data.stats[1].base_stat}</td></tr>
                <tr><td>Défense</td><td>${data.stats[2].base_stat}</td></tr>
                <tr><td>Taille</td><td>${data.height}</td></tr>
                <tr><td>Poids</td><td>${data.weight}</td></tr>
            </table>
        `;

        this.showPage(this.pages.detailsPage);
    }

    // Recherche pour les types
    searchTypes() {
        const searchValue = document.getElementById("search-types").value.toLowerCase();
        const buttons = this.containers.typesContainer.querySelectorAll("button");

        buttons.forEach(button => {
            if (button.textContent.toLowerCase().includes(searchValue)) {
                button.style.display = "block";
            } else {
                button.style.display = "none";
            }
        });
    }

    // Recherche pour les Pokémon
    searchPokemons() {
        const searchValue = document.getElementById("search-pokemons").value.toLowerCase();
        const cards = this.containers.pokemonsContainer.querySelectorAll(".card");

        cards.forEach(card => {
            const pokemonName = card.querySelector("p").textContent.toLowerCase();
            if (pokemonName.includes(searchValue)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }
}

// Lancer l'application
const app = new PokemonApp();
