import type { ISODate } from '@/shared/types/date'
import type { TimeRange } from './time-range'

export interface Recordable {
  taskId: string
  start: ISODate
  end?: ISODate
  stepRecords: Record<string, TimeRange>
  notes: string
  breakTime?: TimeRange
  currentStepId: string | null
}
