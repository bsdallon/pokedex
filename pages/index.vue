<template>
  <div class="container" v-cloak>
    <div class="search-container">
      <div class="search-controls">
        <SearchBar
          v-model:searchQuery="searchQuery"
          v-model:showFilters="showAdvancedFilters"
        />
        
        <AdvancedFilters
          :show="showAdvancedFilters"
          v-model:rangeMin="rangeMin"
          v-model:rangeMax="rangeMax"
          v-model:selectedGeneration="selectedGeneration"
          v-model:filterMode="filterMode"
          v-model:selectedTypes="store.$state.selectedTypes"
          :generations="store.allGenerations"
          :pokemonTypes="store.pokemonTypes"
          @resetFilters="resetAdvancedFilters"
        />
      </div>
    </div>
    
    <div class="sort-container">
      <SortOptions 
        v-model:sortOption="store.sortOption"
      />
    </div>
      
    <ErrorBoundary>
      <div class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in store.filteredPokemons"
          :key="pokemon.id"
          v-memo="[pokemon.id, pokemon.name, pokemon.types]"
          :pokemon="{ ...pokemon, types: pokemon.types ?? [] }"
        />
      </div>
      <template #fallback="{ error, retry }">
        <div class="error-message">
          <img 
            src="~/assets/images/pokemon_not_found.png" 
            alt="Pokemon not found" 
            class="error-message__image"
          />
          <h3>Oh no! We could not find that Pokémon!</h3>
          <p>{{ error.message || 'Try adjusting your search filters' }}</p>
          <button @click="retry" class="error-message__button">Go Back</button>
        </div>
      </template>
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { usePokemonStore } from '~/stores/pokemon';
import { useErrorStore } from '~/stores/error';
import SearchBar from '~/components/SearchBar.vue';
import AdvancedFilters from '~/components/AdvancedFilters.vue';
import SortOptions from '~/components/SortOptions.vue';
import ErrorBoundary from '~/components/ErrorBoundary.vue';

const MIN_POKEMON_ID = 1;
const MAX_POKEMON_ID = 1025;

const store = usePokemonStore();
const searchQuery = ref('');
const selectedGeneration = ref('');
const rangeMin = ref(store.$state.rangeMin.toString());
const rangeMax = ref(store.$state.rangeMax.toString());
const showAdvancedFilters = ref(false);
const filterMode = computed({
  get: () => store.$state.filterMode,
  set: (value: 'type' | 'weakness') => store.$state.filterMode = value
});

const errorStore = useErrorStore();

onMounted(async () => {
  try {
    await store.fetchPokemons();
  } catch (error: any) {
    console.error('Error loading data:', error);
    errorStore.addError(
      error instanceof Error ? error : 'Failed to load Pokemon data', 
      error?.message || 'An unexpected error occurred'
    );
  }
});

watch(() => searchQuery.value, (newQuery) => {
  store.setSearchQuery(newQuery);
});

watch(() => rangeMin.value, (newValue) => {
  const min = parseInt(newValue || MIN_POKEMON_ID.toString());
  store.setRange(min, parseInt(rangeMax.value));
});

watch(() => rangeMax.value, (newValue) => {
  const max = parseInt(newValue || MAX_POKEMON_ID.toString());
  store.setRange(parseInt(rangeMin.value), max);
});

watch(() => selectedGeneration.value, (newValue) => {
  store.setGeneration(newValue);
  if (newValue === '' || newValue === 'all') {
    rangeMin.value = MIN_POKEMON_ID.toString();
    rangeMax.value = MAX_POKEMON_ID.toString();
    store.setRange(MIN_POKEMON_ID, MAX_POKEMON_ID);
  } else {
    rangeMin.value = store.$state.rangeMin.toString();
    rangeMax.value = store.$state.rangeMax.toString();
  }
});

const resetAdvancedFilters = () => {
  store.$state.selectedTypes = [];
  selectedGeneration.value = '';
  rangeMin.value = MIN_POKEMON_ID.toString();
  rangeMax.value = '60';
  store.setRange(MIN_POKEMON_ID, 60);
};
</script>

<style scoped>
.filter-toggle .material-icons {
  line-height: 1;
  font-size: 1.7rem;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  top: 2px;
}
html, body {
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

.container {
  width: 100%;
  min-height: calc(100vh - var(--header-height, 60px));
  padding-top: var(--header-height, 60px);
  box-sizing: border-box;
}

.search-container {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: var(--background-color, #fff);
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 2.5rem;
  background-color: #FFFFFF;
  color: #333333;
}

.clear-search {
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  user-select: none;
}

.clear-search:hover {
  background-color: #e0e0e0;
}

.filter-toggle {
  position: absolute;
  right: 1px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: none;
  border-radius: 0 6px 6px 0;
  font-size: 1.5rem;
  color: #666;
  width: 44px;
  min-width: 44px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
  outline: none;
  padding: 0;
}
.filter-toggle:focus, .filter-toggle:hover {
  background: #e0e0e0;
}

.filter-toggle:hover {
  background-color: #e0e0e0;
}

.type-button:disabled::before,
.type-button:disabled::after {
  display: none;
}

.type-button.type-normal { background-color: #A8A878; }
.type-button.type-fire { background-color: #F08030; }
.type-button.type-water { background-color: #6890F0; }
.type-button.type-electric { background-color: #F8D030; }
.type-button.type-grass { background-color: #78C850; }
.type-button.type-ice { background-color: #98D8D8; }
.type-button.type-fighting { background-color: #C03028; }
.type-button.type-poison { background-color: #A040A0; }
.type-button.type-ground { background-color: #E0C068; }
.type-button.type-flying { background-color: #A890F0; }
.type-button.type-psychic { background-color: #F85888; }
.type-button.type-bug { background-color: #A8B820; }
.type-button.type-rock { background-color: #B8A038; }
.type-button.type-ghost { background-color: #705898; }
.type-button.type-dragon { background-color: #7038F8; }
.type-button.type-dark { background-color: #705848; }
.type-button.type-steel { background-color: #B8B8D0; }
.type-button.type-fairy { background-color: #EE99AC; }

/* Prevent flash of unstyled content */
html.loading .container > *:not(.loading-wrapper) {
  display: none;
}

[v-cloak] {
  display: none;
}

/* Fade-in transition for the content */
.container > div:not(.loading-wrapper) {
  animation: fadein 0.5s;
}

@keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>