<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Stepable } from '../interfaces/stepable'
import { Task } from '../models/task'
import { useTaskStore } from '../stores/useTask.store'
import StepInput from './StepInput.vue'

const store = useTaskStore()
const router = useRouter()

const id = createUuid()

const title = ref('')
const link = ref('')

const steps = ref<Stepable[]>([])

const totalEstimation = computed(() =>
  steps.value.map((step) => step.estimation).reduce((a, b) => a + b, 0)
)

const saveTask = () => {
  const task = new Task(id, title.value)
  if (link.value) {
    task.link = link.value
  }
  task.addSteps(...steps.value)

  if (Task.validate(task)) {
    store.saveTask(task)
    router.push({
      name: 'task-view',
      params: {
        id
      }
    })
  }

  return false
}
</script>

<template>
  <div>
    <h1>Create a task</h1>
    <h2>Estimation: {{ totalEstimation }} minutes</h2>
    <form @submit.prevent="saveTask">
      <button type="submit">save task</button>
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" />
      </div>
      <div>
        <label for="link">User story link</label>
        <input type="text" id="link" v-model="link" />
      </div>
      <StepInput v-model="steps" />
    </form>
  </div>
</template>

<style scoped lang="scss">
form {
  padding: 1rem 0;
}
</style>
