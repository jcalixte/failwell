<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  adaptStepsToTextarea,
  adaptTextareaToSteps
} from '../infra/adaptStepsToTextarea'
import type { Step } from '../models/step'

const props = defineProps<{
  modelValue: Step[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Step[]): void
}>()

const rawSteps = ref(adaptStepsToTextarea(props.modelValue))

const stepsTextarea = computed({
  get() {
    return rawSteps.value
  },
  set(value) {
    rawSteps.value = value

    emit('update:modelValue', adaptTextareaToSteps(value))
  }
})
</script>

<template>
  <div class="step-input">
    <textarea v-model="stepsTextarea" cols="40" rows="20"></textarea>
    <div>beautiful data</div>
  </div>
</template>

<style scoped>
.step-input {
  display: flex;
  justify-content: space-between;
}
</style>
