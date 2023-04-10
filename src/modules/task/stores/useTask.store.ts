import { defineStore } from 'pinia'
import type { Taskable } from '../interfaces/taskable'
import type { Step } from '../models/step'
import { Task } from '../models/task'

export interface TaskStoreState {
  tasks: Taskable[]
}

export const useTaskStore = defineStore('task-store', {
  persist: true,
  state: (): TaskStoreState => ({
    tasks: []
  }),
  actions: {
    saveTask(task: Taskable) {
      this.tasks.push(task)
    },
    reset() {
      this.tasks = []
    }
  },
  getters: {
    recentTasks(state) {
      return state.tasks
        .map((task) => Task.fromTaskable(task))
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    },
    getTask() {
      return (taskId: string): Task | null =>
        this.recentTasks.find((task) => task.id === taskId) ?? null
    },
    getStep() {
      return (taskId: string, stepId: string): Step | null =>
        this.getTask(taskId)?.steps.find((step) => step.id === stepId) ?? null
    }
  }
})
