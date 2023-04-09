<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

const taskStore = useTaskStore()

const task = computed(() => taskStore.getTask(props.id))
</script>

<template>
  <div class="task-view" v-if="task">
    <h1>{{ task.title }}</h1>
    <h2>{{ task.totalEstimation }} minutes</h2>
    <ul>
      <li v-for="step in task.steps" :key="step.id">
        {{ step.title }} | {{ step.estimation }}
      </li>
    </ul>
  </div>
  <div v-else>Task not found</div>
</template>

<style scoped>
.task-view {
}
</style>
