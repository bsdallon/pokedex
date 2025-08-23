<template>
  <div class="advanced-filters" :class="{ 'show': show }" v-cloak>
    <div class="advanced-filters-content">
      <div class="top-filters">
        <div class="filter-half">
          <label for="range-min">Pokemon number range</label>
          <div class="range-inputs">
            <input
              id="range-min"
              type="number"
              v-model="localRangeMin"
              :min="MIN_POKEMON_ID"
              :max="MAX_POKEMON_ID"
              @input="handleRangeInput"
              @blur="handleRangeBlur"
              class="range-input"
              :placeholder="MIN_POKEMON_ID.toString()"
            >
            <span>-</span>
            <input
              id="range-max"
              type="number"
              v-model="localRangeMax"
              :min="MIN_POKEMON_ID"
              :max="MAX_POKEMON_ID"
              @input="handleRangeInput"
              @blur="handleRangeBlur"
              class="range-input"
              :placeholder="MAX_POKEMON_ID.toString()"
            >
          </div>
        </div>

        <div class="filter-half">
          <label for="generation-select">Generation filter</label>
          <select 
            id="generation-select"
            v-model="localSelectedGeneration" 
            class="generation-select"
            @change="handleGenerationChange"
          >
            <option value="" disabled selected hidden>Select generation</option>
            <option value="all">All Generations</option>
            <option 
              v-for="(gen, key) in generations" 
              :key="key"
              :value="key"
            >
              {{ gen.name }} (#{{ gen.range[0] }}-{{ gen.range[1] }})
            </option>
          </select>
        </div>
      </div>

      <div class="type-filter-container filter-section">
        <div class="type-filter-header">
          <div class="type-filter-title-group">
            <span class="filter-title">{{ localFilterMode === 'type' ? 'Type filter' : 'Weakness filter' }}</span>
            <span class="type-hint">(max 2 types)</span>
          </div>
          <TypeFilterToggle v-model="localFilterMode" />
        </div>
        <div class="type-buttons">
          <TypeButton
            v-for="type in pokemonTypes"
            :key="type"
            :type="type"
            :selected="selectedTypes.includes(type)"
            :disabled="selectedTypes.length >= 2 && !selectedTypes.includes(type)"
            @click="handleTypeToggle(type)"
          />
        </div>
      </div>

      <button 
        class="reset-filters-button" 
        @click="resetFilters"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TypeFilterToggle from './TypeFilterToggle.vue';
import TypeButton from './TypeButton.vue';

const MIN_POKEMON_ID = 1;
const MAX_POKEMON_ID = 1025;

const props = defineProps<{
  show: boolean;
  rangeMin: string;
  rangeMax: string;
  selectedGeneration: string;
  filterMode: 'type' | 'weakness';
  selectedTypes: string[];
  generations: Record<string, { name: string; range: [number, number] }>;
  pokemonTypes: string[];
}>();

const emit = defineEmits<{
  'update:rangeMin': [string];
  'update:rangeMax': [string];
  'update:selectedGeneration': [string];
  'update:filterMode': ['type' | 'weakness'];
  'update:selectedTypes': [string[]];
  'resetFilters': [];
}>();

const localRangeMin = ref(props.rangeMin);
const localRangeMax = ref(props.rangeMax);
const localSelectedGeneration = ref(props.selectedGeneration);
const localFilterMode = ref(props.filterMode);

watch(() => props.rangeMin, (newValue) => { localRangeMin.value = newValue; });
watch(() => props.rangeMax, (newValue) => { localRangeMax.value = newValue; });
watch(() => props.selectedGeneration, (newValue) => { localSelectedGeneration.value = newValue; });
watch(() => props.filterMode, (newValue) => { localFilterMode.value = newValue; });

const handleRangeInput = () => {
  if (localSelectedGeneration.value) {
    localSelectedGeneration.value = '';
    emit('update:selectedGeneration', '');
  }
  
  emit('update:rangeMin', localRangeMin.value);
  emit('update:rangeMax', localRangeMax.value);
};

const handleRangeBlur = () => {
  if (localRangeMin.value === '') {
    localRangeMin.value = MIN_POKEMON_ID.toString();
  }
  if (localRangeMax.value === '') {
    localRangeMax.value = MAX_POKEMON_ID.toString();
  }

  emit('update:rangeMin', localRangeMin.value);
  emit('update:rangeMax', localRangeMax.value);
};

const handleGenerationChange = () => {
  emit('update:selectedGeneration', localSelectedGeneration.value);
};

const handleTypeToggle = (type: string) => {
  const index = props.selectedTypes.indexOf(type);
  const newSelectedTypes = [...props.selectedTypes];
  
  if (index === -1) {
    if (newSelectedTypes.length < 2) {
      newSelectedTypes.push(type);
    }
  } else {
    newSelectedTypes.splice(index, 1);
  }
  
  emit('update:selectedTypes', newSelectedTypes);
};

const resetFilters = () => {
  localFilterMode.value = 'type';
  localSelectedGeneration.value = '';
  emit('update:selectedGeneration', '');
  emit('update:filterMode', 'type');  
  emit('resetFilters');
};

watch(() => localFilterMode.value, (newValue) => {
  emit('update:filterMode', newValue);
});
</script>