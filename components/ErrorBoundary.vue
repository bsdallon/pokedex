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
        <p>
          <template v-if="error && error.message && error.message.includes('Failed to fetch')">
            Unable to connect to the Pokémon API. Please check your internet connection or try again
            later.<br />
            <span style="font-size: 0.95em; color: #b71c1c">(Network error: Failed to fetch)</span>
          </template>
          <template v-else>
            {{ error.message || 'Something went wrong while searching for Pokémon' }}
          </template>
        </p>
        <pre
          v-if="error && error.stack"
          style="
            text-align: left;
            max-width: 100%;
            overflow-x: auto;
            background: #f8d7da;
            color: #721c24;
            padding: 0.5em 1em;
            border-radius: 6px;
            font-size: 0.95em;
          "
        >
          {{ error.stack }}
        </pre>
        <pre
          v-if="error && 'details' in error && (error as any).details"
          style="
            text-align: left;
            max-width: 100%;
            overflow-x: auto;
            background: #fff3cd;
            color: #856404;
            padding: 0.5em 1em;
            border-radius: 6px;
            font-size: 0.95em;
          "
        >
          {{ (error as any).details }}
        </pre>
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
      default: true,
    },
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

<style scoped>
  .error-boundary {
    padding: 2rem;
    text-align: center;
    background-color: var(--surface-background, #f9fafb);
    border-radius: 8px;
    border: 1px solid var(--error-border, #ef4444);
    margin: 1rem 0;
    max-width: 100%;
  }

  .error-boundary__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .error-boundary__image {
    width: 180px;
    height: auto;
    margin-bottom: 1rem;
    object-fit: contain;
  }

  .error-boundary__content h3 {
    color: var(--error-text, #7f1d1d);
    font-size: 1.25rem;
    margin: 0;
  }

  .error-boundary__button {
    background-color: var(--primary-color, #ef4444);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .error-boundary__button:hover {
    background-color: var(--primary-color-dark, #dc2626);
  }
</style>
