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
    <div class="content is-large">
      <ol>
        <li v-for="step in task.steps" :key="step.id">
          <div>{{ step.title }} | {{ step.estimation }}</div>
        </li>
      </ol>
    </div>
    <task-record-list :task-id="id" />
  </div>
  <div v-else>Task not found</div>
</template>
