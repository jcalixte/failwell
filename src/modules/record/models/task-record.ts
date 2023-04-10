import type { Recordable } from '../interfaces/recordable'

export class TaskRecord implements Recordable {
  public start: Date = new Date()
  public end: Date | undefined = undefined
  public stepRecords: Record<string, { start: Date; end?: Date }> = {}

  public constructor(
    public readonly id: string,
    public readonly taskId: string
  ) {}

  public get duration(): number | null {
    if (!this.end) {
      return null
    }

    const durationMilliseconds = this.end.getTime() - this.start.getTime()

    return Math.round(durationMilliseconds / (1000 * 60))
  }
}
