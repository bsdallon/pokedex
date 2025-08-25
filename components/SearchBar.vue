<template>
  <div class="search-input-wrapper">
    <div class="search-input-inner">
      <input
        type="text"
        v-model="localSearchQuery"
        class="search-input"
        placeholder="Search by name or number"
        @input="handleSearch"
      />
      <span v-if="localSearchQuery" class="clear-search-wrapper">
        <button @click="clearSearch" class="clear-search" title="Clear search">×</button>
      </span>
    </div>
    <button
      @click="toggleFilters"
      class="filter-toggle"
      :class="{ active: showFilters }"
      title="Toggle filters"
      type="button"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style="display: block; margin: auto"
      >
        <rect
          x="6"
          y="10"
          width="16"
          height="2.5"
          rx="1.25"
          :fill="showFilters ? '#FFCB05' : '#888'"
        />
        <rect
          x="9"
          y="14"
          width="10"
          height="2.5"
          rx="1.25"
          :fill="showFilters ? '#FFCB05' : '#888'"
        />
        <rect
          x="12"
          y="18"
          width="4"
          height="2.5"
          rx="1.25"
          :fill="showFilters ? '#FFCB05' : '#888'"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    searchQuery: string
    showFilters: boolean
  }>()

  const emit = defineEmits<{
    'update:searchQuery': [string]
    'update:showFilters': [boolean]
  }>()

  const localSearchQuery = ref(props.searchQuery)

  watch(
    () => props.searchQuery,
    (newValue) => {
      localSearchQuery.value = newValue
    }
  )

  const handleSearch = () => {
    emit('update:searchQuery', localSearchQuery.value)
  }

  const clearSearch = () => {
    localSearchQuery.value = ''
    emit('update:searchQuery', '')
  }

  const toggleFilters = () => {
    emit('update:showFilters', !props.showFilters)
  }
</script>

<style scoped>
  .search-input-wrapper {
    width: 100%;
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
  }

  .search-input-inner {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
  }

  .clear-search-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: -1px;
  }

  .search-input {
    flex: 1;
    width: 100%;
    height: 44px;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-right: none;
    border-radius: 4px 0 0 4px;
    outline: none;
    transition: all 0.2s;
    background-color: #ffffff;
    color: #333;
    box-sizing: border-box;
  }

  .clear-search {
    background: none;
    border: none;
    font-size: 1.2rem;
    font-family: inherit;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all 0.2s;
    z-index: 2;
    min-width: 0;
    box-sizing: border-box;
    line-height: 1;
    vertical-align: middle;
  }

  .filter-toggle {
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-radius: 0 4px 4px 0;
    width: 44px;
    min-width: 44px;
    height: 44px;
    background: #fff;
    padding: 0;
    outline: none;
    z-index: 1;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .filter-toggle.active {
    color: var(--accent-color);
  }

  .filter-toggle svg {
    width: 24px;
    height: 24px;
    display: block;
    margin: 0 auto;
    padding: 0;
  }

  .clear-search:hover {
    background-color: #e0e0e0;
  }
  .filter-toggle:hover,
  .filter-toggle:focus {
    background: #e0e0e0;
  }

  @media (max-width: 600px) {
    .search-input-wrapper {
      width: 100%;
      max-width: 100%;
      margin: 0 auto auto;
      box-sizing: border-box;
    }
    .search-input-inner {
      width: 100%;
    }
  }
</style>
