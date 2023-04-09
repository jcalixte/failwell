<script setup lang="ts">
import { formatDate } from '@/shared/format-date'
import { useTaskStore } from '@/use-cases/task/stores/useTask.store'

const taskStore = useTaskStore()
</script>

<template>
  <ul class="task-list">
    <li v-for="task in taskStore.tasks" :key="task.id">
      {{ task.title }} | {{ task.totalEstimation }} minutes |
      {{ formatDate(task.date) }}
    </li>
  </ul>
</template>

<style scoped>
.task-list {
}
</style>
