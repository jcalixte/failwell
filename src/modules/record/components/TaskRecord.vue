<script setup lang="ts">
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { formatLongDate } from '@/shared/format-date'
import { useLoopyTitle } from '@/shared/useLoopyTitle'
import { computed } from 'vue'
import { useTaskRecordMetadata } from '../hooks/useTaskRecordMetadata'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import RecordControls from './RecordControls.vue'
import RecordProgress from './RecordProgress.vue'
import StepRecord from './StepRecord.vue'

const props = defineProps<{
  taskId: string
  recordId: string
}>()

const taskStore = useTaskStore()
const recordStore = useTaskRecordStore()

recordStore.addRecord(props.taskId, props.recordId)

const task = computed(() => taskStore.getTask(props.taskId))

useLoopyTitle(task.value?.title ?? '')

const record = computed(() => recordStore.getTaskRecord(props.recordId))
const recordNotes = computed(() => recordStore.getRecordNotes(props.recordId))
const { duration } = useTaskRecordMetadata(record)

const isSuperiorToEstimation = computed(() => {
  if (!task.value || !record.value || !duration.value) {
    return false
  }

  return duration.value > task.value.totalEstimation
})
</script>

<template>
  <main class="task-record" v-if="task">
    <record-progress :task-id="taskId" :record-id="recordId" />
    <h1 class="title">
      <router-link
        :to="{ name: 'task-view', params: { id: task.id } }"
        class="button is-link is-light"
      >
        {{ task.title }}
      </router-link>
    </h1>
    <h2 class="subtitle" v-if="record">{{ formatLongDate(record.start) }}</h2>
    <record-controls :task-id="taskId" :record-id="recordId" />
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
          :record-id="recordId"
          :key="step.id"
          :step-id="step.id"
          :step-number="key + 1"
        />
      </tbody>
    </table>
    <div v-show="record && record.end" class="content">
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
