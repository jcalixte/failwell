import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createRecordableFixture } from '../interfaces/recordable.fixture'
import { TaskRecord } from '../models/task-record'
import { useTaskRecordMetadata } from './useTaskRecordMetadata'

describe('use task record metadata', () => {
  it('has no duration if there is no task', () => {
    const { duration } = useTaskRecordMetadata(ref(null))

    expect(duration.value).toEqual(0)
  })

  it('returns the right duration', () => {
    const end = toISODate(new Date('2023-04-17T20:00:00.000Z'))
    const record = createRecordableFixture({
      stepRecords: {
        [faker.datatype.uuid()]: {
          start: toISODate(new Date('2023-04-17T19:00:00.000Z')),
          end
        }
      },
      end
    })
    const { duration } = useTaskRecordMetadata(
      TaskRecord.fromRecordable(record)
    )

    expect(duration.value).toEqual(60)
  })
})
