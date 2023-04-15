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
  <span>
    <router-link
      class="task-record-link button is-link"
      :to="{
        name: 'record-view',
        params: { taskId: record.taskId, recordId: record.id }
      }"
      >{{ formatDate(record.start) }}</router-link
    >
    {{ duration }} minutes
  </span>
</template>

<style scoped lang="scss">
.task-record-link {
}
</style>
