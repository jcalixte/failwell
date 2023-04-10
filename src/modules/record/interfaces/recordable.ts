import type { ISODate } from '@/shared/types/date'
import type { StepRecordable } from './step-recordable'

export interface Recordable {
  id: string
  taskId: string
  start: ISODate
  end?: ISODate
  stepRecords: Record<string, StepRecordable>
}
