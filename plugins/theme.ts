export default defineNuxtPlugin((nuxtApp) => {
  const themesStore = useThemesStore()

  nuxtApp.hook('app:mounted', () => {
    themesStore.setTheme(themesStore.currentTheme)
  })
})
