<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatToShortDate } from '@/shared/format-date'

const taskStore = useTaskStore()
</script>

<template>
  <div class="task-list-container" v-if="taskStore.recentTasks.length > 0">
    <ul class="task-list">
      <li v-for="task in taskStore.recentTasks" :key="task.id">
        <div class="line">
          <router-link :to="{ name: 'task-view', params: { id: task.id } }">{{
            task.title
          }}</router-link>
        </div>
        <div class="line">
          <span class="tag">{{ task.totalEstimation }} minutes</span>
          <span>{{ formatToShortDate(task.date) }}</span>
        </div>
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

.task-list .line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
