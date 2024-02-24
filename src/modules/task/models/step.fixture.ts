import type { Stepable } from '@/modules/task/interfaces/stepable'
import { faker } from '@faker-js/faker'

export const fixtureStep = (partialStep?: Partial<Stepable>) => ({
  id: partialStep?.id ?? faker.string.uuid(),
  title: partialStep?.title ?? faker.animal.bird(),
  estimation:
    partialStep?.estimation ??
    faker.number.int({
      min: 0,
      max: 40
    })
})
