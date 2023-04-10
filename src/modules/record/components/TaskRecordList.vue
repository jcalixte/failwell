<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import { formatDate } from '@/shared/format-date'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
}>()

const recordStore = useTaskRecordStore()

const records = recordStore.getTaskRecords(props.taskId)
const newRecordId = createUuid()
</script>

<template>
  <ol v-if="records.length" class="task-record-list">
    <li v-for="record in records" :key="record.id">
      <router-link
        :to="{
          name: 'record-view',
          params: { taskId, recordId: record.id }
        }"
        >{{ formatDate(record.start) }}</router-link
      >
    </li>
  </ol>
  <div v-else>No record yet</div>
  <router-link
    :to="{
      name: 'record-view',
      params: { taskId, recordId: newRecordId }
    }"
    >start a new record</router-link
  >
</template>

<style scoped lang="scss">
.task-record-list {
}
</style>
