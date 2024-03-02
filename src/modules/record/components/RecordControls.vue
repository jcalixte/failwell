<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { toISODate } from '@/shared/types/date'
import { useActiveElement, useMagicKeys, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'
import { computed, onUnmounted, ref } from 'vue'
import type { TaskRecord } from '../models/task-record'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import NewStepsFormVue from '@/modules/task/components/NewStepsForm.vue'
import type { Stepable } from '@/modules/task/interfaces/stepable'

const props = defineProps<{
  taskId: string
  record: TaskRecord
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

const task = computed(() => taskStore.getTask(props.taskId))
const record = computed(() => props.record)

const getNextStepId = () => {
  if (!task.value) {
    return null
  }

  if (!record.value.currentStepId) {
    const [firstStep] = task.value.steps
    return firstStep.id
  }

  const currentStepIndex = task.value.steps.findIndex(
    (step) => step.id === record.value.currentStepId
  )

  const canHaveNextIndex =
    currentStepIndex >= 0 && currentStepIndex < task.value.steps.length - 1

  if (canHaveNextIndex) {
    return task.value.steps[currentStepIndex + 1].id
  }

  return null
}

const hasStarted = computed(
  () => Object.values(record.value?.stepRecords ?? {}).length > 0
)

const canStart = computed(
  () => !record.value.currentStepId && !hasStarted.value
)

const startRecording = () => {
  if (!canStart.value || !task.value) {
    return
  }

  recordStore.startStepRecord({
    taskId: props.taskId,
    stepId: task.value.steps[0].id,
    start: toISODate(new Date())
  })
}

const nextStep = () => {
  if (!task.value || !record.value.currentStepId || !record.value) {
    return
  }

  recordStore.nextStepRecord({
    taskId: record.value.taskId,
    currentStepId: record.value.currentStepId,
    nextStepId: getNextStepId(),
    tick: toISODate(new Date())
  })
}

const isAddingSteps = ref(false)
const editStepsForm = () => {
  isAddingSteps.value = true
}

const editSteps = (steps: Stepable[]) => {
  if (!record.value.currentStepId) {
    return
  }

  isAddingSteps.value = false
  taskStore.editStepsToTask(props.taskId, steps, record.value.currentStepId)
}

const reset = () => {
  if (window.confirm('Are you sure you want to reset the record?')) {
    recordStore.reset(props.taskId)
  }
}

const activeElement = useActiveElement()
const INPUT_MATTERS = ['INPUT', 'TEXTAREA']
const notUsingInput = computed(
  () => !INPUT_MATTERS.includes(activeElement.value?.tagName ?? '')
)

const { n, p, s } = useMagicKeys()

whenever(logicAnd(notUsingInput, n), () => {
  if (record.value?.breakTime) {
    return
  }

  nextStep()
})

whenever(logicAnd(notUsingInput, p), () => {
  if (record.value?.breakTime) {
    recordStore.resume(props.taskId)
  } else {
    recordStore.pause(props.taskId)
  }
})

whenever(logicAnd(notUsingInput, s), () => {
  startRecording()
})

onUnmounted(() => {
  recordStore.pause(props.taskId)
})
</script>

<template>
  <div class="columns record-controls">
    <div class="column buttons has-addons">
      <template v-if="record && record.currentStepId">
        <button
          class="button is-primary is-light"
          v-if="record.breakTime"
          @click="recordStore.resume(taskId)"
        >
          <img src="/icons/start.svg" alt="resume" />
        </button>
        <button
          class="button is-primary is-light"
          v-else
          @click="recordStore.pause(taskId)"
        >
          <img src="/icons/pause.svg" alt="pause" />
        </button>
      </template>

      <template v-if="!record || !record.end">
        <button
          v-if="canStart"
          @click="startRecording"
          class="button is-primary is-light"
        >
          <img src="/icons/start.svg" alt="start" />
        </button>
        <button
          class="button is-primary is-light"
          v-else-if="!record.breakTime"
          @click="nextStep"
        >
          <img src="/icons/next.svg" alt="next" />
        </button>
      </template>

      <button
        v-if="!record.end && record.currentStepId"
        class="button is-primary is-light"
        @click="editStepsForm"
      >
        <img src="/icons/plus.svg" alt="plus" />
      </button>

      <button v-if="hasStarted" class="button is-warning" @click="reset">
        <img src="/icons/recycle.svg" alt="reset" />
      </button>
    </div>

    <div class="column message">
      <p><kbd>s</kbd>: start record</p>
      <p><kbd>n</kbd>: next step</p>
      <p><kbd>p</kbd>: pause</p>
    </div>
  </div>
  <NewStepsFormVue
    v-if="task"
    :is-active="isAddingSteps"
    :initial-steps="task.steps"
    @close="isAddingSteps = false"
    @submit="editSteps"
  />
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: center;
}

.message {
  display: none;
}

@media screen and (min-width: 769px) {
  .message {
    display: block;
  }
}
</style>
