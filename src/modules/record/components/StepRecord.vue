<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
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

const now = ref(toISODate(new Date()))

const id = setInterval(() => {
  now.value = toISODate(new Date())
}, 1000)

onUnmounted(() => clearInterval(id))

const duration = computed(() => {
  if (!stepRecord.value) {
    return null
  }

  const diffInMs =
    new Date(stepRecord.value?.end ?? now.value).getTime() -
    new Date(stepRecord.value.start).getTime()

  // TODO: diff in minutes not in seconds
  return Math.round(diffInMs / 1000)
})

const isSuperiorToEstimation = computed(() => {
  if (!step.value || !stepRecord.value || !duration.value) {
    return false
  }

  return duration.value > step.value.estimation
})
</script>

<template>
  <tr
    v-if="step"
    class="step-record"
    :class="{ current: recordStore.currentStepId === stepId }"
  >
    <td>{{ stepNumber }}</td>
    <td>{{ step.title }}</td>
    <td class="estimation">{{ step.estimation }} minutes</td>
    <td v-if="stepRecord">
      <span v-if="isSuperiorToEstimation">⚠️</span>
      {{ duration }} minutes
    </td>
    <td v-else>NA</td>
  </tr>
</template>

<style scoped lang="scss">
.step-record {
}
</style>
