<script setup lang="ts">
import TaskList from '@/modules/task/components/TaskList.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'

const taskStore = useTaskStore()
</script>

<template>
  <main>
    <router-link :to="{ name: 'new-task' }">New task</router-link>
    <task-list />
    <button @click="() => taskStore.reset()">reset list</button>
  </main>
</template>
