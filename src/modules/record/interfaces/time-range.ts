import type { ISODate } from '@/shared/types/date'

export interface TimeRange {
  start: ISODate
  end?: ISODate
}
