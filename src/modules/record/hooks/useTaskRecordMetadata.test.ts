import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { fixtureRecordable } from '../interfaces/recordable.fixture'
import { TaskRecord } from '../models/task-record'
import { useTaskRecordMetadata } from './useTaskRecordMetadata'

describe('use task record metadata', () => {
  it('has no duration if there is no task', () => {
    const { duration } = useTaskRecordMetadata(computed(() => null))

    expect(duration.value).toEqual(0)
  })

  it('returns the right duration', () => {
    const end = toISODate(new Date('2023-04-17T20:00:00.000Z'))
    const record = fixtureRecordable({
      stepRecords: {
        [faker.string.uuid()]: {
          start: toISODate(new Date('2023-04-17T19:00:00.000Z')),
          end
        }
      },
      end
    })
    const { duration } = useTaskRecordMetadata(
      computed(() => TaskRecord.fromRecordable(record))
    )

    expect(duration.value).toEqual(60)
  })
})
