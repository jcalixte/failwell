<script setup lang="ts">
import type { Step } from '../models/step'

defineProps<{
  modelValue: Step[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Step[]): void
}>()
</script>

<template>
  <div class="step-input">
    <div>textarea</div>
    <div>beautiful data</div>
  </div>
</template>

<style scoped>
.step-input {
  display: flex;
  justify-content: space-between;
}
</style>
