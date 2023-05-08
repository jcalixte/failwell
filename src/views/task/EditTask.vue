<script setup lang="ts">
import TaskForm from '@/modules/task/components/TaskForm.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'

const props = defineProps<{ id: string }>()
const store = useTaskStore()

const task = store.getTask(props.id)
</script>

<template>
  <div class="edit-task">
    <TaskForm v-if="task" :id="task.id" :initial-task="task" />
    <div v-else class="no-task-found">
      <p>Task not found.</p>
      <router-link :to="{ name: 'home' }" class="button">
        <img src="/icons/left.svg" alt="left arrow" />
        go to homepage</router-link
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-task {
  .no-task-found {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
}
</style>
