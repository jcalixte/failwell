import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { fixtureStep } from '../models/step.fixture'
import StepInput from './StepInput.vue'

describe('Step input textarea', () => {
  it('displays a text area with steps inside', () => {
    const wrapper = mount(StepInput, {
      props: {
        modelValue: []
      }
    })

    expect(wrapper.get('textarea')).toBeDefined()
  })

  it('displays the steps in the textarea', () => {
    const steps = [fixtureStep(), fixtureStep(), fixtureStep()]

    const stepsInTextarea = steps
      .map((s) => `- ${s.title} | ${s.estimation}`)
      .join('\n')

    const wrapper = mount(StepInput, {
      props: {
        modelValue: steps
      }
    })

    const textarea = wrapper.get('textarea')

    expect(textarea.element.value).toEqual(stepsInTextarea)
  })
})
