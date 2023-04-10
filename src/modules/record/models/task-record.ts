import { toISODate, type ISODate } from '@/shared/types/date'
import type { Recordable } from '../interfaces/recordable'

export class TaskRecord implements Recordable {
  public start: ISODate = toISODate(new Date())
  public end: ISODate | undefined = undefined
  public stepRecords: Record<string, { start: ISODate; end?: ISODate }> = {}

  public constructor(
    public readonly id: string,
    public readonly taskId: string
  ) {}

  public get duration(): number | null {
    if (!this.end) {
      return null
    }

    const durationMilliseconds =
      new Date(this.end).getTime() - new Date(this.start).getTime()

    return Math.round(durationMilliseconds / (1000 * 60))
  }
}
