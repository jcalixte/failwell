import { defineStore } from 'pinia'
import type { Taskable } from '../interfaces/taskable'

interface StoredTaskable extends Omit<Taskable, 'date'> {
  date: string
}

export interface TaskStoreState {
  tasks: StoredTaskable[]
}

export const useTaskStore = defineStore('task-store', {
  state: (): TaskStoreState => ({
    tasks: []
  }),
  actions: {
    saveTask(task: Taskable) {
      this.tasks.push({
        ...task,
        totalEstimation: task.totalEstimation,
        date: task.date.toISOString()
      })
    },
    reset() {
      this.tasks = []
    }
  },
  persist: true
})
