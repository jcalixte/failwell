<script setup lang="ts">
import { formatDate } from '@/shared/format-date'
import { useTaskRecordMetadata } from '../hooks/useTaskRecordMetadata'
import type { TaskRecord } from '../models/task-record'

const props = defineProps<{
  record: TaskRecord
}>()

const { duration } = useTaskRecordMetadata(props.record)
</script>

<template>
  <div class="task-record-link-container content">
    <router-link
      class="task-record-link button is-outlined"
      :to="{
        name: 'record-view',
        params: { taskId: record.taskId, recordId: record.id }
      }"
      >{{ formatDate(record.start) }}</router-link
    >
    <span v-if="duration !== null"> {{ duration }} minutes </span>
  </div>
</template>

<style scoped lang="scss">
.task-record-link-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
