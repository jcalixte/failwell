<script setup lang="ts">
import EstimationTimeArrival from '@/components/EstimationTimeArrival.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Stepable } from '../interfaces/stepable'
import type { Taskable } from '../interfaces/taskable'
import { Task } from '../models/task'
import { useTaskStore } from '../stores/useTask.store'
import StepInput from './StepInput.vue'
import { exampleSteps } from '@/modules/task/examples/steps'

const store = useTaskStore()
const router = useRouter()
const props = defineProps<{
  id: string
  initialTask?: Taskable
}>()
const id = computed(() => props.id)
const hasTasks = computed(() => store.tasks.length > 0)

const steps = ref<Stepable[]>(
  props.initialTask
    ? Task.fromTaskable(props.initialTask).steps
    : hasTasks.value
      ? []
      : exampleSteps
)

const title = ref(props.initialTask?.title ?? '')
const link = ref(props.initialTask?.link ?? '')

const totalEstimation = computed(() =>
  steps.value.map((step) => step.estimation).reduce((a, b) => a + b, 0)
)

const saveTask = () => {
  const task = new Task(id.value, title.value, props.initialTask?.stepHistory)

  if (link.value) {
    task.link = link.value
  }
  task.newSteps(steps.value)

  if (!Task.validate(task)) {
    return false
  }

  store.saveTask(task)
  router.push({
    name: 'task-view',
    params: {
      id: id.value
    }
  })
}

const isValid = computed(() => title.value && steps.value.length > 0)
</script>

<template>
  <div class="task-form columns is-centered">
    <div class="column is-half">
      <h1 class="title">New task</h1>
      <h2 class="subtitle">
        <estimation-time-arrival :estimation="totalEstimation" />
      </h2>
      <form @submit.prevent="saveTask">
        <div class="field">
          <label class="label" for="title">Title</label>
          <div class="control">
            <input class="input" type="text" id="title" v-model="title" />
          </div>
        </div>
        <div class="field">
          <label class="label" for="link">Task link</label>
          <div class="control">
            <input class="input" type="url" id="link" v-model="link" />
          </div>
        </div>
        <step-input v-model="steps" />
        <div class="columns is-centered">
          <div class="column is-one-third">
            <button
              class="button is-primary is-fullwidth"
              type="submit"
              :disabled="!isValid"
            >
              save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-form {
  form {
    padding: 1rem 0;
  }
}
</style>
