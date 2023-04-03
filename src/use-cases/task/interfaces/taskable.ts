import type { Stepable } from '@/use-cases/task/interfaces/stepable'

export interface Taskable {
  id: string
  title: string
  link: string | null
  steps: Stepable[]
}
