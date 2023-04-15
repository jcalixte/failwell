<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDate } from '@/shared/format-date'

const taskStore = useTaskStore()
</script>

<template>
  <div class="content">
    <ul class="task-list">
      <li v-for="task in taskStore.recentTasks" :key="task.id">
        <router-link
          :to="{ name: 'task-view', params: { id: task.id } }"
          class="button is-link is-outlined"
          >{{ task.title }}</router-link
        >
        <span> {{ task.totalEstimation }} minutes </span>
        <span>{{ formatDate(task.date) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.task-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
