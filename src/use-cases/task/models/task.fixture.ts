import { faker } from '@faker-js/faker'
import type { Stepable } from '../interfaces/stepable'
import type { Taskable } from '../interfaces/taskable'
import { createStepFixture } from './step.fixture'
import { Task } from './task'

export const createTaskFixture = (
  partialTask?: Partial<Taskable>,
  ...steps: Stepable[]
) =>
  new Task(
    partialTask?.id ?? faker.datatype.uuid(),
    partialTask?.title ?? faker.animal.bird()
  ).addSteps(...(steps ?? createStepFixture()))
