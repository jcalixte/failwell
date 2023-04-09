import type { Stepable } from '@/modules/task/interfaces/stepable'

export interface Taskable {
  id: string
  title: string
  date: Date
  link: string | null
  steps: Stepable[]
}
