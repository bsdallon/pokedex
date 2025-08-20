<template>
  <div class="container">
    <div class="pokemon-profile" v-if="pokemon">
      <div class="pokemon-profile-header">
        <div class="pokemon-profile-image">
          <img 
            :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
            :alt="pokemon.name"
          >
        </div>
        <div class="pokemon-profile-info">
          <h1>{{ formatName(pokemon.name) }}</h1>
          <div class="pokemon-stats">
            <div class="stat-item">
              <div class="stat-label">Height</div>
              <div>{{ (pokemon.height / 10).toFixed(1) }}m</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Weight</div>
              <div>{{ (pokemon.weight / 10).toFixed(1) }}kg</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Abilities</div>
              <div>{{ formatAbilities(pokemon.abilities) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/types/pokemon';

const route = useRoute();
const pokemon = ref<Pokemon | null>(null);

const formatName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const formatAbilities = (abilities: Pokemon['abilities']): string => {
  return abilities
    .map(a => formatName(a.ability.name))
    .join(', ');
};

onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    pokemon.value = await $fetch<Pokemon>(`${config.public.apiBase}/pokemon/${route.params.id}`);
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
  }
});
</script>
