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
      <h3>{{ formatName(pokemon.name) }}</h3>
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
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pokemon-header {
  text-align: right;
  margin-bottom: 0.5rem;
  user-select: none;
}

.pokemon-number {
  color: #666;
  font-size: 0.9rem;
}

.pokemon-image {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  user-select: none;
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
  color: #333;
  font-size: 1.2rem;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
