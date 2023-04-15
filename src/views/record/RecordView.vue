<script setup lang="ts">
import TaskRecord from '@/modules/record/components/TaskRecord.vue'

defineProps<{
  taskId: string
  recordId: string
}>()
</script>

<template>
  <div class="record-view">
    <TaskRecord :task-id="taskId" :record-id="recordId" />
  </div>
</template>
