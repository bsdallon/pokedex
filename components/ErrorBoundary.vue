<template>
  <div>
    <div v-if="error" class="error-boundary">
      <div class="error-boundary__content">
        <img 
          src="~/assets/images/pokemon_not_found.png" 
          alt="Pokemon not found" 
          class="error-boundary__image"
        />
        <h3>Oh no! We could not find that Pokémon!</h3>
        <p>{{ error.message || 'Something went wrong while searching for Pokémon' }}</p>
        <button @click="retry" class="error-boundary__button">Go Back</button>
      </div>
    </div>
    <slot v-else></slot>
    <teleport v-if="hasErrorSlot && error" to="#app">
      <slot name="fallback" :error="error" :retry="retry"></slot>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, useSlots } from 'vue'
import { useErrorStore } from '~/stores/error'

const props = defineProps({
  logErrors: {
    type: Boolean,
    default: true
  }
})

const slots = useSlots()
const hasErrorSlot = computed(() => Boolean(slots.fallback))
const error = ref<Error | null>(null)
const errorStore = useErrorStore()

function retry() {
  error.value = null
}

onErrorCaptured((err: unknown, instance, info) => {
  error.value = err instanceof Error ? err : new Error(String(err))
  
  if (props.logErrors) {
    errorStore.addError(
      error.value, 
      `Component: ${instance?.$options?.name || 'Unknown'}, Info: ${info}`,
      'component'
    )
  }
  
  return false
})
</script>
