<script setup lang="ts">
import TaskList from '@/modules/task/components/TaskList.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'

const taskStore = useTaskStore()

const resetTasks = () => {
  if (window.confirm('are you sure to reset all your tasks?')) {
    taskStore.reset()
  }
}
</script>

<template>
  <main>
    <div>
      <router-link :to="{ name: 'new-task' }" class="button is-primary"
        >New task</router-link
      >
    </div>
    <task-list />
    <div>
      <button class="button is-danger" @click="resetTasks">reset list</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 60vh;
}
</style>
