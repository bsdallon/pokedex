<template>
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
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'type' | 'weakness'
}>();

defineEmits<{
  'update:modelValue': ['type' | 'weakness']
}>();
</script>

<style scoped>
.toggle-switch {
  display: flex;
  background-color: #f0f0f0;
  padding: 4px;
  border-radius: 999px;
  width: fit-content;
}

.toggle-option {
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s ease;
  min-width: 80px;
  font-weight: 500;
}

.toggle-option.active {
  background-color: #0075BE;
  color: white;
}

.toggle-option:not(.active):hover {
  background-color: #e0e0e0;
}
</style>
