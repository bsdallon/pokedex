// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  ssr: true,
  nitro: {
    preset: 'github_pages',
  },
  app: {
    baseURL: '/pokedex/',
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/pokedex/assets/images/pokeball.svg' }],
    },
  },
})
