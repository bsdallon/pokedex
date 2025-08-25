<template>
  <button
    :class="['type-button', `type-${type}`, { 'type-selected': selected }]"
    @click="$emit('click')"
    :disabled="disabled"
  >
    {{ formatType(type) }}
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    type: string
    selected?: boolean
    disabled?: boolean
  }>()

  defineEmits<{
    click: []
  }>()

  const formatType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }
</script>

<style scoped>
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

  .type-button {
    width: 100%;
    padding: 0.35rem 0.25rem;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
    transition: all 0.2s ease;
    user-select: none;
    text-align: center;
    min-width: 48px;
    line-height: 1.2;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .type-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .type-button:hover::before {
    opacity: 1;
  }

  .type-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid transparent;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .type-selected {
    transform: scale(1.08);
    filter: brightness(1.05) contrast(1.05);
    box-shadow: 0 4px 16px 0 rgba(30, 30, 30, 0.28), 0 1.5px 6px 0 rgba(0, 0, 0, 0.18);
  }

  .type-selected::before {
    display: none;
  }

  .type-button:disabled {
    opacity: 0.5;
    cursor: default;
    transform: none;
  }

  .type-button:disabled::before,
  .type-button:disabled::after {
    display: none;
  }
</style>
