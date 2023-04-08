import type { Stepable } from '@/use-cases/task/interfaces/stepable'
import { Step } from '@/use-cases/task/models/step'
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
