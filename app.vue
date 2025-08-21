
<template>
  <div v-cloak>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
      <link href="https://db.onlinewebfonts.com/c/f4d1593471d222ddebd973210265762a?family=Pokemon+Solid" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </Head>
    <MainLayout>
      <LoadingPokeballs v-if="isLoading" />
      <NuxtPage @loading-start="setLoading(true)" @loading-end="setLoading(false)" />
    </MainLayout>
  </div>
</template>

<style>
@import './assets/styles/variables.css';
</style>

<script setup>
import MainLayout from '~/components/MainLayout.vue';
import LoadingPokeballs from '~/components/LoadingPokeballs.vue';

const isLoading = ref(true);

const setLoading = (status) => {
  isLoading.value = status;
};

onMounted(() => {
  isLoading.value = true;
});
</script>
