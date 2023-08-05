<script setup lang="ts">
import TaskForm from '@/modules/task/components/TaskForm.vue'
import TaskNotFound from '@/modules/task/components/TaskNotFound.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { ref } from 'vue'

const props = defineProps<{ id: string }>()
const taskStore = useTaskStore()

const isMessageDisplayed = ref(true)

const task = taskStore.getTask(props.id)
</script>

<template>
  <div class="edit-task">
    <div class="columns is-centered" v-if="isMessageDisplayed">
      <div class="column is-one-third">
        <section class="message is-info">
          <div class="message-header">
            <p>Info</p>
            <button
              class="delete"
              aria-label="delete"
              @click="isMessageDisplayed = false"
            ></button>
          </div>
          <div class="message-body">
            When editing a task, record will be reset.
          </div>
        </section>
      </div>
    </div>
    <TaskForm v-if="task" :id="task.id" :initial-task="task" />
    <task-not-found v-else />
  </div>
</template>
