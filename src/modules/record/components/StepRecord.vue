<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDiffInMinutes } from '@/shared/format-date'
import { toISODate } from '@/shared/types/date'
import { computed, onUnmounted, ref } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
  stepId: string
  stepNumber: number
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

const record = computed(() => recordStore.getTaskRecord(props.taskId))
const step = computed(() => taskStore.getStep(props.taskId, props.stepId))
const stepRecord = computed(() =>
  recordStore.getStepRecord(props.taskId, props.stepId)
)
const isCurrentStep = computed(
  () => record.value?.currentStepId === props.stepId
)
const isInBreakTime = computed(() => !!record.value?.breakTime)

const now = ref(toISODate(new Date()))

const id = setInterval(() => {
  if (!isInBreakTime.value) {
    now.value = toISODate(new Date())
  }
}, 1000)

onUnmounted(() => clearInterval(id))

const duration = computed(() => {
  if (!stepRecord.value) {
    return null
  }

  const compareDate = new Date(
    record.value?.breakTime?.start ??
      // When in pause, it can happen to
      // have a tick where now is behind new Date().
      Math.max(new Date(now.value).getTime(), new Date().getTime())
  )

  return formatDiffInMinutes(
    stepRecord.value.start,
    stepRecord.value?.end ?? toISODate(new Date(compareDate))
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
    <td class="td-rank" :class="{ 'added-afterward': step.addedAfterward }">
      <div class="rank">
        <template v-if="isCurrentStep">
          <img
            v-show="record?.breakTime"
            src="/icons/pause.svg"
            alt="in pause"
            class="in-pause"
          />
          <div v-show="!record?.breakTime" class="blob green"></div>
        </template>
        <span v-else>
          {{ stepNumber }}
        </span>
      </div>
    </td>
    <td class="status">
      <span v-if="stepRecord?.end && !isSuperiorToEstimation">✅</span>
      <span v-else-if="isSuperiorToEstimation"> ⚠️ </span>
      <span v-else>⌛</span>
    </td>
    <td class="step-title">
      {{ step.title }}
    </td>
    <td class="estimation minutes">{{ step.estimation }} min</td>
    <td class="minutes" v-if="stepRecord">{{ duration }} min</td>
    <td v-else></td>
  </tr>
</template>

<style scoped lang="scss">
@import '@/assets/variables';

$blob-size: 15px;
$blob-color: $link;

.in-pause {
  height: $blob-size;
  width: $blob-size;
}

.step-record {
  .status {
    text-align: center;

    div {
      margin: auto;
    }
  }

  .td-rank {
    &.added-afterward {
      background: #fbc124;
    }
  }

  .rank {
    text-align: right;
    display: flex;
    justify-content: end;
    align-items: center;
    min-height: 30px;
  }

  .blob {
    border-radius: 50%;
    height: $blob-size;
    width: $blob-size;
    background: $blob-color;
    box-shadow: 0 0 0 0 $blob-color;
    animation: pulse 2s infinite;
  }

  .step-title {
    padding-right: 1rem;
  }

  .minutes {
    text-align: right;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 $blob-color;
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
