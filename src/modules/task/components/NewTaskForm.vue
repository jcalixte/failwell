<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import type { Stepable } from '../interfaces/stepable'
import TaskForm from './TaskForm.vue'

const props = defineProps<{
  initialSteps?: Stepable[]
}>()

const id = createUuid()
</script>

<template>
  <task-form :id="id" :initial-steps="props.initialSteps" />
</template>
