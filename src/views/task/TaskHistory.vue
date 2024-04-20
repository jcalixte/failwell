<script setup lang="ts">
import { adaptStepsToTextarea } from '@/modules/task/infra/adaptStepsToTextarea'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()
const taskStore = useTaskStore()

const task = computed(() => taskStore.getTask(props.id))
const prev = computed(() =>
  adaptStepsToTextarea(task.value?.stepHistory[0] || [])
)
const current = computed(() =>
  adaptStepsToTextarea(task.value?.stepHistory[1] || [])
)
</script>

<template>
  <div v-if="task" class="task-history">
    <Diff
      v-if="task.stepHistory.length > 1"
      mode="split"
      theme="dark"
      language="markdown"
      :prev="prev"
      :current="current"
    />
    <div v-else>No history yet.</div>
  </div>
</template>

<!-- <style scoped lang="scss">
.task-history {
}
</style> -->
