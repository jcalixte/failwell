import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EstimationTimeArrival from './EstimationTimeArrival.vue'

describe('Estimation Time Arrival', () => {
  it('renders an ETA tag and the estimation', () => {
    const wrapper = mount(EstimationTimeArrival, {
      props: {
        estimation: 4
      }
    })

    expect(wrapper.get('.tags')).toBeDefined()

    const tags = wrapper.findAll('.tag')

    expect(tags.length).toBe(2)
    const [eta, label] = tags

    expect(eta.text()).toEqual('ETA')
    expect(label.text()).toEqual('4 minutes')
  })
})
