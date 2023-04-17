import { toISODate } from '@/shared/types/date'
import type { Recordable } from '../interfaces/recordable'

export const addBreakTimeToStepRecords = (record: Recordable): Recordable => {
  const breakTime = record.breakTime

  if (!breakTime || !breakTime.end) {
    return record
  }

  const diffInMs =
    new Date(breakTime.end).getTime() - new Date(breakTime.start).getTime()

  const stepRecords = record.stepRecords

  for (const stepId in stepRecords) {
    if (!stepRecords[stepId].end) {
      const newStart = new Date(stepRecords[stepId].start).getTime() + diffInMs

      stepRecords[stepId].start = toISODate(new Date(newStart))
    }
  }

  return { ...record, stepRecords }
}
