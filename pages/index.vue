<template>
  <div class="container" v-cloak>
    <div class="search-container">
      <div class="search-controls">
        <SearchBar v-model:searchQuery="searchQuery" v-model:showFilters="showAdvancedFilters" />

        <AdvancedFilters
          :show="showAdvancedFilters"
          v-model:rangeMin="rangeMin"
          v-model:rangeMax="rangeMax"
          v-model:selectedGeneration="selectedGeneration"
          v-model:filterMode="filterMode"
          v-model:selectedTypes="selectedTypes"
          :generations="store.allGenerations"
          :pokemonTypes="store.pokemonTypes"
          @resetFilters="resetAdvancedFilters"
        />
      </div>
    </div>

    <div class="sort-container flex-sort-row">
      <div class="showing-count">
        Showing: {{ store.filteredPokemons.filter((p) => p && p.id).length }}
      </div>
      <div class="sort-options-wrapper">
        <SortOptions v-model:sortOption="store.sortOption" />
      </div>
    </div>

    <ErrorBoundary>
      <div class="pokemon-grid">
        <template v-if="store.filteredPokemons.length > 0">
          <PokemonCard
            v-for="pokemon in store.filteredPokemons.filter((p) => p && p.id)"
            :key="pokemon.id"
            :pokemon="{ ...pokemon, types: pokemon.types ?? [] }"
          />
        </template>
        <template v-else>
          <div class="no-results-message">
            <img
              src="~/assets/images/pokemon_not_found.png"
              alt="No results"
              style="width: 80px; opacity: 0.7; margin-bottom: 0.5rem"
            />
            <div>No Pokémon found. Try a different search or adjust your filters.</div>
          </div>
        </template>
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
  import { ref, computed, watch, onMounted } from 'vue'
  import { usePokemonStore } from '../stores/pokemon'
  import { useErrorStore } from '../stores/error'
  import SearchBar from '../components/SearchBar.vue'
  import AdvancedFilters from '../components/AdvancedFilters.vue'
  import SortOptions from '../components/SortOptions.vue'
  import ErrorBoundary from '../components/ErrorBoundary.vue'

  const MIN_POKEMON_ID = 1
  const MAX_POKEMON_ID = 1025

  const store = usePokemonStore()
  const searchQuery = ref('')
  const selectedGeneration = ref('')
  const selectedTypes = ref([...store.$state.selectedTypes])
  // Sync selectedTypes with store
  watch(
    selectedTypes,
    (val) => {
      store.selectedTypes = [...val]
    },
    { deep: true }
  )

  watch(
    () => store.$state.selectedTypes,
    (val) => {
      if (JSON.stringify(selectedTypes.value) !== JSON.stringify(val)) {
        selectedTypes.value = [...val]
      }
    },
    { deep: true }
  )
  const rangeMin = ref(store.$state.rangeMin.toString())
  const rangeMax = ref(store.$state.rangeMax.toString())
  const showAdvancedFilters = ref(false)
  const filterMode = computed({
    get: () => store.$state.filterMode,
    set: (value: 'type' | 'weakness') => (store.$state.filterMode = value),
  })

  const errorStore = useErrorStore()

  onMounted(async () => {
    try {
      await store.fetchPokemons()
    } catch (error: any) {
      console.error('Error loading data:', error)
      errorStore.addError(
        error instanceof Error ? error : 'Failed to load Pokemon data',
        error?.message || 'An unexpected error occurred'
      )
    }
  })

  watch(
    () => searchQuery.value,
    (newQuery) => {
      store.setSearchQuery(newQuery)
      if (newQuery === '') {
        rangeMin.value = MIN_POKEMON_ID.toString()
        rangeMax.value = MAX_POKEMON_ID.toString()
        store.setRange(MIN_POKEMON_ID, MAX_POKEMON_ID)
      }
    }
  )

  watch(
    () => rangeMin.value,
    (newValue) => {
      const min = parseInt(newValue || MIN_POKEMON_ID.toString())
      store.setRange(min, parseInt(rangeMax.value))
    }
  )

  watch(
    () => rangeMax.value,
    (newValue) => {
      const max = parseInt(newValue || MAX_POKEMON_ID.toString())
      store.setRange(parseInt(rangeMin.value), max)
    }
  )

  watch(
    () => selectedGeneration.value,
    (newValue) => {
      store.setGeneration(newValue)
      if (newValue && newValue !== 'all') {
        const gen = store.allGenerations[newValue]
        if (gen) {
          rangeMin.value = gen.range[0].toString()
          rangeMax.value = gen.range[1].toString()
          store.setRange(gen.range[0], gen.range[1])
        }
      }
    }
  )

  watch(
    () => store.$state.selectedTypes.length,
    (len) => {
      if (len === 0) {
        store.setRange(parseInt(rangeMin.value), parseInt(rangeMax.value))
      }
    }
  )

  const resetAdvancedFilters = () => {
    store.$state.selectedTypes = []
    selectedGeneration.value = ''
    rangeMin.value = MIN_POKEMON_ID.toString()
    rangeMax.value = '60'
    store.setRange(MIN_POKEMON_ID, 60)
  }
</script>

<style scoped>
  .flex-sort-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .search-controls {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    box-sizing: border-box;
  }

  .showing-count {
    color: #888;
    font-size: 0.98rem;
    min-width: 120px;
    text-align: left;
    align-self: flex-end;
    padding-bottom: 2px;
  }

  .sort-options-wrapper {
    margin-left: auto;
  }

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
  html,
  body {
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
    gap: 0;
    width: 100%;
  }

  .sort-container {
    margin-bottom: 1.25rem;
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
    background-color: #ffffff;
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
  .filter-toggle:focus,
  .filter-toggle:hover {
    background: #e0e0e0;
  }

  .filter-toggle:hover {
    background-color: #e0e0e0;
  }

  .type-button:disabled::before,
  .type-button:disabled::after {
    display: none;
  }

  .type-button.type-normal {
    background-color: #a8a878;
  }
  .type-button.type-fire {
    background-color: #f08030;
  }
  .type-button.type-water {
    background-color: #6890f0;
  }
  .type-button.type-electric {
    background-color: #f8d030;
  }
  .type-button.type-grass {
    background-color: #78c850;
  }
  .type-button.type-ice {
    background-color: #98d8d8;
  }
  .type-button.type-fighting {
    background-color: #c03028;
  }
  .type-button.type-poison {
    background-color: #a040a0;
  }
  .type-button.type-ground {
    background-color: #e0c068;
  }
  .type-button.type-flying {
    background-color: #a890f0;
  }
  .type-button.type-psychic {
    background-color: #f85888;
  }
  .type-button.type-bug {
    background-color: #a8b820;
  }
  .type-button.type-rock {
    background-color: #b8a038;
  }
  .type-button.type-ghost {
    background-color: #705898;
  }
  .type-button.type-dragon {
    background-color: #7038f8;
  }
  .type-button.type-dark {
    background-color: #705848;
  }
  .type-button.type-steel {
    background-color: #b8b8d0;
  }
  .type-button.type-fairy {
    background-color: #ee99ac;
  }

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
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
