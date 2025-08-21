import { defineStore } from 'pinia'
import { z } from 'zod'

// Define Zod schemas for theme types
const ThemeColorsSchema = z.object({
  background: z.string(),
  card: z.string(),
  accent: z.string(),
  text: z.string(),
})

const ThemeSchema = z.object({
  name: z.string(),
  colors: ThemeColorsSchema,
})

export type ThemeColors = z.infer<typeof ThemeColorsSchema>
export type Theme = z.infer<typeof ThemeSchema>

export const THEME_NAMES = ['light', 'dark', 'metallic-chic', 'dark-purple', 'minimal-warm'] as const
export type ThemeName = typeof THEME_NAMES[number]

export const useThemesStore = defineStore('themes', {
  state: () => ({
    currentTheme: 'light' as ThemeName,
    themes: {
      'light': {
        background: '#F5F5F5',
        card: '#FFFFFF',
        accent: '#FFCB05',
        text: '#333333'
      },      
      'dark': {
        background: '#1A1A1A',
        card: '#2D2D2D',
        accent: '#007AFF',
        text: '#FFFFFF'
      },
      'metallic-chic': {
        background: '#3D52A0',
        card: '#7091E6',
        accent: '#EDE8F5',
        text: '#FFFFFF'
      },
      'dark-purple': {
        background: '#463344',
        card: '#9D8D8F',
        accent: '#FAED26',
        text: '#FFFFFF'
      },
      'minimal-warm': {
        background: '#EAE7DC',
        card: '#D8C3A5',
        accent: '#E85A4F',
        text: '#333333'
      }
    } as Record<ThemeName, ThemeColors>
  }),

  actions: {
    setTheme(themeName: ThemeName) {
      this.currentTheme = themeName
      this.applyTheme(this.themes[themeName])
    },

    applyTheme(colors: ThemeColors) {
      document.documentElement.dataset.theme = this.currentTheme
      document.documentElement.style.setProperty('--background-color', colors.background)
      document.documentElement.style.setProperty('--card-color', colors.card)
      document.documentElement.style.setProperty('--accent-color', colors.accent)
      document.documentElement.style.setProperty('--text-color', colors.text)  
    }
  }
})
