<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatDiffInMinutes } from '@/shared/format-date'
import { toISODate } from '@/shared/types/date'
import { computed, nextTick, onUnmounted, ref } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import { is10PercentOffThanEstimation } from '@/modules/record/services/compare-with-estimation'

const props = defineProps<{
  taskId: string
  stepId: string
  stepNumber: number
  isLastCompletedStep?: boolean
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

const isOffEstimation = computed(() => {
  if (
    step.value === null ||
    stepRecord.value === null ||
    duration.value === null
  ) {
    return false
  }

  return is10PercentOffThanEstimation({
    estimation: step.value.estimation,
    duration: duration.value
  })
})

// Duration editing
const isEditing = ref(false)
const editedDuration = ref(0)
const durationInputRef = ref<HTMLInputElement | null>(null)

const isEditable = computed(
  () => props.isLastCompletedStep && record.value && !record.value.end
)

function startEditing() {
  editedDuration.value = duration.value ?? 0
  isEditing.value = true
  nextTick(() => {
    durationInputRef.value?.focus()
    durationInputRef.value?.select()
  })
}

function confirmEdit() {
  if (editedDuration.value >= 1) {
    recordStore.updateStepDuration({
      taskId: props.taskId,
      stepId: props.stepId,
      newDurationMinutes: editedDuration.value
    })
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<template>
  <tr v-if="step" class="step-record">
    <td class="td-rank">
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
      <span v-if="!stepRecord?.end">⌛</span>
      <span v-else-if="isOffEstimation">❓</span>
      <span v-else>✅</span>
    </td>
    <td class="step-title">
      {{ step.title }}
    </td>
    <td class="estimation minutes">{{ step.estimation }} min</td>
    <td class="minutes" v-if="stepRecord">
      <template v-if="isEditing">
        <input
          ref="durationInputRef"
          type="number"
          min="1"
          v-model.number="editedDuration"
          @blur="confirmEdit"
          @keydown.enter="confirmEdit"
          @keydown.escape="cancelEdit"
          class="input is-small duration-input"
        />
        min
      </template>
      <span
        v-else
        :class="{ 'is-editable': isEditable }"
        @click="isEditable && startEditing()"
      >
        {{ duration }} min
      </span>
    </td>
    <td v-else></td>
  </tr>
</template>

<style scoped lang="scss">
$family-monospace: 'Oxygen Mono', monospace;

$family-primary: $family-monospace;
$primary: #192a56;
$info: #40739e;
$link: #2f3640;
$danger: #c23616;
$warning: #fbc531;
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

  .is-editable {
    cursor: pointer;
    text-decoration: underline dotted;
    &:hover {
      opacity: 0.7;
    }
  }

  .duration-input {
    width: 60px;
    display: inline-block;
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
