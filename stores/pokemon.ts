import { defineStore } from 'pinia';
import type { Pokemon, PokemonListResponse } from '~/types/pokemon';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as Pokemon[],
    searchQuery: '',
    isLoading: false
  }),

  getters: {
    filteredPokemons(): Pokemon[] {
      const query = this.searchQuery.toLowerCase();
      return this.pokemons.filter((pokemon: Pokemon) => 
        pokemon.name.toLowerCase().includes(query)
      );
    }
  },

  actions: {
    async fetchPokemons() {
      const config = useRuntimeConfig();
      this.isLoading = true;
      
      try {
        // Fetch first 60 Pokemon
        const response = await $fetch<PokemonListResponse>(`${config.public.apiBase}/pokemon?limit=60`);
        
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
    }
  }
});
