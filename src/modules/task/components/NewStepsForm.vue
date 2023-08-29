<script setup lang="ts">
import type { Stepable } from '@/modules/task/interfaces/stepable'
import { ref } from 'vue'
import StepInput from './StepInput.vue'

defineProps<{
  isActive: boolean
}>()
const emits = defineEmits<{
  (event: 'submit', steps: Stepable[]): void
  (event: 'close'): void
}>()
const steps = ref<Stepable[]>([])

const submit = () => {
  emits('submit', steps.value)
  emits('close')
  steps.value = []
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background"></div>
    <div class="new-step-form modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New steps</p>
        <button
          class="delete"
          aria-label="close"
          @click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <step-input v-model="steps" size="small" />
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click="submit">Save changes</button>
        <button class="button" @click="$emit('close')">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.new-step-form {
}
</style>
