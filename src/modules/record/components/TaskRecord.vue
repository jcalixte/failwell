<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatLongDate } from '@/shared/format-date'
import { toISODate } from '@/shared/types/date'
import { useMagicKeys, whenever } from '@vueuse/core'
import { computed } from 'vue'
import { useTaskRecordMetadata } from '../hooks/useTaskRecordMetadata'
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
const recordNotes = computed(() => recordStore.getRecordNotes(props.recordId))
const { duration } = useTaskRecordMetadata(record)

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

const canStart = computed(
  () => !recordStore.currentStepId && !record.value.hasStepRecords
)

const startRecording = () => {
  if (!canStart.value || !task.value) {
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

const { n, s } = useMagicKeys()

whenever(n, () => {
  nextStep()
})

whenever(s, () => {
  startRecording()
})

const isSuperiorToEstimation = computed(() => {
  if (!task.value || !record.value || !duration.value) {
    return false
  }

  return duration.value > task.value.totalEstimation
})
</script>

<template>
  <main class="task-record" v-if="task">
    <h1 class="title">
      <router-link
        :to="{ name: 'task-view', params: { id: task.id } }"
        class="button is-link is-light"
      >
        {{ task.title }}
      </router-link>
    </h1>
    <h2 class="subtitle">{{ formatLongDate(record.start) }}</h2>
    <div class="buttons">
      <template v-if="!record.end">
        <button
          v-if="canStart"
          @click="startRecording"
          class="button is-primary"
        >
          start
        </button>
        <button class="button" v-else @click="nextStep">next</button>
      </template>

      <button class="button is-warning" @click="recordStore.$reset">
        reset
      </button>
    </div>
    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>#</th>
          <th>status</th>
          <th>task</th>
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
          :step-number="key + 1"
        />
      </tbody>
    </table>
    <div v-if="record.end" class="content">
      <p
        :class="{
          'has-text-primary-dark': !isSuperiorToEstimation,
          'has-text-warning-dark': isSuperiorToEstimation
        }"
      >
        The task took {{ duration }} minutes instead of
        {{ task.totalEstimation }} minutes.
      </p>
    </div>
    <div class="columns is-centered">
      <div class="column is-half">
        <textarea
          name="record-notes"
          id="record-notes"
          rows="10"
          :value="recordNotes"
          @input="
            //@ts-ignore
            recordStore.updateRecordNotes(recordId, $event.target.value)
          "
          placeholder="Take notes while you're doing the task. It can be helpful at the end to retrieve your thought."
          class="textarea"
        ></textarea>
      </div>
    </div>
  </main>
</template>
