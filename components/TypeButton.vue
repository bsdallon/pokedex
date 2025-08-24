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
