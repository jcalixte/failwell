<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
  recordId: string
}>()

const taskStore = useTaskStore()
const taskRecordStore = useTaskRecordStore()

const task = computed(() => taskStore.getTask(props.taskId))
const record = computed(() => taskRecordStore.getRecord(props.recordId))

const numberOfFinishedSteps = computed(
  () =>
    Object.values(record.value?.stepRecords ?? {}).filter((step) => !!step.end)
      .length
)
</script>

<template>
  <progress
    v-if="task && record"
    class="progress is-primary"
    :value="numberOfFinishedSteps"
    :max="task.steps.length ?? 0"
  ></progress>
</template>
