<script setup lang="ts">
import TaskList from '@/use-cases/task/components/TaskList.vue'
import { useTaskStore } from '@/use-cases/task/stores/useTask.store'

const taskStore = useTaskStore()
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'new-task' }">New task</RouterLink>
    <task-list />
    <button @click="() => taskStore.reset()">reset list</button>
  </main>
</template>
