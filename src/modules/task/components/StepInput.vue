<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  adaptStepsToTextarea,
  adaptTextareaToSteps
} from '../infra/adaptStepsToTextarea'
import type { Stepable } from '../interfaces/stepable'

const props = withDefaults(
  defineProps<{
    modelValue: Stepable[]
    size?: 'large' | 'small'
  }>(),
  {
    size: 'large'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Stepable[]): void
}>()

const rows = computed(() => (props.size === 'large' ? 15 : 5))
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
  <div class="step-input field">
    <label class="label" for="steps">Steps</label>
    <div class="control">
      <textarea
        id="steps"
        name="steps"
        v-model="stepsTextarea"
        :rows="rows"
        class="textarea"
        placeholder="- step | estimation"
      ></textarea>
    </div>
  </div>
</template>
