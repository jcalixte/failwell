import { withStore } from '@/tests/utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NewTaskVue from './NewTaskForm.vue'

describe('New Task Form', () => {
  it('displays New Task Form title', () => {
    const wrapper = mount(NewTaskVue, withStore())

    expect(wrapper.text()).toContain('New Task Form')
  })
})
