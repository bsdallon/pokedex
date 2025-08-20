import { defineStore } from 'pinia';
import type { Pokemon, PokemonListResponse } from '~/types/pokemon';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as Pokemon[],
    searchQuery: '',
    selectedTypes: [] as string[],
    selectedGeneration: '',
    isLoading: false,
    rangeMin: 1,
    rangeMax: 60,
    generations: {
      'gen-1': { name: 'Generation I', range: [1, 151] },
      'gen-2': { name: 'Generation II', range: [152, 251] },
      'gen-3': { name: 'Generation III', range: [252, 386] },
      'gen-4': { name: 'Generation IV', range: [387, 493] },
      'gen-5': { name: 'Generation V', range: [494, 649] },
      'gen-6': { name: 'Generation VI', range: [650, 721] },
      'gen-7': { name: 'Generation VII', range: [722, 809] },
      'gen-8': { name: 'Generation VIII', range: [810, 905] },
      'gen-9': { name: 'Generation IX', range: [906, 1025] }
    }
  }),

  getters: {
    filteredPokemons(): Pokemon[] {
      const query = this.searchQuery.toLowerCase().trim();
      
      return this.pokemons.filter((pokemon: Pokemon) => {
        // First check if it matches the search query (if there is one)
        if (query) {
          const nameMatch = pokemon.name.toLowerCase().includes(query);
          
          // Search by ID (with or without # prefix)
          const searchId = query.startsWith('#') ? query.slice(1) : query;
          const searchNum = parseInt(searchId);
          const idMatch = !isNaN(searchNum) && pokemon.id === searchNum;

          // If neither name nor ID matches the search, exclude this Pokemon
          if (!nameMatch && !idMatch) {
            return false;
          }
        }

        // If we get here, either there was no search query or the Pokemon matched it
        // Now check type filters
        if (this.selectedTypes.length > 0) {
          // Pokemon must have ALL selected types
          const hasAllTypes = this.selectedTypes.every(type => 
            pokemon.types.some(t => t.type.name === type)
          );
          if (!hasAllTypes) {
            return false;
          }
        }

        // Finally, check range (unless it's a direct ID search)
        if (query) {
          const searchId = query.startsWith('#') ? query.slice(1) : query;
          const searchNum = parseInt(searchId);
          // If it's a direct ID search, ignore range
          if (!isNaN(searchNum) && pokemon.id === searchNum) {
            return true;
          }
        }
        
        // Apply range filter
        return pokemon.id >= this.rangeMin && pokemon.id <= this.rangeMax;
      });
    },

    pokemonTypes(): string[] {
      const types = new Set<string>();
      this.pokemons.forEach(pokemon => {
        pokemon.types.forEach(t => types.add(t.type.name));
      });
      return Array.from(types).sort();
    }
  },

  actions: {
    async fetchPokemons() {
      const config = useRuntimeConfig();
      this.isLoading = true;
      
      try {
        // Artificial delay to show loading animation (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch all Pokemon up to the latest generation
        const response = await $fetch<PokemonListResponse>(`${config.public.apiBase}/pokemon?limit=1025`);
        
        // Fetch detailed info for each Pokemon
        const pokemonDetails = await Promise.all(
          response.results.map(async (pokemon: { url: string }) => {
            return await $fetch<Pokemon>(pokemon.url);
          })
        );
        
        this.pokemons = pokemonDetails;
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        this.isLoading = false;
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setRange(min: number | null, max: number | null) {
      if (min === null && max === null) {
        // Both empty, keep current values
        return;
      }
      
      // Handle one value being empty
      const validMin = min === null ? this.rangeMin : min;
      const validMax = max === null ? this.rangeMax : max;
      
      // Clamp the values to valid range
      const clampedMin = Math.max(1, Math.min(validMin, 1025));
      const clampedMax = Math.max(1, Math.min(validMax, 1025));
      
      // Then ensure min is less than max
      this.rangeMin = Math.min(clampedMin, clampedMax);
      this.rangeMax = Math.max(clampedMin, clampedMax);
    },

    toggleType(type: string) {
      const index = this.selectedTypes.indexOf(type);
      if (index === -1) {
        // Add type if not already selected and less than 2 types are selected
        if (this.selectedTypes.length < 2) {
          this.selectedTypes.push(type);
        }
      } else {
        // Remove type if already selected
        this.selectedTypes.splice(index, 1);
      }
    },

    setGeneration(generation: keyof typeof this.generations | '') {
      this.selectedGeneration = generation;
      if (generation && this.generations[generation]) {
        const range = this.generations[generation].range;
        if (range?.[0] !== undefined && range?.[1] !== undefined) {
          this.rangeMin = Number(range[0]);
          this.rangeMax = Number(range[1]);
        }
      }
    }
  }
});
