import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '~/components/SearchBar.vue'

describe('SearchBar.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(SearchBar, {
      props: {
        searchQuery: '',
        showFilters: false,
      },
    })

    const input = wrapper.find('input.search-input')
    expect(input.exists()).toBe(true)

    const filterButton = wrapper.find('button.filter-toggle')
    expect(filterButton.exists()).toBe(true)
  })

  it('emits update:searchQuery event when input changes', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        searchQuery: '',
        showFilters: false,
      },
    })

    const input = wrapper.find('input.search-input')
    await input.setValue('pikachu')

    await input.trigger('input')

    expect(wrapper.emitted()['update:searchQuery']).toBeTruthy()
    expect(wrapper.emitted()['update:searchQuery'][0]).toEqual(['pikachu'])
  })

  it('clears search when clear button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        searchQuery: 'pikachu',
        showFilters: false,
      },
    })

    const clearButton = wrapper.find('button.clear-search')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')

    expect(wrapper.emitted()['update:searchQuery']).toBeTruthy()
    expect(wrapper.emitted()['update:searchQuery'][0]).toEqual([''])
  })

  it('toggles filters when filter button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        searchQuery: '',
        showFilters: false,
      },
    })

    const filterButton = wrapper.find('button.filter-toggle')

    await filterButton.trigger('click')

    expect(wrapper.emitted()['update:showFilters']).toBeTruthy()
    expect(wrapper.emitted()['update:showFilters'][0]).toEqual([true])
  })

  it('reflects prop changes to the input field', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        searchQuery: '',
        showFilters: false,
      },
    })

    await wrapper.setProps({ searchQuery: 'charizard' })

    const input = wrapper.find('input.search-input')
    expect(input.element.value).toBe('charizard')
  })
})
