<template>
  <NuxtLink :to="`/pokemon/${pokemon.id}`" class="pokemon-card">
    <div class="pokemon-card__header">
      <span class="pokemon-card__number">#{{ formatPokemonId(pokemon.id) }}</span>
    </div>
    <div class="pokemon-card__image">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
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
  import { formatName, formatPokemonId } from '~/utils/formatters'

  interface PokemonType {
    type: {
      name: string
    }
  }

  interface Pokemon {
    id: number
    name: string
    types: PokemonType[]
    sprites: {
      front_default: string
    }
  }

  const props = defineProps<{
    pokemon: Pokemon
  }>()
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

  .type-select-container {
    position: relative;
    min-width: 150px;
  }

  .type-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
  }

  .selected-type-display {
    min-width: 150px;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .type-select:hover + .selected-type-display,
  .type-select:focus + .selected-type-display {
    border-color: #e3350d;
  }

  /* Type badge styles for PokemonCard */
  .type-normal {
    background-color: #a8a878;
  }
  .type-fire {
    background-color: #f08030;
  }
  .type-water {
    background-color: #6890f0;
  }
  .type-electric {
    background-color: #f8d030;
  }
  .type-grass {
    background-color: #78c850;
  }
  .type-ice {
    background-color: #98d8d8;
  }
  .type-fighting {
    background-color: #c03028;
  }
  .type-poison {
    background-color: #b567ce;
  }
  .type-ground {
    background-color: #e0c068;
  }
  .type-flying {
    background-color: #a890f0;
  }
  .type-psychic {
    background-color: #f85888;
  }
  .type-bug {
    background-color: #a8b820;
  }
  .type-rock {
    background-color: #b8a038;
  }
  .type-ghost {
    background-color: #705898;
  }
  .type-dragon {
    background-color: #7038f8;
  }
  .type-dark {
    background-color: #705848;
  }
  .type-steel {
    background-color: #b8b8d0;
  }
  .type-fairy {
    background-color: #ee99ac;
  }

  .type-badge {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    color: white;
    font-size: 0.7rem;
    font-weight: 500;
    margin-right: 0.35rem;
    text-align: center;
    min-width: 48px;
    line-height: 1.2;
  }
</style>
