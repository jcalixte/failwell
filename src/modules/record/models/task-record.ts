import { toISODate, type ISODate } from '@/shared/types/date'
import type { Recordable } from '../interfaces/recordable'
import type { TimeRange } from '../interfaces/time-range'

export class TaskRecord implements Recordable {
  public start: ISODate = toISODate(new Date())
  public end: ISODate | undefined = undefined
  public stepRecords: Record<string, TimeRange> = {}
  public notes = ''
  public breakTime?: TimeRange
  public currentStepId: string | null = null

  public constructor(public readonly taskId: string) {}

  public get hasStepRecords() {
    return Object.values(this.stepRecords).length > 0
  }

  public static fromRecordable(recordable: Recordable) {
    const taskRecord = new TaskRecord(recordable.taskId)

    taskRecord.stepRecords = recordable.stepRecords
    taskRecord.currentStepId = recordable.currentStepId
    taskRecord.start = recordable.start
    taskRecord.end = recordable.end
    taskRecord.breakTime = recordable.breakTime
    taskRecord.notes = recordable.notes

    return taskRecord
  }
}
