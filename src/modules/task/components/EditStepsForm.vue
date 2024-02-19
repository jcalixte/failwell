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

const save = () => {
  emits('submit', steps.value)
  steps.value = []
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="edit-steps-form modal-card">
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
