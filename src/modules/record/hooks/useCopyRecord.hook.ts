import type { Task } from '@/modules/task/models/task'
import { computed, ref, type ComputedRef } from 'vue'
import { toBlob } from 'html-to-image'

export const useCopyRecord = (task: ComputedRef<Task | null>) => {
  const canShareTask =
    !!navigator && !!navigator.clipboard && !!navigator.clipboard.writeText
  const taskCopied = ref(false)
  const domId = computed(() => `task-${task.value?.id}`)

  const shareTask = async () => {
    const node = document.getElementById(domId.value)

    if (!node) {
      return
    }

    const blob = await toBlob(node, {
      style: {
        margin: 'inherit'
      }
    })

    if (!blob) {
      return
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])

      taskCopied.value = true
    } catch (error) {
      console.warn(error)
    } finally {
      setTimeout(() => {
        taskCopied.value = false
      }, 2000)
    }
  }

  return {
    canShareTask,
    taskCopied,
    shareTask
  }
}
