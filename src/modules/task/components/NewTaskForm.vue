<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import TaskForm from './TaskForm.vue'

const id = createUuid()
</script>

<template>
  <task-form :id="id" />
</template>
