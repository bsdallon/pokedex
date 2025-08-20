export default defineNuxtPlugin((nuxtApp) => {
  // Wait until the app is mounted before applying the theme
  nuxtApp.vueApp.mixin({
    mounted() {
      // Only run this once at the root component level
      if (this.$parent === null) {
        const themesStore = useThemesStore()
        themesStore.setTheme(themesStore.currentTheme)
      }
    }
  })
})
