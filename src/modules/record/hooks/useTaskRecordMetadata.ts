import type { Recordable } from '@/modules/record/interfaces/recordable'
import { formatDiffInMinutes } from '@/shared/format-date'
import { toValue } from '@vueuse/core'
import { computed, type ComputedRef } from 'vue'

export const useTaskRecordMetadata = (
  record: ComputedRef<Recordable | null>
) => {
  const taskDurations = computed(() => {
    const recordValue = toValue(record)

    if (!recordValue?.end) {
      return []
    }

    const finishedTaskDurations = Object.values(recordValue.stepRecords)
      .filter((r) => !!r.end)
      .map((record) => formatDiffInMinutes(record.start, record.end!))

    return finishedTaskDurations
  })

  const duration = computed(() => {
    return taskDurations.value.reduce((a, b) => a + b, 0)
  })

  return {
    duration
  }
}
