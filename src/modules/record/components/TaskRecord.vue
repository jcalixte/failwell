<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDate } from '@/shared/format-date'
import { toISODate } from '@/shared/types/date'
import { computed } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import StepRecord from './StepRecord.vue'

const props = defineProps<{
  taskId: string
  recordId: string
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

const task = computed(() => taskStore.getTask(props.taskId))

const record = computed(() =>
  recordStore.createAndRetrieveTaskRecord(props.taskId, props.recordId)
)

const getNextStepId = () => {
  if (!task.value) {
    return null
  }

  if (!recordStore.currentStepId) {
    const [firstStep] = task.value.steps
    return firstStep.id
  }

  const currentStepIndex = task.value.steps.findIndex(
    (step) => step.id === recordStore.currentStepId
  )

  const canHaveNextIndex =
    currentStepIndex >= 0 && currentStepIndex < task.value.steps.length - 1

  if (canHaveNextIndex) {
    return task.value.steps[currentStepIndex + 1].id
  }

  return null
}

const startRecording = () => {
  if (!task.value) {
    return
  }

  recordStore.startStepRecord({
    recordId: props.recordId,
    stepId: task.value.steps[0].id,
    start: toISODate(new Date())
  })
}

const nextStep = () => {
  if (!task.value || !recordStore.currentStepId) {
    return
  }

  recordStore.nextStepRecord({
    recordId: record.value.id,
    currentStepId: recordStore.currentStepId,
    nextStepId: getNextStepId(),
    tick: toISODate(new Date())
  })
}
</script>

<template>
  <div class="task-record" v-if="task">
    <h1>Task: {{ task.title }}</h1>
    <h2>start time: {{ formatDate(record.start) }}</h2>
    <button
      v-if="!recordStore.currentStepId && !record.hasStepRecords"
      @click="startRecording"
    >
      start
    </button>
    <button v-else @click="nextStep">next</button>
    <button @click="recordStore.$reset">reset</button>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Task</th>
          <th>estimation</th>
          <th>actual</th>
        </tr>
      </thead>
      <tbody>
        <StepRecord
          v-for="(step, key) in task.steps"
          :task-id="taskId"
          :record-id="recordId"
          :key="step.id"
          :step-id="step.id"
          :step-number="key"
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.task-record {
  .current {
    background-color: red;
  }

  .estimation {
    font-style: italic;
  }
}
</style>
