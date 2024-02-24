<script setup lang="ts">
import type { Stepable } from '@/modules/task/interfaces/stepable'
import StepRecord from '@/modules/record/components/StepRecord.vue'

defineProps<{
  id: string
  steps: Stepable[]
}>()
</script>

<template>
  <table class="table record-step-table is-striped is-hoverable">
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
        v-for="(step, key) in steps"
        :task-id="id"
        :key="step.id"
        :step-id="step.id"
        :step-number="key + 1"
      />
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.record-step-table {
  .step-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    max-width: 600px;
  }
}
</style>
