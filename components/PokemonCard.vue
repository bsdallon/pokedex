<!-- Pokemon Card Component -->
<template>
  <NuxtLink :to="`/pokemon/${pokemon.id}`" class="pokemon-card">
    <div class="pokemon-header">
      <span class="pokemon-number">#{{ formatId(pokemon.id) }}</span>
    </div>
    <div class="pokemon-image">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
    </div>
    <div class="pokemon-info">
      <h3 class="pokemon-name">{{ formatName(pokemon.name) }}</h3>
      <div class="pokemon-types">
        <span 
          v-for="type in pokemon.types" 
          :key="type.type.name"
          :class="['type-badge', `type-${type.type.name}`]"
        >
          {{ formatName(type.type.name) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface PokemonType {
  type: {
    name: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
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

const formatId = (id: number): string => {
  return String(id).padStart(4, '0');
};
</script>

<style scoped>
.pokemon-card {
  background-color: var(--card-color);
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: #0075BE;
}

:root:not([data-theme="light"]) .pokemon-card:hover {
  border-color: var(--accent-color);
}

.pokemon-header {
  text-align: right;
  margin-bottom: 0.5rem;
  user-select: none;
}

.pokemon-number {
  color: var(--text-color);
  font-size: 0.9rem;
}

.pokemon-image {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pokemon-image img {
  width: 100%;
  height: auto;
  max-width: 110px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
  transition: transform 0.3s ease;
  pointer-events: none;
}

.pokemon-card:hover .pokemon-image img {
  transform: scale(1.3);
}

.pokemon-info {
  text-align: center;
  margin-top: 1rem;
  user-select: none;
}

.pokemon-info h3 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: bold;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
