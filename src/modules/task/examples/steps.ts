import { adaptTextareaToSteps } from '@/modules/task/infra/adaptStepsToTextarea'
import type { Stepable } from '@/modules/task/interfaces/stepable'

export const exampleSteps: Stepable[] =
  adaptTextareaToSteps(`create math.test file, test add function for simple cases | 3
create the math file, implement add function | 3
commit | 1
TDD for the multiply function | 8
write documentation | 10
commit, push and create the PR | 5`)
