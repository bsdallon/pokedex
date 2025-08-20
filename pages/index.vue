<template>
  <div class="container">
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        class="search-input"
        placeholder="Search Pokémon..."
        @input="handleSearch"
      >
    </div>

    <div v-if="store.isLoading" class="loading">
      Loading Pokémon...
    </div>

    <div v-else class="pokemon-grid">
      <PokemonCard
        v-for="pokemon in store.filteredPokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePokemonStore } from '~/stores/pokemon';

const store = usePokemonStore();
const searchQuery = ref('');

onMounted(() => {
  store.fetchPokemons();
});

const handleSearch = () => {
  store.setSearchQuery(searchQuery.value);
};
</script>