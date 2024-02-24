import { fixtureTask } from '@/modules/task/models/task.fixture'
import { toISODate } from '@/shared/types/date'
import { withPlugins } from '@/tests/utils'
import { faker } from '@faker-js/faker'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { fixtureRecordable } from '../interfaces/recordable.fixture'
import TaskRecordPreview from './TaskRecordPreview.vue'

const mountTaskRecordPreview = (withRecord = false) => {
  const task = fixtureTask()
  const end = toISODate(new Date('2023-04-17T20:00:00.000Z'))
  const record = fixtureRecordable({
    taskId: task.id,
    stepRecords: {
      [faker.string.uuid()]: {
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
  it('displays no record yet if there is no record', () => {
    const { wrapper } = mountTaskRecordPreview()

    expect(wrapper.text()).toContain('No record yet')
  })

  it('displays the duration of a recorded task', () => {
    const { wrapper } = mountTaskRecordPreview(true)

    expect(wrapper.text()).toContain('Last record took 60 minutes.')
  })
})
