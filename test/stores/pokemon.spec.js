import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePokemonStore } from '~/stores/pokemon'
import { mockPokemonList } from '../utils/mockData'

global.$fetch = vi.fn()

describe('Pokemon Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePokemonStore()

    store.pokemons = [...mockPokemonList]
  })

  describe('filteredPokemons getter', () => {
    it('returns all pokemons when no filters are applied', () => {
      expect(store.filteredPokemons.length).toBe(2)
    })

    it('filters pokemons by name', () => {
      store.setSearchQuery('char')
      expect(store.filteredPokemons.length).toBe(1)
      expect(store.filteredPokemons[0].name).toBe('charmander')
    })

    it('filters pokemons by id', () => {
      store.setSearchQuery('1')
      expect(store.filteredPokemons.length).toBe(1)
      expect(store.filteredPokemons[0].id).toBe(1)
    })

    it('filters pokemons by id with # prefix', () => {
      store.setSearchQuery('#4')
      expect(store.filteredPokemons.length).toBe(1)
      expect(store.filteredPokemons[0].id).toBe(4)
    })

    it('applies range filters correctly', () => {
      store.setRange(1, 3)
      expect(store.filteredPokemons.length).toBe(1)
      expect(store.filteredPokemons[0].id).toBe(1)
    })

    it('applies type filters correctly', () => {
      store.toggleType('grass')
      expect(store.filteredPokemons.length).toBe(1)
      expect(store.filteredPokemons[0].name).toBe('bulbasaur')
    })

    it('sorts pokemons by id ascending by default', () => {
      expect(store.filteredPokemons[0].id).toBe(1)
      expect(store.filteredPokemons[1].id).toBe(4)
    })

    it('sorts pokemons by id descending when specified', () => {
      store.sortOption = 'id-desc'
      expect(store.filteredPokemons[0].id).toBe(4)
      expect(store.filteredPokemons[1].id).toBe(1)
    })

    it('sorts pokemons by name ascending when specified', () => {
      store.sortOption = 'name-asc'
      expect(store.filteredPokemons[0].name).toBe('bulbasaur')
      expect(store.filteredPokemons[1].name).toBe('charmander')
    })

    it('sorts pokemons by name descending when specified', () => {
      store.sortOption = 'name-desc'
      expect(store.filteredPokemons[0].name).toBe('charmander')
      expect(store.filteredPokemons[1].name).toBe('bulbasaur')
    })
  })

  describe('loading states', () => {
    it('tracks loading state correctly', () => {
      expect(store.isLoading).toBe(false)

      store.setLoadingState('fetchingList', true)
      expect(store.isLoading).toBe(true)
      expect(store.loadingStates.global).toBe(true)

      store.setLoadingState('fetchingList', false)
      expect(store.isLoading).toBe(false)
      expect(store.loadingStates.global).toBe(false)
    })
  })

  describe('pokemon types getter', () => {
    it('returns unique pokemon types', () => {
      const types = store.pokemonTypes
      expect(types).toContain('grass')
      expect(types).toContain('poison')
      expect(types).toContain('fire')
      expect(types.length).toBe(3)
    })
  })
})
