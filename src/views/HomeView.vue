<script setup lang="ts">
import TaskList from '@/modules/task/components/TaskList.vue'
import { adaptTextareaToSteps } from '@/modules/task/infra/adaptStepsToTextarea'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const taskStore = useTaskStore()
const router = useRouter()

const hasTask = computed(() => taskStore.tasks.length > 0)

const resetTasks = () => {
  if (window.confirm('Are you sure you want to clear all your tasks?')) {
    taskStore.reset()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  const clipboardText = event.clipboardData?.getData('text')
  if (!clipboardText) {
    return
  }

  const steps = adaptTextareaToSteps(clipboardText)
  if (steps.length === 0) {
    return
  }

  router.push({
    name: 'new-task',
    state: { initialSteps: JSON.stringify(steps) }
  })
}

onMounted(() => {
  document.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <main>
    <div class="content-tasks columns is-centered is-vcentered">
      <div class="new-task-container column">
        <div class="buttons">
          <router-link :to="{ name: 'new-task' }" class="button is-primary">
            new task
          </router-link>
          <button v-if="hasTask" class="button is-danger" @click="resetTasks">
            clear the list
          </button>
        </div>
        <section class="message is-info paste-hint">
          <div class="message-body">
            Paste a list of items to directly create a new task
          </div>
        </section>
      </div>
      <task-list class="column task-list" />
    </div>
    <!--
    <footer>
    <p>
        Made with <img src="@/assets/icons/love.svg" alt="love" /> by
        <a
        href="http://github.com/jcalixte/loopycode"
        target="_blank"
        rel="noopener noreferrer"
        >Julien</a
        >
    </p>
    </footer>
    -->
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.content-tasks {
  flex: 1;
}

.new-task-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.paste-hint {
  margin: 1rem;
  text-align: center;
}

.task-list {
  max-height: 60vh;
  overflow-y: auto;
  margin: 0 1rem;
  border-radius: 0.3rem;
}

footer {
  text-align: center;
  padding-bottom: 0.5rem;
}

footer img {
  vertical-align: middle;
}
</style>
