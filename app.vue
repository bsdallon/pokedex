
<template>
  <div id="main-app" v-cloak>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
      <link href="https://db.onlinewebfonts.com/c/f4d1593471d222ddebd973210265762a?family=Pokemon+Solid" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </Head>
    <ErrorNotification />
    <MainLayout>
      <LoadingPokeballs v-if="store.isLoading" />
      <NuxtPage />
    </MainLayout>
  </div>
</template>

<style>
@import './assets/styles/variables.css';
#main-app {
  width: 100%;
  background: var(--background-color, #f7f7f7);
}
</style>

<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue';
import LoadingPokeballs from '~/components/LoadingPokeballs.vue';
import ErrorNotification from '~/components/ErrorNotification.vue';
import { usePokemonStore } from '~/stores/pokemon';

const store = usePokemonStore();
</script>
