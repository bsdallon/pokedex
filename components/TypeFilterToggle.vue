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
</style>
