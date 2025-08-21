<template>
  <div class="search-input-wrapper">
    <input
      type="text"
      v-model="localSearchQuery"
      class="search-input"
      placeholder="Search by Pokemon name or ID"
      @input="handleSearch"
    >
    <button 
      v-if="localSearchQuery" 
      @click="clearSearch" 
      class="clear-search"
      title="Clear search"
    >
      ×
    </button>
    <button 
      @click="toggleFilters"
      class="filter-toggle"
      :class="{ 'active': showFilters }"
      title="Toggle filters"
    >
      <span class="material-icons">filter_list</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  searchQuery: string;
  showFilters: boolean;
}>();

const emit = defineEmits<{
  'update:searchQuery': [string];
  'update:showFilters': [boolean];
}>();

const localSearchQuery = ref(props.searchQuery);

watch(() => props.searchQuery, (newValue) => {
  localSearchQuery.value = newValue;
});

const handleSearch = () => {
  emit('update:searchQuery', localSearchQuery.value);
};

const clearSearch = () => {
  localSearchQuery.value = '';
  emit('update:searchQuery', '');
};

const toggleFilters = () => {
  emit('update:showFilters', !props.showFilters);
};
</script>
