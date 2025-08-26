import { ref, onMounted } from 'vue'

export function useTypeThemeActive() {
  const isTypeThemeActive = ref(false)

  function checkTypeTheme() {
    if (typeof window !== 'undefined' && window.localStorage) {
      isTypeThemeActive.value = localStorage.getItem('pokedex-bg') === 'typeTheme'
    }
  }

  onMounted(checkTypeTheme)

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkTypeTheme)
    window.addEventListener('type-theme-update', checkTypeTheme)
  }

  return { isTypeThemeActive }
}
