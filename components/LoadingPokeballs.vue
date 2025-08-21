<template>
  <div class="loading-overlay">
    <div class="pokeballs">
      <div class="pokeball"></div>
      <div class="pokeball"></div>
      <div class="pokeball"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: var(--header-height, 60px);
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.pokeballs {
  display: flex;
  gap: 4px;
  margin-left: 4px;
}

.pokeball {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(
    to bottom,
    #ff1a1a 0%,
    #ff1a1a 50%,
    #fff 50%,
    #fff 100%
  );
  border: 1px solid #333;
  position: relative;
  animation: bounce 0.8s infinite;
}

.pokeball::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #333;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #fff;
}

/* Apply different animation delays to each pokeball */
.pokeball:nth-child(1) {
  animation-delay: 0s;
}

.pokeball:nth-child(2) {
  animation-delay: 0.2s;
}

.pokeball:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
