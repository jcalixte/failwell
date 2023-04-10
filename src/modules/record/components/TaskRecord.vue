<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
  recordId: string
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

const task = taskStore.getTask(props.taskId)

const record = recordStore.createAndRetriveTaskRecord(
  props.taskId,
  props.recordId
)
</script>

<template>
  <div class="task-record">
    <pre>{{ task }}</pre>
    <pre>{{ record }}</pre>
  </div>
</template>

<style scoped lang="scss">
.task-record {
  display: flex;
}
</style>
