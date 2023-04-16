<script setup lang="ts">
import EstimationTimeArrival from '@/components/EstimationTimeArrival.vue'
import TaskRecordPreview from '@/modules/record/components/TaskRecordPreview.vue'
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
    <h2 class="subtitle">
      <estimation-time-arrival :estimation="task.totalEstimation" />
    </h2>
    <a
      v-if="task.link"
      :href="task.link"
      target="_blank"
      rel="noopener noreferrer"
      class="button is-link"
      >user story link</a
    >
    <div class="content">
      <ol>
        <li v-for="step in task.steps" :key="step.id">
          <div class="step-item">
            <span>{{ step.title }}</span>
            <span class="tag">{{ step.estimation }} minutes</span>
          </div>
        </li>
      </ol>
    </div>
    <task-record-preview :task-id="id" />
  </div>
  <div v-else>Task not found</div>
</template>

<style scoped>
.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  max-width: 600px;
}
</style>
