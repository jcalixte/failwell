import { defineStore } from 'pinia'
import type { Taskable } from '../interfaces/taskable'

interface State {
  tasks: Taskable[]
}

export const useTaskStore = defineStore('task-store', {
  state: (): State => ({
    tasks: []
  }),
  actions: {
    saveTask(task: Taskable) {
      this.tasks.push(task)
    }
  }
})
