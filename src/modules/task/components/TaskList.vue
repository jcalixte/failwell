<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDate } from '@/shared/format-date'

const taskStore = useTaskStore()
</script>

<template>
  <div class="task-list-container" v-if="taskStore.recentTasks.length > 0">
    <ul class="task-list">
      <li v-for="task in taskStore.recentTasks" :key="task.id">
        <router-link
          :to="{ name: 'task-view', params: { id: task.id } }"
          class="button is-link is-outlined"
          >{{ task.title }}</router-link
        >
        <span class="tag">{{ task.totalEstimation }} minutes</span>
        <span>{{ formatDate(task.date) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.task-list-container {
  padding: 0.5rem;
  background-color: #f1f2f6;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
