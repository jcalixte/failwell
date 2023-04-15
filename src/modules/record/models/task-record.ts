import { toISODate, type ISODate } from '@/shared/types/date'
import type { Recordable } from '../interfaces/recordable'
import type { StepRecordable } from '../interfaces/step-recordable'

export class TaskRecord implements Recordable {
  public start: ISODate = toISODate(new Date())
  public end: ISODate | undefined = undefined
  public stepRecords: Record<string, StepRecordable> = {}
  public notes = ''

  public constructor(public readonly taskId: string) {}

  public get hasStepRecords() {
    return Object.values(this.stepRecords).length > 0
  }

  public static fromRecordable(recordable: Recordable) {
    const taskRecord = new TaskRecord(recordable.taskId)

    taskRecord.stepRecords = recordable.stepRecords
    taskRecord.start = recordable.start
    taskRecord.end = recordable.end

    return taskRecord
  }
}
