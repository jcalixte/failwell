<script setup lang="ts">
import TaskForm from '@/modules/task/components/TaskForm.vue'
import TaskNotFound from '@/modules/task/components/TaskNotFound.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'

const props = defineProps<{ id: string }>()
const store = useTaskStore()

const task = store.getTask(props.id)
</script>

<template>
  <div class="edit-task">
    <TaskForm v-if="task" :id="task.id" :initial-task="task" />
    <task-not-found v-else />
  </div>
</template>
