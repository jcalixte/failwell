import type { Stepable } from '@/modules/task/interfaces/stepable'
import { Step } from '@/modules/task/models/step'
import { faker } from '@faker-js/faker'

export const createStepFixture = (partialStep?: Partial<Stepable>) =>
  new Step(
    partialStep?.id ?? faker.datatype.uuid(),
    partialStep?.title ?? faker.animal.bird(),
    partialStep?.estimation ??
      faker.datatype.number({
        min: 0,
        max: 40
      })
  )
