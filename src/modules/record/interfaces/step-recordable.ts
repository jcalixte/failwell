import type { ISODate } from '@/shared/types/date'

export interface StepRecordable {
  problems: string[]
  start: ISODate
  end?: ISODate
}
