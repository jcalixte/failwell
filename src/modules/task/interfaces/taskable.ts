import type { Stepable } from '@/modules/task/interfaces/stepable'
import type { ISODate } from '@/shared/types/date'

export interface Taskable {
  id: string
  title: string
  date: ISODate
  link: string | null
  stepHistory: Stepable[][]
}
