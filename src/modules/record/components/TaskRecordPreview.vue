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
    <router-link
      :to="{
        name: 'record-view',
        params: { taskId }
      }"
      class="button is-primary is-light"
      >recording page</router-link
    >
    <div v-if="taskRecord" class="task-record-link-container content">
      <span v-if="duration !== null"
        >Last record took {{ duration }} minutes</span
      >
    </div>
    <div v-else>No record yet</div>
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
