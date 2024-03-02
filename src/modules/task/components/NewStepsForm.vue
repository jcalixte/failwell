<script setup lang="ts">
import type { Stepable } from '@/modules/task/interfaces/stepable'
import { ref, watch } from 'vue'
import StepInput from './StepInput.vue'

const props = defineProps<{
  isActive: boolean
  initialSteps: Stepable[]
}>()

const emits = defineEmits<{
  (event: 'submit', steps: Stepable[]): void
  (event: 'close'): void
}>()

const steps = ref<Stepable[]>(props.initialSteps)

watch(props.initialSteps, (initialSteps) => {
  steps.value = initialSteps
})

const save = () => {
  emits('submit', steps.value)
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="new-step-form modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit steps</p>
        <button
          class="delete"
          aria-label="close"
          @click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <step-input v-if="isActive" v-model="steps" size="small" />
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click="save">add</button>
        <button class="button" @click="$emit('close')">cancel</button>
      </footer>
    </div>
  </div>
</template>
