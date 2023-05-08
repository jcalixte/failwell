import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import type { TimeRange } from './time-range'

export const fixtureTimeRange = (
  partialTimeRange?: Partial<TimeRange>
): TimeRange => {
  const [start, end] = faker.date.betweens(
    toISODate(faker.date.past(1)),
    toISODate(new Date()),
    2
  )

  return {
    start: partialTimeRange?.start ?? toISODate(start),
    end: partialTimeRange?.end ?? toISODate(end)
  }
}
