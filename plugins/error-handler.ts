import { usePokemonStore } from '~/stores/pokemon'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error)
    console.error('Component:', instance)
    console.error('Error info:', info)

    try {
      const store = usePokemonStore()
      if (store) {
        const errorMessage =
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message
            : undefined
        store.error = `An error occurred: ${errorMessage || 'Unknown error'}`
      }
    } catch (e) {
      console.error('Could not access store:', e)
    }
  }

  nuxtApp.hook('app:error', (error) => {
    console.error('Nuxt error:', error)
  })
})
