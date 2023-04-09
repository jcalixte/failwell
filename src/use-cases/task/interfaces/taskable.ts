import type { Stepable } from '@/use-cases/task/interfaces/stepable'

export interface Taskable {
  id: string
  title: string
  date: Date
  link: string | null
  steps: Stepable[]
}
