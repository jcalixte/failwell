import type { Stepable } from '@/modules/task/interfaces/stepable'
import { faker } from '@faker-js/faker'

export const createStepFixture = (partialStep?: Partial<Stepable>) => ({
  id: partialStep?.id ?? faker.datatype.uuid(),
  title: partialStep?.title ?? faker.animal.bird(),
  estimation:
    partialStep?.estimation ??
    faker.datatype.number({
      min: 0,
      max: 40
    })
})
