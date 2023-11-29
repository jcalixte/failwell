<script setup lang="ts">
import { computed } from 'vue'
import { useTaskRecordMetadata } from '../hooks/useTaskRecordMetadata'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
}>()

const recordStore = useTaskRecordStore()

const taskRecord = computed(() => recordStore.getTaskRecord(props.taskId))
const { duration } = useTaskRecordMetadata(taskRecord)
</script>

<template>
  <div class="task-record-preview">
    <div v-if="taskRecord !== null">
      Last record took {{ duration }} minutes.
    </div>
    <div v-else>No record yet.</div>
  </div>
</template>

<style scoped lang="scss">
.task-record-preview {
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .task-record-link-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>
