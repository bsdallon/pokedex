<template>
  <div class="error-notification" v-if="errorStore.errors.length > 0">
    <div v-for="error in errorStore.errors" :key="error.id" class="error-notification__item">
      <div class="error-notification__content">
        <div class="error-notification__title">Error</div>
        <div class="error-notification__message">{{ error.message }}</div>
        <div v-if="error.details" class="error-notification__details">{{ error.details }}</div>
      </div>
      <button 
        @click="errorStore.clearError(error.id)" 
        class="error-notification__close"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '~/stores/error';

const errorStore = useErrorStore();
</script>
