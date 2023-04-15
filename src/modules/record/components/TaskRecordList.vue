<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import { computed } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import TaskRecordLink from './TaskRecordLink.vue'

const props = defineProps<{
  taskId: string
}>()

const recordStore = useTaskRecordStore()

const recordsFromLastToFirst = computed(() =>
  recordStore
    .getTaskRecords(props.taskId)
    .sort((a, b) => (a.start > b.start ? -1 : 1))
)
const newRecordId = createUuid()
</script>

<template>
  <div>
    <div class="content">
      <h3 class="subtitle is-4">Records</h3>
      <ol v-if="recordsFromLastToFirst.length" class="task-record-list">
        <li v-for="record in recordsFromLastToFirst" :key="record.id">
          <task-record-link :record="record" />
        </li>
      </ol>
      <div v-else>No record yet</div>
    </div>
    <router-link
      :to="{
        name: 'record-view',
        params: { taskId, recordId: newRecordId }
      }"
      class="button is-primary is-light"
      >start a new record</router-link
    >
  </div>
</template>
