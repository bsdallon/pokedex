<!--Home-->
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
              src="/assets/images/pokemon_not_found.png"
              alt="No results"
              style="width: 80px; opacity: 0.7; margin-bottom: 0.5rem"
            />
            <div class="no-results-text">
              No Pokémon found. Try a different search or adjust your filters.
            </div>
          </div>
        </template>
      </div>
      <template #fallback="{ error, retry }">
        <div class="error-message">
          <img
            src="/assets/images/pokemon_not_found.png"
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

  // Helper to notify header for type theme
  function notifyTypeThemeUpdate() {
    if (typeof window !== 'undefined') {
      // Debug log selectedTypes and store.selectedTypes
      // @ts-ignore
      if (window.__NUXT__ && window.__NUXT__.data && window.__NUXT__.data[0]?.store) {
        console.log(
          '[TypeTheme][index.vue] selectedTypes:',
          selectedTypes.value,
          'store.selectedTypes:',
          window.__NUXT__.data[0].store.selectedTypes
        )
      }
      window.dispatchEvent(new Event('type-theme-update'))
    }
  }

  watch(
    selectedTypes,
    (val) => {
      store.selectedTypes = [...val]
      notifyTypeThemeUpdate()
    },
    { deep: true }
  )

  watch(
    () => store.$state.selectedTypes,
    (val) => {
      if (JSON.stringify(selectedTypes.value) !== JSON.stringify(val)) {
        selectedTypes.value = [...val]
        notifyTypeThemeUpdate()
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
      notifyTypeThemeUpdate()
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
      notifyTypeThemeUpdate()
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
      if (newValue === 'all') {
        rangeMin.value = MIN_POKEMON_ID.toString()
        rangeMax.value = MAX_POKEMON_ID.toString()
        store.setRange(MIN_POKEMON_ID, MAX_POKEMON_ID)
      } else if (newValue) {
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
    searchQuery.value = ''
    rangeMin.value = MIN_POKEMON_ID.toString()
    rangeMax.value = '60'
    store.setRange(MIN_POKEMON_ID, 60)
    store.setSearchQuery('')
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
    color: #222;
    font-size: 1rem;
    font-weight: 600;
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
  .no-results-text {
    color: #222;
    font-weight: 600;
    font-size: 1.15rem;
    margin-top: 0.5rem;
  }
</style>
