<script setup lang="ts">
import TaskList from '@/modules/task/components/TaskList.vue'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { computed } from 'vue'

const taskStore = useTaskStore()

const hasTask = computed(() => taskStore.tasks.length > 0)

const resetTasks = () => {
  if (window.confirm('Are you sure you want to clear all your tasks?')) {
    taskStore.reset()
  }
}
</script>

<template>
  <main>
    <div class="content-tasks columns is-centered is-vcentered">
      <div class="new-task-container column buttons">
        <router-link :to="{ name: 'new-task' }" class="button is-primary">
          new task
        </router-link>
        <button v-if="hasTask" class="button is-danger" @click="resetTasks">
          clear the list
        </button>
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
