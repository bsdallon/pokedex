<template>
  <div class="sort-options">
    <label for="sort-select">Sort by</label>
    <div class="sort-select-wrapper">
      <select 
        id="sort-select" 
        v-model="localSortOption"
        class="sort-select"
        @change="emitSort"
      >
        <option value="id-asc" selected>Number (Ascending)</option>
        <option value="id-desc">Number (Descending)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  sortOption: string;
}>();

const emit = defineEmits<{
  'update:sortOption': [string];
}>();

const localSortOption = ref(props.sortOption);

watch(() => props.sortOption, (newValue) => { 
  localSortOption.value = newValue;
});

const emitSort = () => {
  emit('update:sortOption', localSortOption.value);
};
</script>
