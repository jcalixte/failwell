<script setup lang="ts">
import { computed } from 'vue'
import { useTaskRecordMetadata } from '../hooks/useTaskRecordMetadata'
import { useTaskRecordStore } from '../stores/useTaskRecordStore'

const props = defineProps<{
  taskId: string
}>()

const recordStore = useTaskRecordStore()

const taskRecord = computed(() => recordStore.getTaskRecord(props.taskId))
const { duration } = useTaskRecordMetadata(taskRecord)
</script>

<template>
  <div>
    <div class="content">
      <div v-if="taskRecord" class="task-record-link-container content">
        <span v-if="duration !== null">last time: {{ duration }} minutes </span>
      </div>
      <div v-else>No record yet</div>
    </div>
    <hr />
    <router-link
      :to="{
        name: 'record-view',
        params: { taskId }
      }"
      class="button is-primary is-light"
      >start recording</router-link
    >
  </div>
</template>

<style scoped lang="scss">
.task-record-link-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
