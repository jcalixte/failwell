import { defineStore } from 'pinia'
import type { Taskable } from '../interfaces/taskable'

export interface TaskStoreState {
  tasks: Taskable[]
}

export const useTaskStore = defineStore('task-store', {
  state: (): TaskStoreState => ({
    tasks: []
  }),
  actions: {
    saveTask(task: Taskable) {
      this.tasks.push(task)
    }
  }
})
