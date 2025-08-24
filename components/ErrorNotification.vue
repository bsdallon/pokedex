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

<style scoped>
.error-notification {
  position: fixed;
  top: calc(var(--header-height) + 1rem);
  right: 1rem;
  z-index: 1000;
  width: 320px;
  max-width: calc(100vw - 2rem);
}

.error-notification__item {
  background-color: var(--error-background, #fee2e2);
  border-left: 4px solid var(--error-border, #ef4444);
  color: var(--error-text, #7f1d1d);
  margin-bottom: 0.5rem;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  animation: slideIn 0.3s ease-out forwards;
}

.error-notification__title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.error-notification__message {
  font-size: 0.875rem;
}

.error-notification__details {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  opacity: 0.8;
}

.error-notification__close {
  background: none;
  border: none;
  color: var(--error-text, #7f1d1d);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;
  transition: opacity 0.2s;
}

.error-notification__close:hover {
  opacity: 0.7;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>