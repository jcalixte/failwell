import { formatDiffInMinutes } from '@/shared/format-date'
import { computed, isRef, type Ref } from 'vue'
import type { TaskRecord } from '../models/task-record'

export const useTaskRecordMetadata = (
  record: TaskRecord | Ref<TaskRecord | null>
) => {
  const duration = computed(() => {
    const recordValue = isRef(record) ? record.value : record
    if (!recordValue?.end) {
      return null
    }

    return formatDiffInMinutes(recordValue.start, recordValue?.end)
  })

  return {
    duration
  }
}
