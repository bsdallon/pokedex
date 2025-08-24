<template>
  <div class="menu-container">
    <button class="hamburger-button" @click.stop="toggleMenu" :class="{ 'is-active': isOpen }">
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>

    <div class="menu-overlay" v-if="isOpen" @click="closeMenu"></div>

    <div class="menu-content" :class="{ 'is-open': isOpen }">
      <div class="menu-header">
        <h3>Menu</h3>
      </div>
      <div class="menu-items">
        <button class="menu-item" @click="showAbout">
          <span>About</span>
        </button>
        <div class="theme-selector">
          <h4>Theme</h4>
          <button
            v-for="theme in themes"
            :key="theme.name"
            class="theme-button"
            :class="{ active: currentTheme === theme.name }"
            @click="selectTheme(theme.name)"
          >
            <div class="theme-preview" :style="getThemePreviewStyle(theme)"></div>
            <span>{{ theme.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useThemesStore } from '~/stores/themes'
  import type { ThemeName } from '~/stores/themes'

  const themesStore = useThemesStore()
  const isOpen = ref(false)
  const currentTheme = computed(() => themesStore.currentTheme)

  interface ThemeOption {
    name: ThemeName
    label: string
    colors: {
      background: string
      card: string
      accent: string
    }
  }

  const themes: ThemeOption[] = [
    {
      name: 'light',
      label: 'Light',
      colors: themesStore.themes.light,
    },
    {
      name: 'dark',
      label: 'Dark',
      colors: themesStore.themes.dark,
    },
    {
      name: 'metallic-chic',
      label: 'Metallic Chic',
      colors: themesStore.themes['metallic-chic'],
    },
    {
      name: 'dark-purple',
      label: 'Dark Purple',
      colors: themesStore.themes['dark-purple'],
    },
    {
      name: 'minimal-warm',
      label: 'Minimal Warm',
      colors: themesStore.themes['minimal-warm'],
    },
  ]

  const toggleMenu = () => {
    isOpen.value = !isOpen.value
  }

  const closeMenu = () => {
    isOpen.value = false
  }

  const showAbout = () => {
    navigateTo('/about')
    closeMenu()
  }

  const selectTheme = (themeName: ThemeName) => {
    themesStore.setTheme(themeName)
  }

  const getThemePreviewStyle = (theme: any) => {
    return {
      background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.card} 50%, ${theme.colors.accent} 100%)`,
    }
  }
</script>

<style scoped>
  .menu-container {
    position: relative;
    z-index: 1000;
  }

  .hamburger-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: transparent;
    border: none;
    cursor: pointer !important;
    padding: 0;
  }

  .hamburger-box {
    position: relative;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger-inner {
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: var(--accent-color);
    transition: all 0.3s ease;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer !important;
  }

  .hamburger-inner::before,
  .hamburger-inner::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: var(--accent-color);
    transition: all 0.3s ease;
    left: 0;
    cursor: pointer !important;
  }

  .hamburger-inner::before {
    top: -8px;
  }

  .hamburger-inner::after {
    bottom: -8px;
  }

  .hamburger-button.is-active .hamburger-inner {
    transform: rotate(45deg);
    top: 50%;
  }

  .hamburger-button.is-active .hamburger-inner::before {
    transform: rotate(-90deg);
    top: 0;
  }

  .hamburger-button.is-active .hamburger-inner::after {
    transform: rotate(0deg);
    bottom: 0;
    top: 0;
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
  }

  .menu-content {
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100vh;
    background: #2d2d2d;
    color: #ffffff;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    transition: right 0.3s ease;
    overflow-y: auto;
  }

  .menu-content.is-open {
    right: 0;
  }

  .menu-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .menu-header h3 {
    margin: 0;
    color: #fff;
    font-size: 1.2rem;
  }

  .menu-items {
    padding: 1rem;
  }

  .menu-item {
    width: 100%;
    padding: 0.8rem 1rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #fff;
    text-align: left;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  :root[data-theme='light'] .menu-item:hover {
    background: rgba(255, 203, 5, 0.2);
  }

  .theme-selector {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .theme-selector h4 {
    margin: 0 0 1rem 0;
    color: #fff;
    font-size: 1rem;
    padding: 0 1rem;
  }

  .theme-button {
    width: 100%;
    padding: 0.8rem 1rem;
    background: transparent;
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .theme-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  :root[data-theme='light'] .theme-button:hover {
    background: rgba(255, 203, 5, 0.2);
  }

  .theme-button.active {
    background: color-mix(in srgb, var(--accent-color) 10%, transparent);
  }

  .theme-preview {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .menu-container,
  .menu-content {
    cursor: default !important;
  }

  .hamburger-button,
  .hamburger-box,
  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    cursor: pointer !important;
  }
</style>
