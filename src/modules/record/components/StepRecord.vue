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
  <tr v-if="step" class="step-record" :class="{ current: isCurrentStep }">
    <td>{{ stepNumber }}</td>
    <td>{{ step.title }}</td>
    <td class="estimation">{{ step.estimation }} minutes</td>
    <td v-if="stepRecord">
      <span v-if="isSuperiorToEstimation">⚠️</span>
      {{ duration }} minutes
    </td>
    <td v-else></td>
  </tr>
</template>

<style scoped lang="scss">
.step-record {
  &.current {
    background-color: rgb(4, 62, 62);
  }
}
</style>
