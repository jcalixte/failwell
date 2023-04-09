<script setup lang="ts">
import { createUuid } from '@/shared/create-uuid'
import { faker } from '@faker-js/faker'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createStepFixture } from '../models/step.fixture'
import { Task } from '../models/task'
import { useTaskStore } from '../stores/useTask.store'
import StepInput from './StepInput.vue'

const store = useTaskStore()
const router = useRouter()

const id = createUuid()

const title = ref(faker.animal.bird())
const steps = ref([createStepFixture(), createStepFixture()])
const totalEstimation = computed(() =>
  steps.value.map((step) => step.estimation).reduce((a, b) => a + b, 0)
)

const saveTask = () => {
  const task = new Task(id, title.value)
  task.addSteps(...steps.value)

  if (Task.validate(task)) {
    store.saveTask(task)
    router.push({
      name: 'home'
    })
  }

  return false
}
</script>

<template>
  <div>
    <h1>New Task Form</h1>
    <h2>Estimation: {{ totalEstimation }} minutes</h2>
    <form @submit.prevent="saveTask">
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" />
      </div>
      <StepInput v-model="steps" />
      <button type="submit">save task</button>
    </form>
  </div>
</template>

<style scoped></style>
