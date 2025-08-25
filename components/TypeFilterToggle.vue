<template>
  <div class="toggle-container">
    <div class="toggle-switch">
      <button
        class="toggle-option"
        :class="{ active: modelValue === 'type' }"
        @click="$emit('update:modelValue', 'type')"
      >
        Type
      </button>
      <button
        class="toggle-option"
        :class="{ active: modelValue === 'weakness' }"
        @click="$emit('update:modelValue', 'weakness')"
      >
        Weakness
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue: 'type' | 'weakness'
  }>()

  defineEmits<{
    'update:modelValue': ['type' | 'weakness']
  }>()
</script>

<style scoped>
  .toggle-container {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .toggle-label {
    font-size: 0.95rem;
    color: #444;
    font-weight: 500;
  }

  .toggle-switch {
    display: flex;
    background-color: #f0f0f0;
    padding: 3px;
    border-radius: 8px;
    width: fit-content;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .toggle-option {
    padding: 7px 14px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #555;
    transition: all 0.2s ease;
    min-width: 80px;
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: 0.02rem;
  }

  .toggle-option.active {
    background-color: #3a5da8;
    color: white;
    box-shadow: 0 1px 3px rgba(58, 93, 168, 0.2);
  }

  .toggle-option:not(.active):hover {
    background-color: #e0e0e0;
    color: #333;
  }
</style>
