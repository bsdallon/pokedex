<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="pokemon-title">PokéDex</h1>
      </div>
      <div class="header-right">
        <HamburgerMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import HamburgerMenu from './HamburgerMenu.vue'
</script>

<style scoped>
@font-face {
  font-family: 'Pokemon Solid';
  src: url('https://db.onlinewebfonts.com/t/f4d1593471d222ddebd973210265762a.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

.app-header {
  background: #2D2D2D;
  padding: 0.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.pokemon-title {
  font-family: 'Pokemon Solid', sans-serif;
  color: #003A70;
  text-align: left;
  text-shadow: 
    -1.5px -1.5px 0 #FFCB05,
    1.5px -1.5px 0 #FFCB05,
    -1.5px 1.5px 0 #FFCB05,
    1.5px 1.5px 0 #FFCB05,
    0 0 10px rgba(255, 203, 5, 0.8);
  margin: 0;
  font-size: 2rem;
  letter-spacing: 1.5px;
  -webkit-font-smoothing: antialiased;
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
