import type { Stepable } from '@/modules/task/interfaces/stepable'
import { createUuid } from '@/shared/create-uuid'

export const exampleSteps: Stepable[] = [
  {
    id: createUuid(),
    title: 'create math.test file, test add function for simple cases',
    estimation: 3
  },
  {
    id: createUuid(),
    title: 'create the math file, implement add function',
    estimation: 3
  },
  {
    id: createUuid(),
    title: 'commit',
    estimation: 1
  },
  {
    id: createUuid(),
    title: 'TDD for the multiply function',
    estimation: 8
  },
  {
    id: createUuid(),
    title: 'write documentation',
    estimation: 10
  },
  {
    id: createUuid(),
    title: 'commit, push and create the PR',
    estimation: 5
  }
]
