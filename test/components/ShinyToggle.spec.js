import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShinyToggle from '@/components/ShinyToggle.vue'

describe('ShinyToggle.vue', () => {
  it('renders the button and SVG', () => {
    const wrapper = mount(ShinyToggle, {
      props: { modelValue: false },
    })
    expect(wrapper.find('button.shiny-toggle-btn').exists()).toBe(true)
    expect(wrapper.find('svg.shiny-icon').exists()).toBe(true)
  })

  it('applies the active class when modelValue is true', async () => {
    const wrapper = mount(ShinyToggle, {
      props: { modelValue: true },
    })
    expect(wrapper.find('button').classes()).toContain('active')
  })

  it('emits update:modelValue with the toggled value on click', async () => {
    const wrapper = mount(ShinyToggle, {
      props: { modelValue: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
  })
})
