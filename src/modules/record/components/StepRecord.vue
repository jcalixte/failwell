<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDiffInMinutes } from '@/shared/format-date'
import { toISODate } from '@/shared/types/date'
import { computed, onUnmounted, ref } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
  recordId: string
  stepId: string
  stepNumber: number
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

const step = computed(() => taskStore.getStep(props.taskId, props.stepId))
const stepRecord = computed(() =>
  recordStore.getStepRecord(props.recordId, props.stepId)
)
const isCurrentStep = computed(() => recordStore.currentStepId === props.stepId)

const now = ref(toISODate(new Date()))

const id = setInterval(() => {
  now.value = toISODate(new Date())
}, 1000)

onUnmounted(() => clearInterval(id))

const duration = computed(() => {
  if (!stepRecord.value) {
    return null
  }

  return formatDiffInMinutes(
    stepRecord.value.start,
    stepRecord.value?.end ?? now.value
  )
})

const isSuperiorToEstimation = computed(() => {
  if (!step.value || !stepRecord.value || !duration.value) {
    return false
  }

  return duration.value > step.value.estimation
})
</script>

<template>
  <tr v-if="step" class="step-record">
    <td class="rank">
      {{ stepNumber }}
    </td>
    <td class="status">
      <span v-if="stepRecord?.end && !isSuperiorToEstimation">✅</span>
      <span v-else-if="isSuperiorToEstimation"> ⚠️ </span>
      <span v-else>⌛</span>
    </td>
    <td class="title">
      {{ step.title }}
      <div v-if="isCurrentStep" class="blob green"></div>
    </td>
    <td class="estimation">{{ step.estimation }} minutes</td>
    <td v-if="stepRecord">{{ duration }} minutes</td>
    <td v-else></td>
  </tr>
</template>

<style scoped lang="scss">
.step-record {
  .status {
    text-align: center;
  }

  .rank {
    text-align: right;
  }

  .blob {
    background: black;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    height: 10px;
    width: 10px;
    animation: pulse-black 2s infinite;
  }

  .blob {
    background: rgba(51, 217, 178, 1);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 1);
    animation: pulse 2s infinite;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 1rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(51, 217, 178, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 0);
  }
}
</style>
