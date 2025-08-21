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
  min-height: 100vh;
  overflow-y: scroll;
  width: 100vw;
}

.content-container {
  flex: 1;
  position: relative;
  padding-top: var(--header-height, 60px);
  margin-top: -var(--header-height, 60px);
  width: 100%;
}
</style>
