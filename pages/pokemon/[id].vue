<template>
  <div class="pokemon-detail-container">
    <div v-if="isLoading">
      <LoadingPokeballs />
    </div>
    
    <div v-else-if="pokemon">
      <div class="pokemon-detail-header">
        <div class="pokemon-navigation">
          <button class="nav-button" @click="navigateToPokemon(pokemon.id - 1)" :disabled="pokemon.id === 1">
            &lt; #{{ String(pokemon.id - 1).padStart(4, '0') }}
          </button>
        </div>
        
        <h1>{{ formatName(pokemon.name) }} <span class="pokemon-id">#{{ String(pokemon.id).padStart(4, '0') }}</span></h1>
        
        <div class="pokemon-navigation">
          <button class="nav-button" @click="navigateToPokemon(pokemon.id + 1)">
            #{{ String(pokemon.id + 1).padStart(4, '0') }} &gt;
          </button>
        </div>
      </div>
      
      <div class="pokemon-detail-content">
        <div class="pokemon-image-container">        
          <div class="pokemon-main-image">
            <img 
              :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
              :alt="pokemon.name"
            >
          </div>
        </div>
        
        <div class="pokemon-info-container">
          <div class="pokemon-description" v-if="pokemon.description">
            <p>{{ pokemon.description }}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Height</span>
              <span class="info-value">{{ formatHeight(pokemon.height) }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Category</span>
              <span class="info-value">{{ pokemon.category || 'Unknown' }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Weight</span>
              <span class="info-value">{{ formatWeight(pokemon.weight) }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Abilities</span>
              <span class="info-value">{{ formatAbilities(pokemon.abilities) }}</span>
            </div>
          </div>
          
          <div>
            <h3>Type</h3>
            <div class="pokemon-type-badges">
              <div 
                v-for="type in pokemon.types" 
                :key="type.slot"
                :class="['type-badge', type.type.name.toLowerCase()]"
              >
                {{ type.type.name }}
              </div>
            </div>
          </div>
          
          <div class="pokemon-weaknesses" v-if="pokemon.weakness && pokemon.weakness.length > 0">
            <h3>Weaknesses</h3>
            <div class="weakness-badges">
              <div 
                v-for="weakness in pokemon.weakness" 
                :key="weakness"
                :class="['type-badge', weakness.toLowerCase()]"
              >
                {{ weakness }}
              </div>
            </div>
          </div>
          
          <div class="stats-container">
            <h3>Stats</h3>
            <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat">
              <div class="stat-label">
                <span>{{ formatStatName(stat.stat.name) }}</span>
                <span>{{ stat.base_stat }}</span>
              </div>
              <div class="stat-bar-container">
                <div 
                  :class="['stat-bar', `type-${getPrimaryType}`]" 
                  :style="{ width: `${Math.min(stat.base_stat / 2, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
          
          <div class="evolution-chain" v-if="evolutionChainComplete && evolutionChainComplete.length > 1">
            <h3>Evolutions</h3>
            <div class="evolution-chain-container">
              <template v-for="(evo, index) in evolutionChainComplete" :key="evo.id">
                <div class="evolution-item" @click="navigateToPokemon(evo.id)">
                  <img :src="evo.image" :alt="evo.name">
                  <div class="evolution-name">{{ formatName(evo.name) }}</div>
                </div>
                
                <div v-if="index < evolutionChainComplete.length - 1" class="evolution-arrow">
                  →
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="error-message">
      <p>Sorry, we couldn't find that Pokémon.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import type { Pokemon, PokemonSpecies, EvolutionChain, EvolutionNode, PokemonWithEvolution } from '~/types/pokemon';

const emit = defineEmits(['loading-start', 'loading-end']);
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const pokemon = ref<PokemonWithEvolution | null>(null);
const isLoading = ref(true);
const evolutionChainComplete = ref<{ id: number, name: string, image: string }[]>([]);

const formatName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const formatAbilities = (abilities: Pokemon['abilities']): string => {
  return abilities
    .map(a => formatName(a.ability.name))
    .join(', ');
};

const formatHeight = (height: number): string => {
  const heightInMeters = height / 10;
  const feet = Math.floor(heightInMeters * 3.28084);
  const inches = Math.round((heightInMeters * 3.28084 - feet) * 12);
  return `${heightInMeters.toFixed(1)}m (${feet}'${inches}")`;
};

const formatWeight = (weight: number): string => {
  const weightInKg = weight / 10;
  const weightInLbs = weightInKg * 2.20462;
  return `${weightInKg.toFixed(1)} kg (${weightInLbs.toFixed(1)} lbs)`;
};

const formatStatName = (statName: string): string => {
  const statNameMap: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  };
  
  return statNameMap[statName] || formatName(statName);
};

const getPrimaryType = computed(() => {
  try {
    if (pokemon.value?.types?.[0]?.type?.name) {
      return pokemon.value.types[0].type.name.toLowerCase();
    }
  } catch (e) {
    console.error('Error getting primary type:', e);
  }
  return 'normal';
});

const navigateToPokemon = (id: number) => {
  if (id > 0) {
    router.push(`/pokemon/${id}`);
  }
};

const navigateToEvolution = (id: number) => {
  navigateToPokemon(id);
};

const getWeaknesses = (types: Pokemon['types']) => {
  const typeChart: Record<string, { weakTo: string[] }> = {
    'normal': { weakTo: ['fighting'] },
    'fire': { weakTo: ['water', 'ground', 'rock'] },
    'water': { weakTo: ['electric', 'grass'] },
    'electric': { weakTo: ['ground'] },
    'grass': { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'] },
    'ice': { weakTo: ['fire', 'fighting', 'rock', 'steel'] },
    'fighting': { weakTo: ['flying', 'psychic', 'fairy'] },
    'poison': { weakTo: ['ground', 'psychic'] },
    'ground': { weakTo: ['water', 'grass', 'ice'] },
    'flying': { weakTo: ['electric', 'ice', 'rock'] },
    'psychic': { weakTo: ['bug', 'ghost', 'dark'] },
    'bug': { weakTo: ['fire', 'flying', 'rock'] },
    'rock': { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'] },
    'ghost': { weakTo: ['ghost', 'dark'] },
    'dragon': { weakTo: ['ice', 'dragon', 'fairy'] },
    'dark': { weakTo: ['fighting', 'bug', 'fairy'] },
    'steel': { weakTo: ['fire', 'fighting', 'ground'] },
    'fairy': { weakTo: ['poison', 'steel'] }
  };

  const weaknesses = new Set<string>();
  
  types.forEach(typeObj => {
    const typeName = typeObj.type.name;
    if (typeChart[typeName]) {
      typeChart[typeName].weakTo.forEach(weakness => {
        weaknesses.add(weakness);
      });
    }
  });
  
  return Array.from(weaknesses);
};

const processEvolutionChain = async (chain: EvolutionNode): Promise<{ id: number, name: string, image: string }[]> => {
  const result: { id: number, name: string, image: string }[] = [];
  
  const processNode = async (node: EvolutionNode) => {   
    const id = Number(node.species.url.split('/').filter(Boolean).pop());
      
    try {
      const pokemonData = await $fetch<Pokemon>(`${config.public.apiBase}/pokemon/${id}`);
      const image = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
      
      result.push({
        id,
        name: node.species.name,
        image
      });
    } catch (error) {
      console.error(`Failed to fetch Pokemon data for evolution ${node.species.name}:`, error);
    }
        
    for (const evoNode of node.evolves_to) {
      await processNode(evoNode);
    }
  };
  
  await processNode(chain);
  return result;
};

const findAdjacentEvolutions = (evolutions: { id: number, name: string, image: string }[], currentId: number) => {
  const currentIndex = evolutions.findIndex(evo => evo.id === currentId);
  
  if (currentIndex === -1) {   
    const current = evolutions[0] || { id: currentId, name: 'unknown', image: '' };
    return { previous: undefined, current, next: undefined };
  }
  
  return {
    previous: currentIndex > 0 ? evolutions[currentIndex - 1] : undefined,
    current: evolutions[currentIndex],
    next: currentIndex < evolutions.length - 1 ? evolutions[currentIndex + 1] : undefined
  };
};

const fetchPokemonData = async (pokemonId: string | number) => {
  isLoading.value = true;
  emit('loading-start');
  
  try {   
    const pokemonData = await $fetch<Pokemon>(`${config.public.apiBase}/pokemon/${pokemonId}`);   
    const speciesData = await $fetch<PokemonSpecies>(`${config.public.apiBase}/pokemon-species/${pokemonId}`);    
   
    const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    const description = descriptionEntry ? 
      descriptionEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 
      'No description available';    
   
    const genusEntry = speciesData.genera.find(g => g.language.name === 'en');
    const category = genusEntry ? 
      genusEntry.genus.replace(' Pokémon', '') : 
      'Unknown';
       
    const evolutionChainId = speciesData.evolution_chain.url.split('/').filter(Boolean).pop();   
    const evolutionData = await $fetch<EvolutionChain>(`${config.public.apiBase}/evolution-chain/${evolutionChainId}`);   
    const evolutions = await processEvolutionChain(evolutionData.chain);
    evolutionChainComplete.value = evolutions;    

    const adjacentEvolutions = findAdjacentEvolutions(evolutions, pokemonData.id);   
    const weaknesses = getWeaknesses(pokemonData.types);
       
    pokemon.value = {
      ...pokemonData,
      species: speciesData,
      description,
      category,
      weakness: weaknesses,
      evolutionChain: {
        previous: adjacentEvolutions.previous,
        current: adjacentEvolutions.current || { id: pokemonData.id, name: pokemonData.name, image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default },
        next: adjacentEvolutions.next
      }
    };
    
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    pokemon.value = null;
  } finally {
    isLoading.value = false;
    emit('loading-end');
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchPokemonData(newId.toString());
  }
});

onMounted(() => {
  if (route.params.id) {
    fetchPokemonData(route.params.id.toString());
  }
});
</script>
