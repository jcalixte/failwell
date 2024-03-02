import { faker } from '@faker-js/faker'
import type { Stepable } from '../interfaces/stepable'
import type { Taskable } from '../interfaces/taskable'
import { fixtureStep } from './step.fixture'
import { Task } from './task'

export const fixtureTask = (
  partialTask?: Partial<Taskable>,
  ...steps: Stepable[]
) =>
  new Task(
    partialTask?.id ?? faker.string.uuid(),
    partialTask?.title ?? faker.animal.bird()
  ).editSteps(...(steps ?? fixtureStep()))
