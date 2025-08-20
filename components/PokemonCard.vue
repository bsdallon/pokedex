<!-- Pokemon Card Component -->
<template>
  <NuxtLink :to="`/pokemon/${pokemon.id}`" class="pokemon-card">
    <div class="pokemon-image">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
    </div>
    <div class="pokemon-info">
      <h3>{{ formatName(pokemon.name) }}</h3>
      <p>#{{ String(pokemon.id).padStart(3, '0') }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

const props = defineProps<{
  pokemon: Pokemon;
}>();

const formatName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};
</script>

<style scoped>
.pokemon-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  display: block;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-image {
  background-color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.pokemon-image img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.pokemon-info {
  text-align: center;
}

.pokemon-info h3 {
  margin: 0;
  color: #333;
}

.pokemon-info p {
  margin: 0.25rem 0 0;
  color: #666;
}
</style>
