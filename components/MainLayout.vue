<template>
  <div class="main-layout">
    <Header />
    <div class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue';
</script>

<style scoped>

.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.content-container {
  flex: 1;
  position: relative;
  padding-top: var(--header-height, 60px);
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
}
</style>
