import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StepInput from './StepInput.vue'

describe('Step input', () => {
  it('displays a text area with steps inside', () => {
    const wrapper = mount(StepInput, {
      props: {
        modelValue: []
      }
    })

    expect(wrapper.text()).toContain('textarea')
  })
})
