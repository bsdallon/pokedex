import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonCard from '~/components/PokemonCard.vue'
import { mockPokemonList } from '../utils/mockData'

describe('PokemonCard.vue', () => {
  it('renders correctly with pokemon data', () => {
    const pokemon = mockPokemonList[0] // Bulbasaur
    const wrapper = mount(PokemonCard, {
      props: { pokemon },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('.pokemon-card__name').text()).toBe('Bulbasaur')
    expect(wrapper.find('.pokemon-card__number').text()).toBe('#0001')

    const img = wrapper.find('.pokemon-card__image img')
    expect(img.attributes('src')).toBe(pokemon.sprites.front_default)
    expect(img.attributes('alt')).toBe(pokemon.name)

    const typeElements = wrapper.findAll('.type-badge')
    expect(typeElements.length).toBe(2)
    expect(typeElements[0].text()).toBe('Grass')
    expect(typeElements[1].text()).toBe('Poison')
  })

  it('formats pokemon id correctly', () => {
    const pokemon = { ...mockPokemonList[0], id: 25 } // Pikachu
    const wrapper = mount(PokemonCard, {
      props: { pokemon },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('.pokemon-card__number').text()).toBe('#0025')
  })

  it('formats pokemon name correctly', () => {
    const pokemon = { ...mockPokemonList[0], name: 'mr-mime' }
    const wrapper = mount(PokemonCard, {
      props: { pokemon },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('.pokemon-card__name').text()).toBe('Mr-mime')
  })
})
