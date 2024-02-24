<script setup lang="ts">
import EstimationTimeArrival from '@/components/EstimationTimeArrival.vue'
import TaskRecordPreview from '@/modules/record/components/TaskRecordPreview.vue'
import TaskNotFound from '@/modules/task/components/TaskNotFound.vue'
import { useCopyRecord } from '@/modules/record/hooks/useCopyRecord.hook'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RecordStepTable from '@/modules/record/components/RecordStepTable.vue'
import StepTable from '@/modules/step/components/StepTable.vue'

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
          name: 'record-view',
          params: { taskId: id }
        }"
        class="button is-primary is-light"
        >start session</router-link
      >
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
    <a
      v-if="task.link"
      :href="task.link"
      target="_blank"
      rel="noopener noreferrer"
      class="button is-link"
      >Task link</a
    >
    <div class="content" :id="`task-${id}`">
      <h1 class="title">{{ task.title }}</h1>
      <h2 class="subtitle">
        <estimation-time-arrival :estimation="task.totalEstimation" />
      </h2>
      <task-record-preview :task-id="id" />
      <record-step-table :id="id" :steps="task.steps" />
      <details v-if="task.initialPlan">
        <summary>Initial plan</summary>
        <step-table :id="id" :steps="task.initialPlan" />
      </details>
    </div>
  </div>
  <task-not-found v-else />
</template>

<style scoped>
.actions {
  float: right;
}

.content {
  background-color: white;
  max-width: 800px;
  margin: auto;
  padding: 0 1rem;
}
</style>
