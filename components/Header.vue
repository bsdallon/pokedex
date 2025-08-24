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
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
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
    padding-left: 3.5rem;
    padding-right: 3.25rem;
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
  .pokemon-title:hover {
    filter: brightness(1.1) drop-shadow(0 0 6px #ffcb05);
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
