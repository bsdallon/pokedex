<template>
  <div :class="row ? 'evolution-row' : 'evolution-tree-node'">
    <template v-if="row && stages">
      <template v-for="(stage, idx) in stages" :key="stage.id">
        <div
          class="evolution-item"
          :class="{ active: stage.id === currentId }"
          @click="$emit('navigate', stage.id)"
        >
          <img :src="stage.image" :alt="stage.name" />
          <div class="evolution-name">
            {{ formatName(stage.name) }}
            <span class="pokemon-id">#{{ String(stage.id).padStart(4, '0') }}</span>
          </div>
        </div>
        <span v-if="idx < stages.length - 1" class="evolution-arrow">&rarr;</span>
      </template>
    </template>
    <template v-else-if="node">
      <div
        class="evolution-item"
        :class="{ active: node.id === currentId }"
        @click="$emit('navigate', node.id)"
      >
        <img :src="node.image" :alt="node.name" />
        <div class="evolution-name">{{ formatName(node.name) }}</div>
      </div>
      <div v-if="node.children && node.children.length" class="evolution-branches">
        <EvolutionTreeNode
          v-for="(child, idx) in node.children"
          :key="child.id"
          :node="child"
          :current-id="currentId"
          @navigate="$emit('navigate', $event)"
          class="evolution-branch-child"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    node?: any
    currentId: number
    row?: boolean
    stages?: any[]
  }>()
  const emit = defineEmits(['navigate'])
  function formatName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
</script>

<style scoped>
  .evolution-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .evolution-row::-webkit-scrollbar {
    display: none;
  }
  .evolution-row .evolution-item {
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    min-width: 120px;
  }
  .evolution-row .evolution-item.active {
    font-weight: bold;
  }
  .evolution-row .evolution-item img {
    width: 100px;
    height: 75px;
    border-radius: 0;
    background: none;
    border: none;
    margin-bottom: 0px;
    transition: filter 0.2s;
    box-shadow: none;
  }
  .evolution-row .evolution-item img:hover {
    filter: brightness(1.1) drop-shadow(0 0 8px #ffcb05);
  }
  .evolution-row .evolution-name {
    margin-top: 0px;
    text-transform: capitalize;
    font-size: 1rem;
  }
  .evolution-row .pokemon-id {
    color: #888;
    font-size: 0.9em;
    margin-left: 4px;
  }
  .evolution-row .evolution-arrow {
    font-size: 2.2rem;
    color: #222;
    margin: 0 8px;
    user-select: none;
  }
  .evolution-tree-node {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .evolution-item {
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    border-radius: 8px;
    padding: 0;
    background: none;
    box-shadow: none;
  }
  .evolution-item.active {
    font-weight: bold;
    background: none;
    box-shadow: none;
  }
  .evolution-item img {
    width: 70px;
    height: 70px;
    object-fit: contain;
  }
  .evolution-name {
    text-transform: capitalize;
  }
  .evolution-branches {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .evolution-branch-child {
    flex: 1 1 0;
  }
</style>
