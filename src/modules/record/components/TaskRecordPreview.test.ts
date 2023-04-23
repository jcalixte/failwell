import { createTaskFixture } from '@/modules/task/models/task.fixture'
import { router } from '@/router'
import { toISODate } from '@/shared/types/date'
import { withPlugins } from '@/tests/utils'
import { faker } from '@faker-js/faker'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRecordableFixture } from '../interfaces/recordable.fixture'
import TaskRecordPreview from './TaskRecordPreview.vue'

const mountTaskRecordPreview = (withRecord = false) => {
  const task = createTaskFixture()
  const end = toISODate(new Date('2023-04-17T20:00:00.000Z'))
  const record = createRecordableFixture({
    taskId: task.id,
    stepRecords: {
      [faker.datatype.uuid()]: {
        start: toISODate(new Date('2023-04-17T19:00:00.000Z')),
        end
      }
    },
    end
  })

  const wrapper = mount(TaskRecordPreview, {
    ...withPlugins({
      'task-store': { tasks: [task] },
      'task-record-store': withRecord
        ? {
            currentStepId: null,
            records: {
              [task.id]: record
            }
          }
        : undefined
    }),
    props: {
      taskId: task.id
    }
  })

  return {
    task,
    wrapper
  }
}

describe('Task Record Preview', () => {
  it('displays a start recording', () => {
    const { wrapper } = mountTaskRecordPreview()

    expect(wrapper.text()).toContain('start recording')
  })

  it('displays no record yet if there is no record', () => {
    const { wrapper } = mountTaskRecordPreview()

    expect(wrapper.text()).toContain('No record yet')
  })

  it('displays the duration of a recorded task', () => {
    const { wrapper } = mountTaskRecordPreview(true)

    expect(wrapper.text()).toContain('last time: 60 minutes')
  })

  it('navigates to recording view on click', async () => {
    const { task, wrapper } = mountTaskRecordPreview()

    const spyOnPush = vi.spyOn(router, 'push')

    await wrapper.find('a').trigger('click')

    expect(spyOnPush).toHaveBeenCalledTimes(1)
    expect(spyOnPush).toHaveBeenCalledWith({
      name: 'record-view',
      params: {
        taskId: task.id
      }
    })
  })
})
