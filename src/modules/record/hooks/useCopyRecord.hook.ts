import { useTaskRecordStore } from '@/modules/record/stores/useTaskRecordStore'
import type { Task } from '@/modules/task/models/task'
import { formatDiffInMinutes, formatToShortDate } from '@/shared/format-date'
import { toValue } from '@vueuse/core'
import { ref, type ComputedRef } from 'vue'

export const useCopyRecord = (task: ComputedRef<Task | null>) => {
  const recordStore = useTaskRecordStore()

  const canShareTask = !!navigator.clipboard
  const taskCopied = ref(false)

  const shareTask = async () => {
    const t = toValue(task)

    if (!t) {
      return
    }

    const record = recordStore.getTaskRecord(t.id)

    let clipboardText = `${t.title};${formatToShortDate(t.date)}\n
    Step;Estimation;Duration\n`

    t.steps.forEach((step) => {
      const recordStep = record?.stepRecords[step.id]
      const duration =
        recordStep && recordStep.end
          ? formatDiffInMinutes(recordStep.start, recordStep.end)
          : '-'
      const analyze = duration <= step.estimation ? '✅' : '⚠️'

      clipboardText += `"${analyze} ${step.title}";${step.estimation};${duration}\n`
    })

    await navigator.clipboard.writeText(clipboardText)
    taskCopied.value = true

    setTimeout(() => {
      taskCopied.value = false
    }, 2000)
  }

  return {
    canShareTask,
    taskCopied,
    shareTask
  }
}
