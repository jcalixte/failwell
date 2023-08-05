<script setup lang="ts">
import TaskForm from '@/modules/task/components/TaskForm.vue'
import TaskNotFound from '@/modules/task/components/TaskNotFound.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { createUuid } from '@/shared/create-uuid'

const props = defineProps<{ id: string }>()
const taskStore = useTaskStore()

const newId = createUuid()

const task = taskStore.getTask(props.id)
</script>

<template>
  <div class="edit-task">
    <TaskForm v-if="task" :id="newId" :initial-task="task" />
    <task-not-found v-else />
  </div>
</template>
