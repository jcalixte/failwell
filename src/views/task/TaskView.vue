<script setup lang="ts">
import TaskRecordList from '@/modules/record/components/TaskRecordList.vue'
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
    <a
      v-if="task.link"
      :href="task.link"
      target="_blank"
      rel="noopener noreferrer"
      >User Story link</a
    >
    <ul>
      <li v-for="step in task.steps" :key="step.id">
        <div>{{ step.title }} | {{ step.estimation }}</div>
      </li>
    </ul>
    <hr />
    <task-record-list :task-id="id" />
  </div>
  <div v-else>Task not found</div>
</template>

<style scoped>
.task-view {
}
</style>
