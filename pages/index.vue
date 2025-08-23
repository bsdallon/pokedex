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

const handleSearch = () => {
  store.setSearchQuery(searchQuery.value);
};

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