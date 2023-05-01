import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import type { Recordable } from '../interfaces/recordable'
import { createTimeRangeFixture } from '../interfaces/time-range.fixture'
import { TaskRecord } from './task-record'

describe('Task Record', () => {
  it('creates a Record from a Recordable', () => {
    const recordable: Recordable = {
      taskId: faker.datatype.uuid(),
      notes: faker.lorem.paragraphs(),
      start: toISODate(faker.date.past(1)),
      end: toISODate(faker.date.past()),
      breakTime: createTimeRangeFixture(),
      stepRecords: {
        [faker.datatype.uuid()]: createTimeRangeFixture()
      }
    }

    expect(TaskRecord.fromRecordable(recordable)).toEqual(recordable)
  })
})
