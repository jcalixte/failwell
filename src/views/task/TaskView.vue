<script setup lang="ts">
import TaskRecordList from '@/modules/record/components/TaskRecordPreview.vue'
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
    <h1 class="title">{{ task.title }}</h1>
    <h2 class="subtitle">{{ task.totalEstimation }} minutes</h2>
    <a
      v-if="task.link"
      :href="task.link"
      target="_blank"
      rel="noopener noreferrer"
      class="button is-link"
      >user story link</a
    >
    <div class="columns">
      <div class="column content is-large">
        <h3 class="subtitle is-4">Tasks</h3>
        <ol>
          <li v-for="step in task.steps" :key="step.id">
            <div class="step-item">
              <span>{{ step.title }}</span>
              <span class="tag">{{ step.estimation }} minutes</span>
            </div>
          </li>
        </ol>
      </div>
      <task-record-list class="column" :task-id="id" />
    </div>
  </div>
  <div v-else>Task not found</div>
</template>

<style scoped>
.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  max-width: 400px;
}
</style>
