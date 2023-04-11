<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  adaptStepsToTextarea,
  adaptTextareaToSteps
} from '../infra/adaptStepsToTextarea'
import type { Stepable } from '../interfaces/stepable'

const props = defineProps<{
  modelValue: Stepable[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Stepable[]): void
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
    <label for="steps">steps</label>
    <textarea
      id="steps"
      name="steps"
      v-model="stepsTextarea"
      cols="40"
      rows="20"
    ></textarea>
  </div>
</template>

<style scoped>
.step-input {
}
</style>
