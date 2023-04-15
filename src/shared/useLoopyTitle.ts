import { useTitle } from '@vueuse/core'
import { onUnmounted } from 'vue'

export const useLoopyTitle = (title: string) => {
  if (title) {
    useTitle(title, {
      titleTemplate: '%s | Loopycode'
    })
  } else {
    useTitle('Loopycode')
  }

  onUnmounted(() => {
    useTitle('Loopycode')
  })
}
