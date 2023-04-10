<script setup lang="ts">
import TaskRecord from '@/modules/record/components/TaskRecord.vue'

const props = defineProps<{
  taskId: string
  recordId: string
}>()
</script>

<template>
  <div class="record-view">
    <TaskRecord :task-id="taskId" :record-id="recordId" />
  </div>
</template>

<style scoped lang="scss">
.record-view {
}
</style>
