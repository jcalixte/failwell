<script setup lang="ts">
import { useTaskStore } from '@/use-cases/task/stores/useTask.store'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

const taskStore = useTaskStore()

const task = computed(() => taskStore.getTask(props.id))
</script>

<template>
  <div class="task-view" v-if="task">
    {{ task.title }}
  </div>
  <div v-else>Task not found</div>
</template>

<style scoped>
.task-view {
}
</style>
