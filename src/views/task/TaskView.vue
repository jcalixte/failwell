<script setup lang="ts">
import EstimationTimeArrival from '@/components/EstimationTimeArrival.vue'
import TaskRecordPreview from '@/modules/record/components/TaskRecordPreview.vue'
import TaskNotFound from '@/modules/task/components/TaskNotFound.vue'
import { useCopyRecord } from '@/modules/record/hooks/useCopyRecord.hook'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const taskStore = useTaskStore()

const task = computed(() => taskStore.getTask(props.id))

const deleteTask = () => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    taskStore.remove(props.id)
    router.replace({
      name: 'home'
    })
  }
}

const { canShareTask, taskCopied, shareTask } = useCopyRecord(task)
</script>

<template>
  <div class="task-view" v-if="task">
    <div class="buttons actions">
      <router-link
        :to="{
          name: 'edit-task',
          params: {
            id
          }
        }"
        class="button"
      >
        <img src="/icons/edit.svg" alt="edit task" />
      </router-link>
      <button v-if="canShareTask" class="share-task button" @click="shareTask">
        <img v-if="taskCopied" src="/icons/check.svg" alt="task copied!" />
        <img v-else src="/icons/share.svg" alt="share task" />
      </button>
      <router-link
        :to="{
          name: 'duplicate-task',
          params: {
            id
          }
        }"
        class="button"
      >
        <img src="/icons/copy.svg" alt="duplicate task" />
      </router-link>
      <button class="delete-task button is-light is-danger" @click="deleteTask">
        <img src="/icons/trash.svg" alt="delete task" />
      </button>
    </div>
    <h1 class="title">{{ task.title }}</h1>
    <h2 class="subtitle">
      <estimation-time-arrival :estimation="task.totalEstimation" />
    </h2>
    <a
      v-if="task.link"
      :href="task.link"
      target="_blank"
      rel="noopener noreferrer"
      class="button is-link"
      >user story link</a
    >
    <task-record-preview :task-id="id" />
    <hr />
    <div class="content">
      <ol>
        <li v-for="step in task.steps" :key="step.id">
          <div class="step-item">
            <span>{{ step.title }}</span>
            <span class="tag">{{ step.estimation }} minutes</span>
          </div>
        </li>
      </ol>
    </div>
  </div>
  <task-not-found v-else />
</template>

<style scoped>
.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  max-width: 600px;
}

.actions {
  float: right;
}
</style>
