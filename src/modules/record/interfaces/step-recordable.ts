import type { ISODate } from '@/shared/types/date'

export interface StepRecordable {
  start: ISODate
  end?: ISODate
}
