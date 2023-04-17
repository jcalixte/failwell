import { toISODate } from '@/shared/types/date'
import { describe, expect, it } from 'vitest'
import { createRecordableFixture } from '../interfaces/recordable.fixture'
import { addBreakTimeToStepRecords } from './breaktime-service'

describe('Break Time Service', () => {
  it('adds no break time if there is no break time', () => {
    const record = createRecordableFixture({
      breakTime: undefined
    })

    expect(addBreakTimeToStepRecords(record)).toEqual(record)
  })

  it('adds no break time if the break is not over yet', () => {
    const record = createRecordableFixture({
      breakTime: {
        start: toISODate(new Date('2023-04-17T19:00:00.000Z'))
      },
      stepRecords: {
        'step-id-1': {
          start: toISODate(new Date('2023-04-17T18:00:00.000Z'))
        }
      }
    })

    expect(addBreakTimeToStepRecords(record)).toEqual(record)
  })

  it('adds break time if break time is over', () => {
    const record = createRecordableFixture({
      breakTime: {
        start: toISODate(new Date('2023-04-17T19:00:00.000Z')),
        end: toISODate(new Date('2023-04-17T20:00:00.000Z'))
      },
      stepRecords: {
        'step-id-1': {
          start: toISODate(new Date('2023-04-17T18:00:00.000Z'))
        }
      }
    })

    expect(addBreakTimeToStepRecords(record)).toEqual({
      ...record,
      stepRecords: {
        'step-id-1': {
          start: toISODate(new Date('2023-04-17T19:00:00.000Z'))
        }
      }
    })
  })

  it('adds break time only for unfinished step records', () => {
    const record = createRecordableFixture({
      breakTime: {
        start: toISODate(new Date('2023-04-17T19:00:00.000Z')),
        end: toISODate(new Date('2023-04-17T20:00:00.000Z'))
      },
      stepRecords: {
        'step-id-1': {
          start: toISODate(new Date('2023-04-17T17:00:00.000Z')),
          end: toISODate(new Date('2023-04-17T18:00:00.000Z'))
        },
        'step-id-2': {
          start: toISODate(new Date('2023-04-17T18:00:00.000Z'))
        }
      }
    })

    expect(addBreakTimeToStepRecords(record)).toEqual({
      ...record,
      stepRecords: {
        'step-id-1': {
          start: toISODate(new Date('2023-04-17T17:00:00.000Z')),
          end: toISODate(new Date('2023-04-17T18:00:00.000Z'))
        },
        'step-id-2': {
          start: toISODate(new Date('2023-04-17T19:00:00.000Z'))
        }
      }
    })
  })
})
