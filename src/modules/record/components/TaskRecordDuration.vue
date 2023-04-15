<script setup lang="ts">
import { useTaskRecordMetadata } from '../hooks/useTaskRecordMetadata'
import type { TaskRecord } from '../models/task-record'

const props = defineProps<{
  record: TaskRecord
}>()

const { duration } = useTaskRecordMetadata(props.record)
</script>

<template>
  <div class="task-record-link-container content">
    <span v-if="duration !== null">last time: {{ duration }} minutes </span>
  </div>
</template>

<style scoped lang="scss">
.task-record-link-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
