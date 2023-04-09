<script setup lang="ts">
import TaskList from '@/use-cases/task/components/TaskList.vue'
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'new-task' }">New task</RouterLink>
    <task-list />
  </main>
</template>
