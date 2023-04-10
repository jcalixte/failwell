import type { ISODate } from '@/shared/types/date'
import type { StepRecordable } from './step-recordable'

export interface Recordable {
  id: string
  taskId: string
  /**
   * @deprecated
   * TODO: Compute this data from step records
   */
  start: ISODate
  /**
   * @deprecated
   * TODO: Compute this data from step records
   */
  end?: ISODate
  stepRecords: Record<string, StepRecordable>
}
