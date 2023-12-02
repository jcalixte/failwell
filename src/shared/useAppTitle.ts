import { useTitle } from '@vueuse/core'
import { onUnmounted } from 'vue'

export const useAppTitle = (title: string) => {
  if (title) {
    useTitle(title, {
      titleTemplate: '%s | Fail Well'
    })
  } else {
    useTitle('Fail Well')
  }

  onUnmounted(() => {
    useTitle('Fail Well')
  })
}
