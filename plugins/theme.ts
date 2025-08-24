// Nuxt plugin to inject default theme colors as CSS variables
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const root = document.documentElement
    root.style.setProperty('--background-color', '#f5f5f5')
    root.style.setProperty('--card-color', '#ffffff')
    root.style.setProperty('--accent-color', '#ffcb05')
    root.style.setProperty('--text-color', '#333333')
  }
})
