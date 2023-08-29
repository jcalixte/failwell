import { defineStore } from 'pinia'
import type { Stepable } from '../interfaces/stepable'
import type { Taskable } from '../interfaces/taskable'
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
      this.remove(task.id)
      this.tasks.push(task)
    },
    addStepsToTask(taskId: string, steps: Stepable[], fromStepId: string) {
      const task = this.tasks.find((t) => t.id === taskId)

      if (!task) {
        return
      }

      const fromStepIndex = task.steps.findIndex((s) => s.id === fromStepId)

      if (fromStepIndex < 0) {
        return
      }

      const newSteps = [
        ...task.steps.slice(0, fromStepIndex + 1),
        ...steps.map((step) => ({ ...step, addedAfterward: true })),
        ...task.steps.slice(fromStepIndex + 1)
      ]

      task.steps = newSteps
    },
    reset() {
      this.tasks = []
    },
    remove(taskId: string) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
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
      return (taskId: string, stepId: string): Stepable | null =>
        this.getTask(taskId)?.steps.find((step) => step.id === stepId) ?? null
    }
  }
})
