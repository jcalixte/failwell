<script setup lang="ts">
import EstimationTimeArrival from '@/components/EstimationTimeArrival.vue'
import RecordResume from '@/modules/record/components/RecordResume.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { useAppTitle } from '@/shared/useAppTitle'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import RecordControls from './RecordControls.vue'
import RecordProgress from './RecordProgress.vue'
import RecordWatch from './RecordWatch.vue'
import StepRecord from './StepRecord.vue'

const props = defineProps<{
  taskId: string
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()
const router = useRouter()

const task = computed(() => taskStore.getTask(props.taskId))

onMounted(() => {
  if (task.value) {
    recordStore.syncTaskRecord(task.value)
  }
  recordStore.initRecord(props.taskId)
})

useAppTitle(task.value?.title ?? '')

const record = computed(() => recordStore.getTaskRecord(props.taskId))
const recordNotes = computed(() => recordStore.getRecordNotes(props.taskId))
</script>

<template>
  <main class="task-record" v-if="task">
    <h1 class="title">
      <button @click="router.go(-1)" class="button is-white">
        <img src="/icons/left.svg" alt="go back" />
      </button>
      {{ task.title }}
    </h1>
    <div class="timers" v-if="record">
      <estimation-time-arrival :estimation="task.totalEstimation" />
      <record-watch :record="record" />
    </div>
    <record-controls v-if="record" :task-id="taskId" :record="record" />
    <record-progress :task-id="taskId" />
    <table class="table is-striped is-hoverable is-fullwidth">
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
        <step-record
          v-for="(step, key) in task.steps"
          :task-id="taskId"
          :key="step.id"
          :step-id="step.id"
          :step-number="key + 1"
        />
      </tbody>
    </table>
    <record-resume
      v-if="record"
      :record="record"
      :total-estimation="task.totalEstimation"
    />
    <div class="columns is-centered">
      <div class="column is-half">
        <textarea
          name="record-notes"
          id="record-notes"
          rows="10"
          :value="recordNotes"
          @input="
            //@ts-ignore
            recordStore.updateRecordNotes(taskId, $event.target.value)
          "
          placeholder="Take notes while you're doing the task. It can be helpful at the end to retrieve your thought and see what you can improve."
          class="textarea"
        ></textarea>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
}

.timers {
  display: flex;
  gap: 1rem;
}

table {
  display: block;
  overflow-x: auto;
}
</style>
