<template>
  <header class="app-header" v-cloak>
    <div class="header-content">
      <div class="header-left" style="display: flex; align-items: center; gap: 0.7em">
        <h1 class="pokemon-title" @click.stop="navigateToHome" style="cursor: pointer">PokéDex</h1>
        <span style="display: inline-block; width: 1.5em"></span>
        <img
          src="/assets/images/pokeball.svg"
          alt="Pokeball Home"
          class="home-icon"
          @click.stop="navigateToHome"
          style="cursor: pointer"
        />
      </div>
      <nav class="header-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a class="nav-link" @click.prevent="navigateToAbout">About</a>
          </li>
          <li class="nav-item">
            <select class="background-dropdown" v-model="selectedBg" @change="onBgChange">
              <option v-for="option in backgroundOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'

  const backgroundOptions = [
    { value: 'grey', label: 'Modern Grey' },
    { value: 'blueberry', label: 'Blueberry Sky' },
    { value: 'sunset', label: 'Sunset Cheer' },
    { value: 'minty', label: 'Minty Fresh' },
    { value: 'twilight', label: 'Twilight Dream' },
    { value: 'candy', label: 'Candy Pop' },
    { value: 'forest', label: 'Forest Walk' },
    { value: 'midnight', label: 'Midnight Fade' },
    { value: 'typeTheme', label: 'Type Theme' },
  ]
  const typeBackgrounds: Record<string, string> = {
    normal: 'linear-gradient(120deg, #bfc4c9 0%, #d3d3b0 50%, #cfd68a 100%)',
    fire: 'linear-gradient(120deg, #ffb380 0%, #ffa45c 50%, #ff7f2a 100%)',
    water: 'linear-gradient(120deg, #8ab9db 0%, #97b6e6 35%, #6890f0 70%, #6d7cb6 100%)',
    electric: 'linear-gradient(120deg, #fbe37a 0%, #fbe89a 50%, #f7d86a 100%)',
    grass: 'linear-gradient(120deg, #a0db97 0%, #b0e88a 50%, #7ed957 100%)',
    ice: 'linear-gradient(120deg, #a6e6e0 0%, #c2ecef 50%, #8edbe3 100%)',
    fighting: 'linear-gradient(120deg, #e48498 0%, #d46d67 50%, #d32d22 100%)',
    poison: 'linear-gradient(120deg, #c494d1 0%, #b875b7 50%, #a13ca1 100%)',
    ground: 'linear-gradient(120deg, #e6a882 0%, #f3e0a2 50%, #e6c86a 100%)',
    flying: 'linear-gradient(120deg, #b2c7ea 0%, #cbb7f7 50%, #a48be0 100%)',
    psychic: 'linear-gradient(120deg, #ffa3a3 0%, #ff8ab0 50%, #f36b8a 100%)',
    bug: 'linear-gradient(120deg, #b6e28a 0%, #d0db6b 50%, #b2c11a 100%)',
    rock: 'linear-gradient(120deg, #e2d4b0 0%, #d6c87a 50%, #d6b81a 100%)',
    ghost: 'linear-gradient(120deg, #7b88b6 0%, #9e8fc1 50%, #6d4bb6 100%)',
    dragon: 'linear-gradient(120deg, #5ba0e6 0%, #8f7cf7 50%, #6d3ff6 100%)',
    dark: 'linear-gradient(120deg, #8e8a96 0%, #a8968a 40%, #6d4b36 100%)',
    steel: 'linear-gradient(120deg, #98b6c6 0%, #d3d5e6 40%, #cfd1e6 70%, #bfc2d6 100%)',
    fairy: 'linear-gradient(120deg, #f7b6e6 0%, #f7c7d7 50%, #f4a3b3 100%)',
  }
  const backgrounds: Record<string, string> = {
    grey: 'linear-gradient(120deg, #f5f5f5 0%, #e0e4ea 25%, #cfd8dc 50%, #b0bec5 75%, #90a4ae 100%)',
    blueberry: 'linear-gradient(120deg, #0d47a1 0%, #1976d2 40%, #90caf9 80%, #e3f0fa 100%)',
    sunset: 'linear-gradient(120deg, #ffe29f 0%, #ffa99f 50%, #a1c4fd 100%)',
    minty: 'linear-gradient(120deg, #e0ffe9 0%, #b2f7ef 35%, #aee9f7 70%, #7ed6df 100%)',
    twilight: 'linear-gradient(120deg, #f7c8e0 0%, #5e60ce 60%, #232946 100%)',
    candy:
      'linear-gradient(90deg, #d0f2f7 0%, #f7a1c4 25%, #f36b8a 50%, #d3b2d6 75%, #c3cbd6 100%)',
    forest: 'linear-gradient(120deg, #7ec850 0%, #a0522d 40%, #228b22 80%, #014421 100%)',
    midnight: 'linear-gradient(120deg, #5a5d6c 0%, #232526 60%, #414345 100%)',
    typeTheme: '', // will be set dynamically
  }
  // Always default to Modern Grey if no theme is set
  const selectedBg = ref(
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('pokedex-bg') || (localStorage.setItem('pokedex-bg', 'grey'), 'grey')
      : 'grey'
  )

  import { usePokemonStore } from '../stores/pokemon'
  const piniaStore = usePokemonStore()

  function getCurrentType(): string {
    if (piniaStore.selectedTypes && piniaStore.selectedTypes.length > 0) {
      const selectedType = piniaStore.selectedTypes[0]
      if (selectedType && typeof selectedType === 'string') {
        return selectedType.toLowerCase()
      }
    }
    return 'normal'
  }

  const setBackground = (bg: string) => {
    let bgValue = backgrounds[bg] ?? backgrounds.grey
    if (bg === 'typeTheme') {
      const type = getCurrentType()
      bgValue = typeBackgrounds[type] || backgrounds.grey
    }
    if (bgValue) {
      document.documentElement.style.setProperty('--background-color', bgValue)
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('pokedex-bg', bg)
    }
  }

  // Listen for type-theme-update events to update background
  if (typeof window !== 'undefined') {
    window.addEventListener('type-theme-update', () => {
      if (selectedBg.value === 'typeTheme') setBackground('typeTheme')
    })
  }

  const onBgChange = () => {
    setBackground(selectedBg.value)
  }

  onMounted(() => {
    setBackground(selectedBg.value)
  })
  import { navigateTo } from '#app'

  const navigateToHome = () => {
    navigateTo('/')
  }

  const navigateToAbout = () => {
    navigateTo('/about')
  }
</script>

<style scoped>
  .home-icon {
    width: 2.1em;
    height: 2.1em;
    margin-right: 0.1em;
    transition: filter 0.2s, transform 0.2s;
    vertical-align: middle;
    display: inline-block;
    filter: brightness(0) saturate(100%) invert(80%) sepia(0%) saturate(0%) hue-rotate(0deg)
      brightness(0.9);
  }
  .home-icon:hover {
    filter: brightness(0) saturate(100%) invert(80%) sepia(100%) saturate(600%) hue-rotate(0deg)
      brightness(1.1) drop-shadow(0 0 12px #ffcb05);
    transform: scale(1.13) rotate(-15deg);
    cursor: pointer;
    transition: filter 0.18s, transform 0.18s;
  }
  .header-nav {
    display: flex;
    align-items: center;
    margin-left: 2rem;
  }

  .nav-list {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
  }

  .nav-link {
    color: var(--accent-color, #ffcb05);
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .nav-link:hover {
    color: #ffcb05;
    background: none;
    text-decoration: none;
    text-shadow: none;
    filter: brightness(1.1) drop-shadow(0 0 12px #ffcb05);
    transform: scale(1.13);
    transition: color 0.18s, filter 0.18s, transform 0.18s;
  }
  @font-face {
    font-family: 'Pokemon Solid';
    src: url('https://db.onlinewebfonts.com/t/f4d1593471d222ddebd973210265762a.woff2')
      format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  .app-header {
    background: #2d2d2d;
    padding: 0.5rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 1.5rem;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1100;
    height: var(--header-height, 60px);
    width: 100%;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  .header-left {
    flex: 1;
  }

  .pokemon-title {
    font-family: 'Pokemon Solid', sans-serif;
    color: #003a70;
    text-align: left;
    text-shadow: -1.5px -1.5px 0 #ffcb05, 1.5px -1.5px 0 #ffcb05, -1.5px 1.5px 0 #ffcb05,
      1.5px 1.5px 0 #ffcb05, 0 0 10px rgba(255, 203, 5, 0.8);
    margin: 0;
    font-size: 2rem;
    letter-spacing: 1.5px;
    -webkit-font-smoothing: antialiased;
    cursor: pointer !important;
    transition: filter 0.2s;
    pointer-events: auto;
    display: inline-block;
    width: auto;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .subtitle {
    color: var(--text-color);
    margin: 0.2rem 0 0 0;
    font-size: 0.9rem;
    font-weight: 300;
  }
</style>
