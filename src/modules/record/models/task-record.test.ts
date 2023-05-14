import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import type { Recordable } from '../interfaces/recordable'
import { fixtureRecordable } from '../interfaces/recordable.fixture'
import { fixtureTimeRange } from '../interfaces/time-range.fixture'
import { TaskRecord } from './task-record'

describe('Task Record', () => {
  it('creates a Record from a Recordable', () => {
    const recordable: Recordable = fixtureRecordable({
      taskId: faker.datatype.uuid(),
      notes: faker.lorem.paragraphs(),
      start: toISODate(faker.date.past(1)),
      end: toISODate(faker.date.past()),
      breakTime: fixtureTimeRange(),
      stepRecords: {
        [faker.datatype.uuid()]: fixtureTimeRange()
      }
    })

    expect(TaskRecord.fromRecordable(recordable)).toEqual(recordable)
  })

  it('tells if there are steps in the record', () => {
    const record = fixtureRecordable({
      stepRecords: {
        [faker.datatype.uuid()]: fixtureTimeRange()
      }
    })

    expect(TaskRecord.fromRecordable(record).hasStepRecords).toBe(true)
  })

  it('tells if there are no steps in the record', () => {
    const record = fixtureRecordable({
      stepRecords: {}
    })

    expect(TaskRecord.fromRecordable(record).hasStepRecords).toBe(false)
  })
})
