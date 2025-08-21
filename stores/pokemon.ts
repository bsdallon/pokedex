import { defineStore } from 'pinia';
import { 
  PokemonSchema, 
  PokemonListResponseSchema,
  type Pokemon
} from '~/schemas/pokemon';

function isWeakAgainst(defenderTypes: string[], attackingType: string): boolean {
  const totalEffectiveness = defenderTypes.reduce((effectiveness, defenderType) => {
    return effectiveness * (typeChart[attackingType as keyof typeof typeChart][defenderType as keyof typeof typeChart]);
  }, 1);

  return totalEffectiveness >= 2;
}

// Type effectiveness chart (2 = super effective, 1 = normal, 0.5 = not very effective, 0 = immune)
const typeChart = {
  normal: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, 
    poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 0, 
    dragon: 1, dark: 1, steel: 1, fairy: 1
  },
  fire: {
    normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 0.5, fighting: 1, 
    poison: 1, ground: 2, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, 
    dragon: 1, dark: 1, steel: 0.5, fairy: 0.5
  },
  water: {
    normal: 1, fire: 0.5, water: 0.5, electric: 2, grass: 2, ice: 0.5, fighting: 1, 
    poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, 
    dragon: 1, dark: 1, steel: 0.5, fairy: 1
  },
  electric: {
    normal: 1, fire: 1, water: 1, electric: 0.5, grass: 1, ice: 1, fighting: 1, 
    poison: 1, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, 
    dragon: 1, dark: 1, steel: 0.5, fairy: 1
  },
  grass: {
    normal: 1, fire: 2, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, fighting: 1, 
    poison: 2, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, 
    dragon: 1, dark: 1, steel: 1, fairy: 1
  },
  ice: {
    normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 0.5, fighting: 2, 
    poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, 
    dragon: 1, dark: 1, steel: 2, fairy: 1
  },
  fighting: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, 
    poison: 1, ground: 1, flying: 2, psychic: 2, bug: 0.5, rock: 0.5, ghost: 1, 
    dragon: 1, dark: 0.5, steel: 1, fairy: 2
  },
  poison: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 0.5, ice: 1, fighting: 0.5, 
    poison: 0.5, ground: 2, flying: 1, psychic: 2, bug: 0.5, rock: 1, ghost: 1, 
    dragon: 1, dark: 1, steel: 1, fairy: 0.5
  },
  ground: {
    normal: 1, fire: 1, water: 2, electric: 0, grass: 2, ice: 2, fighting: 1, 
    poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 1, 
    dragon: 1, dark: 1, steel: 1, fairy: 1
  },
  flying: {
    normal: 1, fire: 1, water: 1, electric: 2, grass: 0.5, ice: 2, fighting: 0.5, 
    poison: 1, ground: 0, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, 
    dragon: 1, dark: 1, steel: 1, fairy: 1
  },
  psychic: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, 
    poison: 1, ground: 1, flying: 1, psychic: 0.5, bug: 2, rock: 1, ghost: 2, 
    dragon: 1, dark: 2, steel: 1, fairy: 1
  },
  bug: {
    normal: 1, fire: 2, water: 1, electric: 1, grass: 0.5, ice: 1, fighting: 0.5, 
    poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 1, rock: 2, ghost: 1, 
    dragon: 1, dark: 1, steel: 1, fairy: 1
  },
  rock: {
    normal: 0.5, fire: 0.5, water: 2, electric: 1, grass: 2, ice: 1, fighting: 2, 
    poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, 
    dragon: 1, dark: 1, steel: 2, fairy: 1
  },
  ghost: {
    normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0, 
    poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 2, 
    dragon: 1, dark: 2, steel: 1, fairy: 1
  },
  dragon: {
    normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, fighting: 1, 
    poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, 
    dragon: 2, dark: 1, steel: 1, fairy: 2
  },
  dark: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, 
    poison: 1, ground: 1, flying: 1, psychic: 0, bug: 2, rock: 1, ghost: 0.5, 
    dragon: 1, dark: 0.5, steel: 1, fairy: 2
  },
  steel: {
    normal: 0.5, fire: 2, water: 1, electric: 1, grass: 0.5, ice: 0.5, fighting: 2, 
    poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, ghost: 1, 
    dragon: 0.5, dark: 1, steel: 0.5, fairy: 0.5
  },
  fairy: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, 
    poison: 2, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 1, 
    dragon: 0, dark: 0.5, steel: 2, fairy: 1
  }
};

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as Pokemon[],
    searchQuery: '',
    selectedTypes: [] as string[],
    filterMode: 'type' as 'type' | 'weakness',
    selectedGeneration: '',
    loadingStates: {
      fetchingList: false,
      fetchingDetail: false,
      fetchingEvolution: false,
      global: false
    },
    error: null as string | null,
    rangeMin: 1,
    rangeMax: 60,
    sortOption: 'id-asc',
    lastFetchTime: 0,
    cacheExpiration: 3600000
  }),

  getters: {
    isLoading(): boolean {
      return Object.values(this.loadingStates).some(state => state === true);
    },
    
    filteredPokemons(): Pokemon[] {
      const query = this.searchQuery.toLowerCase().trim();
      
      return this.pokemons.filter((pokemon: Pokemon) => {
        if (query) {
          const nameMatch = pokemon.name.toLowerCase().includes(query);          
          const searchId = query.startsWith('#') ? query.slice(1) : query;
          const searchNum = parseInt(searchId);
          const idMatch = !isNaN(searchNum) && pokemon.id === searchNum;
          
          if (!nameMatch && !idMatch) {
            return false;
          }
        }

        if (this.selectedTypes.length > 0) {
          if (this.filterMode === 'type') {
            // Pokemon must have ALL selected types
            const hasAllTypes = this.selectedTypes.every(type => 
              pokemon.types.some(t => t.type.name === type)
            );
            if (!hasAllTypes) {
              return false;
            }
          } else {
            const isWeakToSelected = this.selectedTypes.every(attackingType => {              
              const pokemonTypes = pokemon.types.map(t => t.type.name);
              return isWeakAgainst(pokemonTypes, attackingType);
            });
            if (!isWeakToSelected) {
              return false;
            }
          }
        }
      
        if (query) {
          const searchId = query.startsWith('#') ? query.slice(1) : query;
          const searchNum = parseInt(searchId);
          if (!isNaN(searchNum) && pokemon.id === searchNum) {
            return true;
          }
        }
        
        return pokemon.id >= this.rangeMin && pokemon.id <= this.rangeMax;
      })
      .sort((a, b) => {
        switch (this.sortOption) {
          case 'id-asc':
            return a.id - b.id;
          case 'id-desc':
            return b.id - a.id;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return a.id - b.id;
        }
      });
    },

    pokemonTypes(): string[] {
      const types = new Set<string>();
      this.pokemons.forEach(pokemon => {
        pokemon.types.forEach(t => types.add(t.type.name));
      });
      return Array.from(types).sort();
    },
    
    allGenerations(): Record<string, { name: string; range: [number, number] }> {    
      const generationsData: Record<string, { name: string; range: [number, number] }> = {
        'gen-1': { name: 'Generation I', range: [1, 151] },
        'gen-2': { name: 'Generation II', range: [152, 251] },
        'gen-3': { name: 'Generation III', range: [252, 386] },
        'gen-4': { name: 'Generation IV', range: [387, 493] },
        'gen-5': { name: 'Generation V', range: [494, 649] },
        'gen-6': { name: 'Generation VI', range: [650, 721] },
        'gen-7': { name: 'Generation VII', range: [722, 809] },
        'gen-8': { name: 'Generation VIII', range: [810, 905] },
        'gen-9': { name: 'Generation IX', range: [906, 1025] }
      };
      return generationsData;
    }
  },

  actions: {
    setLoadingState(state: keyof typeof this.loadingStates, value: boolean) {
      this.loadingStates[state] = value;
      this.loadingStates.global = Object.values(this.loadingStates).some(
        (s, i) => s === true && Object.keys(this.loadingStates)[i] !== 'global'
      );
    },

    async fetchPokemons() {
      const now = Date.now();
      const cachedData = this.loadCachedData();
      
      if (cachedData && 
          this.pokemons.length > 0 && 
          (now - this.lastFetchTime) < this.cacheExpiration) {
        console.log('Using cached Pokemon data');
        return;
      }
      
      const config = useRuntimeConfig();
      this.setLoadingState('fetchingList', true);
      this.error = null;
      
      try {        
        const response = await $fetch(`${config.public.apiBase}/pokemon?limit=1025`);  

        const validatedList = PokemonListResponseSchema.parse(response);       
     
        const pokemonDetails = await Promise.all(
          validatedList.results.map(async (pokemon) => {
            const details = await $fetch(pokemon.url);
           
            return PokemonSchema.parse(details);
          })
        );
        
        this.pokemons = pokemonDetails;
        this.lastFetchTime = now;
        this.cacheData();
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        this.error = 'Failed to fetch Pokemon data. Please try again.';
      } finally {
        this.setLoadingState('fetchingList', false);
      }
    },
    
    cacheData() {
      try {
        if (process.client) {
          localStorage.setItem('pokemon-cache', JSON.stringify({
            pokemons: this.pokemons,
            timestamp: this.lastFetchTime
          }));
        }
      } catch (error) {
        console.error('Error caching Pokemon data:', error);
      }
    },
    
    loadCachedData() {
      try {
        if (process.client) {
          const cachedData = localStorage.getItem('pokemon-cache');
          if (cachedData) {
            const { pokemons, timestamp } = JSON.parse(cachedData);
            this.pokemons = pokemons;
            this.lastFetchTime = timestamp;
            return true;
          }
        }
      } catch (error) {
        console.error('Error loading cached Pokemon data:', error);
      }
      return false;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setRange(min: number | null, max: number | null) {
      if (min === null && max === null) {      
        return;
      }
           
      const validMin = min === null ? this.rangeMin : min;
      const validMax = max === null ? this.rangeMax : max;
           
      const clampedMin = Math.max(1, Math.min(validMin, 1025));
      const clampedMax = Math.max(1, Math.min(validMax, 1025));      
     
      this.rangeMin = Math.min(clampedMin, clampedMax);
      this.rangeMax = Math.max(clampedMin, clampedMax);
    },

    toggleType(type: string) {
      const index = this.selectedTypes.indexOf(type);
      if (index === -1) {      
        if (this.selectedTypes.length < 2) {
          this.selectedTypes.push(type);
        }
      } else {       
        this.selectedTypes.splice(index, 1);
      }
    },

    setGeneration(generation: string | '') {
      this.selectedGeneration = generation;
      
      if (generation) {
        const generations = this.allGenerations;

        if (generations[generation]) {
          const range = generations[generation].range;
          this.rangeMin = range[0];
          this.rangeMax = range[1];
        }
      }
    }
  }
});
