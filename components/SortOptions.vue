<template>
  <div class="sort-options">
    <div class="sort-select-wrapper sort-select-attached">
      <select
        id="sort-select"
        v-model="sortField"
        class="sort-select"
        @change="emitSort"
        aria-label="Sort field"
      >
        <option value="id">Number</option>
        <option value="name">Name</option>
      </select>
      <button
        class="sort-direction-btn sort-direction-attached"
        :class="{ asc: sortDirection === 'asc', desc: sortDirection === 'desc' }"
        @click="toggleDirection"
        aria-label="Toggle sort direction"
        type="button"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" fill="#F5F5F5"/>
          <!-- Up chevron (centered) -->
          <polyline 
            points="8,11 14,7 20,11" 
            :stroke="sortDirection === 'asc' ? '#FFCB05' : '#D3D3D3'"
            stroke-width="2.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
          <!-- Down chevron (centered) -->
          <polyline 
            points="8,17 14,21 20,17" 
            :stroke="sortDirection === 'desc' ? '#FFCB05' : '#D3D3D3'"
            stroke-width="2.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps<{
  sortOption: string;
}>();

const emit = defineEmits<{
  'update:sortOption': [string];
}>();

import { computed, ref, watch } from 'vue';

const sortField = ref(props.sortOption.split('-')[0] || 'id');
const sortDirection = ref(props.sortOption.split('-')[1] || 'asc');

watch(() => props.sortOption, (newValue) => {
  const [field, dir] = newValue.split('-');
  sortField.value = field || 'id';
  sortDirection.value = dir || 'asc';
});

const emitSort = () => {
  emit('update:sortOption', `${sortField.value}-${sortDirection.value}`);
};

const toggleDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  emitSort();
};
</script>
