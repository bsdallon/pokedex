<template>
  <div class="container">
    <div v-if="isPageLoading" class="loading-wrapper">
      <LoadingPokeballs />
    </div>

    <div v-else>
      <div class="search-container">
        <div class="search-controls">
          <div class="search-input-wrapper">
            <input
              type="text"
              v-model="searchQuery"
              class="search-input"
              placeholder="Search by Pokemon name or ID"
              @input="handleSearch"
            >
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="clear-search"
              title="Clear search"
            >
              ×
            </button>
            <button 
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="filter-toggle"
              :class="{ 'active': showAdvancedFilters }"
              title="Toggle filters"
            >
              <span class="material-icons">filter_list</span>
            </button>
          </div>
          <div class="advanced-filters" :class="{ 'show': showAdvancedFilters }">
            <div class="advanced-filters-content">
              <div class="top-filters">
                <div class="filter-half">
                  <label for="range-min">ID Range</label>
                  <div class="range-inputs">
                    <input
                      id="range-min"
                      type="number"
                      v-model.string="rangeMin"
                      :min="MIN_POKEMON_ID"
                      :max="MAX_POKEMON_ID"
                      @input="handleRangeInput"
                      @blur="handleRangeBlur"
                      class="range-input"
                      :placeholder="MIN_POKEMON_ID.toString()"
                    >
                    <span>-</span>
                    <input
                      id="range-max"
                      type="number"
                      v-model.string="rangeMax"
                      :min="MIN_POKEMON_ID"
                      :max="MAX_POKEMON_ID"
                      @input="handleRangeInput"
                      @blur="handleRangeBlur"
                      class="range-input"
                      :placeholder="MAX_POKEMON_ID.toString()"
                    >
                  </div>
                </div>

                <div class="filter-half">
                  <label for="generation-select">Generation</label>
                  <select 
                    id="generation-select"
                    v-model="selectedGeneration" 
                    class="generation-select"
                    @change="handleGenerationChange"
                  >
                    <option value="">All Generations</option>
                    <option 
                      v-for="(gen, key) in store.$state.generations" 
                      :key="key"
                      :value="key"
                    >
                      {{ gen.name }} (#{{ gen.range[0] }}-{{ gen.range[1] }})
                    </option>
                  </select>
                </div>
              </div>

              <div class="type-filter-container">
                <div class="type-filter-header">
                  <TypeFilterToggle v-model="filterMode" />
                  <span class="type-hint">(max 2 types)</span>
                </div>
                <div class="type-buttons">
                  <button
                    v-for="type in store.pokemonTypes"
                    :key="type"
                    :class="[
                      'type-button',
                      `type-${type}`,
                      { 'type-selected': store.$state.selectedTypes.includes(type) }
                    ]"
                    @click="handleTypeToggle(type)"
                    :disabled="store.$state.selectedTypes.length >= 2 && !store.$state.selectedTypes.includes(type)"
                  >
                    {{ formatType(type) }}
                  </button>
                </div>
              </div>

              <button 
                class="reset-filters-button" 
                @click="resetAdvancedFilters"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in store.filteredPokemons"
          :key="pokemon.id"
          :pokemon="{ ...pokemon, types: pokemon.types ?? [] }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePokemonStore } from '~/stores/pokemon';
import { useLoadingStore } from '~/stores/loading';

// Add a client-only directive for Vue to prevent hydration mismatch
// which can cause the flash of content
useHead({
  script: [
    {
      innerHTML: `
        // Hide content until Vue is ready
        document.documentElement.classList.add('loading');
      `,
      type: 'text/javascript',
    }
  ]
});

const MIN_POKEMON_ID = 1;
const MAX_POKEMON_ID = 1025;

const store = usePokemonStore();
const loadingStore = useLoadingStore();
const isPageLoading = ref(true); // Keep local loading state for component-specific elements
const searchQuery = ref('');
const selectedType = ref('');
const selectedGeneration = ref('');
const rangeMin = ref(store.$state.rangeMin.toString());
const rangeMax = ref(store.$state.rangeMax.toString());
const showAdvancedFilters = ref(false);
const filterMode = computed({
  get: () => store.$state.filterMode,
  set: (value: 'type' | 'weakness') => store.$state.filterMode = value
});

onMounted(async () => {
  // Start with loading state
  isPageLoading.value = true;
  loadingStore.startLoading();
  
  try {
    // Wait for data to be ready
    await store.fetchPokemons();
    
    // Set loading to false only after data is loaded
    setTimeout(() => {
      // Remove loading class from HTML to show content
      document.documentElement.classList.remove('loading');
      // Set loading state to false for both local and global stores
      isPageLoading.value = false;
      loadingStore.finishLoading();
    }, 200); // Small delay to ensure everything is ready
  } catch (error) {
    console.error('Error loading data:', error);
    isPageLoading.value = false;
    loadingStore.finishLoading();
    document.documentElement.classList.remove('loading');
  }
});

const handleSearch = () => {
  store.setSearchQuery(searchQuery.value);
};

const handleTypeToggle = (type: string) => {
  store.toggleType(type);
};

const handleRangeInput = () => {
  // If there was a generation selected, clear it since we're manually changing the range
  if (selectedGeneration.value) {
    selectedGeneration.value = '';
    store.setGeneration('');
  }

  // Convert to numbers, allowing empty values
  const min = rangeMin.value === '' ? null : parseInt(rangeMin.value.toString());
  const max = rangeMax.value === '' ? null : parseInt(rangeMax.value.toString());
  
  // Only update store if we have valid numbers
  if (min !== null || max !== null) {
    store.setRange(min ?? store.$state.rangeMin, max ?? store.$state.rangeMax);
  }
};

const handleRangeBlur = () => {
  // Set default values only when blurring with empty values
  if (rangeMin.value === '') {
    rangeMin.value = MIN_POKEMON_ID.toString();
  }
  if (rangeMax.value === '') {
    rangeMax.value = MAX_POKEMON_ID.toString();
  }

  // Now update the store with the final values
  const min = parseInt(rangeMin.value);
  const max = parseInt(rangeMax.value);
  store.setRange(min, max);

  // Update with clamped values
  rangeMin.value = store.$state.rangeMin.toString();
  rangeMax.value = store.$state.rangeMax.toString();
};

const formatType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const clearSearch = () => {
  searchQuery.value = '';
  store.setSearchQuery('');
};

const handleGenerationChange = () => {
  store.setGeneration(selectedGeneration.value as keyof typeof store.$state.generations | '');
  if (selectedGeneration.value === '') {
    // Set range to full range for All Generations
    rangeMin.value = MIN_POKEMON_ID.toString();
    rangeMax.value = MAX_POKEMON_ID.toString();
    store.setRange(MIN_POKEMON_ID, MAX_POKEMON_ID);
  } else {
    // Update the range inputs to match the selected generation range
    rangeMin.value = store.$state.rangeMin.toString();
    rangeMax.value = store.$state.rangeMax.toString();
  }
};

const resetAdvancedFilters = () => {
  // Reset type filter
  store.$state.selectedTypes = [];
  
  // Reset generation filter
  selectedGeneration.value = '';
  
  // Reset range filter to defaults (showing first 60 Pokémon)
  rangeMin.value = MIN_POKEMON_ID.toString();
  rangeMax.value = '60';
  store.setRange(MIN_POKEMON_ID, 60);
};
</script>

<style scoped>
.top-filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.filter-half {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  width: 80px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  background-color: #fff;
  color: #333;
}

.generation-select {
  width: auto;
  min-width: 200px;
  padding: 0.75rem 2rem 0.75rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666666' d='M6 8.825L1.175 4 2.238 2.937 6 6.7l3.762-3.763L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

.filter-half label {
  color: #444;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>

<style scoped>
.search-container {
  margin-bottom: 2rem;
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

/* Filter toggle style */
.filter-toggle {
  position: absolute;
  right: 1px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  width: 40px;
  height: calc(100% - 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #eee;
  border-radius: 0 4px 4px 0;
  margin-right: 1px;
  user-select: none;
}

.filter-toggle:hover {
  background-color: #e0e0e0;
}

.type-select-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-select,
.generation-select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #FFFFFF;
  color: #333333;
}

/* Filter styles moved to search.css */

.range-input:focus {
  outline: none;
  border-color: #007AFF;
}

/* Advanced Filters Styles */
.advanced-filters {
  width: 100%;
  margin-top: 0;
}

.advanced-filters-toggle {
  width: 100%;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #333;
}

.advanced-filters-toggle:hover {
  background-color: #e8e8e8;
}

.toggle-icon {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.advanced-filters-content {
  padding: 1rem;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: #fff;
}

/* Labels for filters */
.type-select-container label,
.range-filter label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

/* Add a consistent hover effect to all interactive elements */
.search-input:focus {
  outline: none;
  border-color: #007AFF;
}

.type-filter-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.type-filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.type-hint {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.type-buttons {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
  margin: 0.5rem 0;
  padding: 0;
  width: 100%;
}

.type-button {
  width: 100%;
  padding: 0.35rem 0.25rem;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  transition: all 0.2s ease;
  user-select: none;
  text-align: center;
  min-width: 48px;
  line-height: 1.2;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.type-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.type-button:hover::before {
  opacity: 1;
}

.type-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.type-selected {
  transform: scale(1.03);
  box-shadow: 
    0 0 0 1.5px white,
    0 0 0 3px #0075BE,
    0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  filter: brightness(1.05) contrast(1.05);
}

.type-selected::before {
  display: none;
}

.type-button:disabled {
  opacity: 0.5;
  cursor: default;
  transform: none;
}

.type-button:disabled::before,
.type-button:disabled::after {
  display: none;
}

/* Type button colors */
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