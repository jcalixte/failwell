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
    <div class="columns is-centered">
      <div class="new-task-container column buttons">
        <router-link :to="{ name: 'new-task' }" class="button is-primary"
          >Create a new task</router-link
        >
        <button v-if="hasTask" class="button is-danger" @click="resetTasks">
          clear the list
        </button>
      </div>
      <task-list class="column" />
    </div>
    <footer>
      <p>
        Made with <img src="@/assets/icons/love.svg" alt="love" /> by
        <a
          href="http://github.com/jcalixte"
          target="_blank"
          rel="noopener noreferrer"
          >Julien</a
        >
      </p>
    </footer>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.new-task-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

footer img {
  vertical-align: middle;
}
</style>
