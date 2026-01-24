<script setup lang="ts">
import NewTaskForm from '@/modules/task/components/NewTaskForm.vue'
import type { Stepable } from '@/modules/task/interfaces/stepable'

const rawInitialSteps = history.state?.initialSteps as string | undefined
const initialSteps = rawInitialSteps
  ? (JSON.parse(rawInitialSteps) as Stepable[])
  : undefined
const initialTitle = history.state?.initialTitle as string | undefined
</script>

<template>
  <div class="new-task">
    <NewTaskForm :initial-steps="initialSteps" :initial-title="initialTitle" />
  </div>
</template>
