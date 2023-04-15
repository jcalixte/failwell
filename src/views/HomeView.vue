<script setup lang="ts">
import TaskList from '@/modules/task/components/TaskList.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'

const taskStore = useTaskStore()
</script>

<template>
  <main>
    <router-link :to="{ name: 'new-task' }" class="button is-primary"
      >New task</router-link
    >
    <task-list />
    <button class="button is-danger" @click="() => taskStore.reset()">
      reset list
    </button>
  </main>
</template>
