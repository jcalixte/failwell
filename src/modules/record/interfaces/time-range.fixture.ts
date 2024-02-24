import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import type { TimeRange } from './time-range'

export const fixtureTimeRange = (
  partialTimeRange?: Partial<TimeRange>
): TimeRange => {
  const [start, end] = faker.date.betweens({
    from: toISODate(faker.date.past({ years: 1 })),
    to: toISODate(new Date()),
    count: 2
  })

  return {
    start: partialTimeRange?.start ?? toISODate(start),
    end: partialTimeRange?.end ?? toISODate(end)
  }
}
