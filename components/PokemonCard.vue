<template>
  <NuxtLink :to="`/pokemon/${pokemon.id}`" class="pokemon-card">
    <div class="pokemon-card__header">
      <span class="pokemon-card__number">#{{ formatPokemonId(pokemon.id) }}</span>
    </div>
    <div class="pokemon-card__image">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
    </div>
    <div class="pokemon-card__content">
      <h3 class="pokemon-card__name">{{ formatName(pokemon.name) }}</h3>
      <div class="pokemon-card__types">
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
import { formatName, formatPokemonId } from '~/utils/formatters';

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
}

.pokemon-card__header {
  text-align: right;
  margin-bottom: 0.25rem;
  user-select: none;
}

.pokemon-card__number {
  color: var(--text-color);
  font-size: 0.9rem;
}

.pokemon-card__image {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pokemon-card__image img {
  width: 100%;
  height: auto;
  max-width: 110px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
  transition: transform 0.3s ease;
  pointer-events: none;
}

.pokemon-card:hover .pokemon-card__image img {
  transform: scale(1.3);
}

.pokemon-card__content {
  text-align: center;
  user-select: none;
  display: flex;
  flex-direction: column;
  min-height: 80px;
  justify-content: space-between;
}

.pokemon-card__name {
  margin: 0.5rem 0;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: bold;
}

.pokemon-card__types {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
