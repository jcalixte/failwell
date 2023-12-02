<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatToShortDate } from '@/shared/format-date'

const taskStore = useTaskStore()
</script>

<template>
  <div class="task-list-container" v-if="taskStore.recentTasks.length > 0">
    <ul class="task-list">
      <li v-for="task in taskStore.recentTasks" :key="task.id">
        <router-link :to="{ name: 'task-view', params: { id: task.id } }">
          <div class="line">
            {{ task.title }}
          </div>
          <div class="line">
            <span class="tag">{{ task.totalEstimation }} minutes</span>
            <span>{{ formatToShortDate(task.date) }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.task-list-container {
  padding: 0.5rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li {
    background-color: #f1f2f6;
    border-radius: 0.5rem;

    a {
      display: block;
      padding: 1rem;
    }
  }
}

.line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
