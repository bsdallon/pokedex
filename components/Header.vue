<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="pokemon-title" @click.stop="navigateToHome" style="cursor: pointer">PokéDex</h1>
      </div>
      <div class="header-right">
        <HamburgerMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import HamburgerMenu from './HamburgerMenu.vue'

  const navigateToHome = () => {
    navigateTo('/')
  }
</script>

<style scoped>
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
    padding: 0 calc(1rem + 4px);
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
