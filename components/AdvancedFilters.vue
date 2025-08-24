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

<style scoped>
.filter-section {
  margin-top: 10px;
  position: relative;
}

.filter-half {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 200px;
  position: relative;
  margin-top: 15px;
  padding-top: 12px;
}

.filter-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #444;
  text-transform: none;
  letter-spacing: 0.02rem;
  text-shadow: 0 0 0.2px rgba(0,0,0,0.1);
  line-height: 1;
  margin-right: 1rem;
}

.filter-half label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #444;
  position: absolute;
  top: -20px;
  left: 0;
  text-transform: none;
  letter-spacing: 0.02rem;
  text-shadow: 0 0 0.2px rgba(0,0,0,0.1);
}

.range-inputs, 
.generation-select {
  margin-top: 0;
}

.generation-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666666' d='M6 8.825L1.175 4 2.238 2.937 6 6.7l3.762-3.763L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.generation-select:focus {
  outline: none;
  border-color: var(--accent-color);
}

.generation-select option {
  padding: 8px;
  font-size: 0.95rem;
}

.range-inputs {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  background-color: #fff;
  color: #333;
  max-width: 80px;
  transition: all 0.2s ease;
}

.range-input:focus {
  outline: none;
  border-color: var(--accent-color);  
}

.type-filter-container {
  width: 100%;
  margin-bottom: 1.5rem;
}

.type-filter-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.type-filter-title-group {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 0.5rem;
}

.type-hint {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  display: inline-block;
  line-height: 1;
  padding-bottom: 0.1rem;
}

.top-filters {
  display: flex;
  gap: 2.5rem;
  padding-bottom: 1rem;
  padding-top: 10px;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
}

.type-buttons {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
  margin-top: 0.3rem;
}

@media (max-width: 900px) {
  .filter-half label {
    font-size: 1rem;
    top: -16px;
  }
  
  .type-buttons {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 600px) {
  .type-buttons {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .advanced-filters-content {
    padding: 1rem 1.5rem 1.5rem;
  }
}

.advanced-filters {
  width: 100%;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.advanced-filters-content {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  transform: translateY(-20px);
  padding: 0;
  border: none !important;
}

.advanced-filters.show {
  margin: 0;
  background-color: var(--card-color);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.advanced-filters.show .advanced-filters-content {
  max-height: 800px;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  padding: 1rem 1.5rem 3rem;
  position: relative;
}

.reset-filters-button {
  display: block;
  padding: 0.75rem;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 12px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  outline: none;
  text-align: center;
}

.reset-filters-button:hover {
  background-color: #e8e8e8;
}

.reset-filters-button:active {
  background-color: #e0e0e0;
}
</style>
