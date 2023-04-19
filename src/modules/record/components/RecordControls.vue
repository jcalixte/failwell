<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { toISODate } from '@/shared/types/date'
import { useActiveElement, useMagicKeys, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'
import { computed, onUnmounted } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

const task = computed(() => taskStore.getTask(props.taskId))
const record = computed(() => recordStore.getTaskRecord(props.taskId))

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
  () =>
    !recordStore.currentStepId &&
    Object.values(record.value?.stepRecords ?? {}).length === 0
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
  if (!task.value || !recordStore.currentStepId || !record.value) {
    return
  }

  recordStore.nextStepRecord({
    taskId: record.value.taskId,
    currentStepId: recordStore.currentStepId,
    nextStepId: getNextStepId(),
    tick: toISODate(new Date())
  })
}

const activeElement = useActiveElement()
const INPUT_MATTERS = ['INPUT', 'TEXTAREA']
const notUsingInput = computed(
  () => !INPUT_MATTERS.includes(activeElement.value?.tagName ?? '')
)

const { n, s } = useMagicKeys()

whenever(logicAnd(notUsingInput, n), () => {
  nextStep()
})

whenever(logicAnd(notUsingInput, s), () => {
  startRecording()
})

onUnmounted(() => {
  recordStore.pause(props.taskId)
})
</script>

<template>
  <div class="record-controls buttons has-addons">
    <template v-if="record && recordStore.currentStepId">
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
        v-else-if="!record?.breakTime"
        @click="nextStep"
      >
        <img src="/icons/next.svg" alt="next" />
      </button>
    </template>

    <button class="button is-warning" @click="recordStore.reset(taskId)">
      <img src="/icons/recycle.svg" alt="reset" />
    </button>
  </div>
</template>
