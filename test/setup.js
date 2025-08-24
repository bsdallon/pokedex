import { afterEach, beforeEach, vi } from 'vitest'
import { config } from '@vue/test-utils'

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $fetch: vi.fn(),
  }),
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'https://pokeapi.co/api/v2',
    },
  }),
  navigateTo: vi.fn(),
  defineNuxtPlugin: vi.fn(),
}))

config.global.stubs = {
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  Head: true,
  NuxtPage: true,
}

beforeEach(() => {
  vi.clearAllMocks()
})
