import { useTitle } from '@vueuse/core'
import { onUnmounted } from 'vue'

export const useTaskflowTitle = (title: string) => {
  if (title) {
    useTitle(title, {
      titleTemplate: '%s | Taskflow'
    })
  } else {
    useTitle('Taskflow')
  }

  onUnmounted(() => {
    useTitle('Taskflow')
  })
}
