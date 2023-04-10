import type { ISODate } from '@/shared/types/date'

export interface Recordable {
  id: string
  taskId: string
  start: ISODate
  end?: ISODate
  stepRecords: Record<string, { start: ISODate; end?: ISODate }>
}
