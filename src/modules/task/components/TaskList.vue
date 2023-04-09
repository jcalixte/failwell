<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDate } from '@/shared/format-date'

const taskStore = useTaskStore()
</script>

<template>
  <ul class="task-list">
    <li v-for="task in taskStore.recentTasks" :key="task.id">
      <router-link :to="{ name: 'task-view', params: { id: task.id } }">{{
        task.title
      }}</router-link>
      | {{ task.totalEstimation }} minutes |
      {{ formatDate(task.date) }}
    </li>
  </ul>
</template>

<style scoped>
.task-list {
}
</style>
