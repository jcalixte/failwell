import { toISODate } from '@/shared/types/date'
import { faker } from '@faker-js/faker'
import type { Recordable } from './recordable'

export const fixtureRecordable = (
  partialRecordable?: Partial<Recordable>
): Recordable => ({
  taskId: partialRecordable?.taskId ?? faker.string.uuid(),
  notes: partialRecordable?.notes ?? faker.lorem.paragraph(),
  start: partialRecordable?.start ?? toISODate(faker.date.anytime()),
  breakTime: partialRecordable?.breakTime ?? undefined,
  stepRecords: partialRecordable?.stepRecords ?? {
    [faker.string.uuid()]: {
      start: toISODate(faker.date.anytime())
    }
  },
  currentStepId: null,
  end: partialRecordable?.end
})
