<script setup lang="ts">
import { computed } from 'vue'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'
import TaskRecordDuration from './TaskRecordDuration.vue'

const props = defineProps<{
  taskId: string
}>()

const recordStore = useTaskRecordStore()

const taskRecord = computed(() => recordStore.getTaskRecord(props.taskId))
</script>

<template>
  <div>
    <div class="content">
      <h3 class="subtitle is-4">Record</h3>
      <task-record-duration v-if="taskRecord" :record="taskRecord" />
      <div v-else>No record yet</div>
    </div>
    <router-link
      :to="{
        name: 'record-view',
        params: { taskId }
      }"
      class="button is-primary is-light"
      >start the record</router-link
    >
  </div>
</template>
