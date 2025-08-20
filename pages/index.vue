<template>
  <div class="container">
    <div class="search-container">
      <div class="search-controls">
        <div class="search-input-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Search by name or ID (e.g. Bulbasaur or #001)"
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
        </div>
        <div class="advanced-filters">
          <button 
            class="advanced-filters-toggle" 
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            {{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters
            <span class="toggle-icon">{{ showAdvancedFilters ? '▼' : '▶' }}</span>
          </button>
          
          <div v-show="showAdvancedFilters" class="advanced-filters-content">
            <div class="type-filter-container">
              <label>Type Filter: <span class="type-hint">(max 2 types)</span></label>
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

            <div class="generation-filter">
              <label for="generation-select">Generation:</label>
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

            <div class="range-filter">
              <label>ID Range Filter:</label>
              <div class="range-inputs">
                <input
                  type="number"
                  v-model.string="rangeMin"
                  min="1"
                  max="1025"
                  @input="handleRangeChange"
                  class="range-input"
                  placeholder="Min"
                >
                <span>-</span>
                <input
                  type="number"
                  v-model.string="rangeMax"
                  min="1"
                  max="1025"
                  @input="handleRangeChange"
                  class="range-input"
                  placeholder="Max"
                >
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

    <LoadingPokeballs v-if="store.isLoading" />

    <div v-else class="pokemon-grid">
      <PokemonCard
        v-for="pokemon in store.filteredPokemons"
        :key="pokemon.id"
        :pokemon="{ ...pokemon, types: pokemon.types ?? [] }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePokemonStore } from '~/stores/pokemon';

const store = usePokemonStore();
const searchQuery = ref('');
const selectedType = ref('');
const selectedGeneration = ref('');
const rangeMin = ref(store.$state.rangeMin.toString());
const rangeMax = ref(store.$state.rangeMax.toString());
const showAdvancedFilters = ref(false);

onMounted(() => {
  store.fetchPokemons();
});

const handleSearch = () => {
  store.setSearchQuery(searchQuery.value);
};

const handleTypeToggle = (type: string) => {
  store.toggleType(type);
};

const handleRangeChange = () => {
  // If there was a generation selected, clear it since we're manually changing the range
  if (selectedGeneration.value) {
    selectedGeneration.value = '';
    store.setGeneration('');
  }

  // Convert to numbers, allowing for empty values
  const min = rangeMin.value === '' ? null : parseInt(rangeMin.value.toString());
  const max = rangeMax.value === '' ? null : parseInt(rangeMax.value.toString());
  
  // Only update store if we have final valid numbers
  if (min !== null || max !== null) {
    // Call store method to set and clamp values
    store.setRange(min, max);
    
    // If both values are filled, update to the clamped values
    if (min !== null && max !== null) {
      rangeMin.value = store.$state.rangeMin.toString();
      rangeMax.value = store.$state.rangeMax.toString();
    }
  }
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
  // Update the range inputs to match the generation range
  if (selectedGeneration.value) {
    rangeMin.value = store.$state.rangeMin.toString();
    rangeMax.value = store.$state.rangeMax.toString();
  }
};

const resetAdvancedFilters = () => {
  // Reset type filter
  store.$state.selectedTypes = [];
  
  // Reset generation filter
  selectedGeneration.value = '';
  
  // Reset range filter to defaults
  rangeMin.value = '1';
  rangeMax.value = '60';
  store.setRange(1, 60);
};
</script>

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
}

.clear-search {
  position: absolute;
  right: 0.5rem;
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
  background-color: white;
}

.generation-filter {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.range-filter {
  margin-top: 0.5rem;
  width: 100%;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.range-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
}

.range-input:focus {
  outline: none;
  border-color: #007AFF;
}

/* Advanced Filters Styles */
.advanced-filters {
  width: 100%;
  margin-top: 1rem;
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

.reset-filters-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #9c27b0;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  user-select: none;
}

.reset-filters-button:hover {
  background-color: #7b1fa2;
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
  gap: 1rem;
}

.type-hint {
  font-size: 0.8rem;
  color: #666;
}

.type-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.type-button {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 0.9rem;
  text-transform: capitalize;
  transition: opacity 0.2s ease;
  user-select: none;
}

.type-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.type-selected {
  outline: 3px solid rgba(255, 255, 255, 0.5);
  outline-offset: -3px;
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
</style>