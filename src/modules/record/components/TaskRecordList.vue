<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import TaskRecordLink from './TaskRecordLink.vue'

const props = defineProps<{
  taskId: string
}>()

const recordStore = useTaskRecordStore()

const records = recordStore.getTaskRecords(props.taskId)
const newRecordId = createUuid()
</script>

<template>
  <div class="content">
    <ol v-if="records.length" class="task-record-list">
      <li v-for="record in records" :key="record.id">
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
</template>
