// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: [
    '~/assets/styles/main.css',
    '~/assets/styles/types.css',
    '~/assets/styles/search.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://pokeapi.co/api/v2'
    }
  }
})
