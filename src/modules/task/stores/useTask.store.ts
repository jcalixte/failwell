import { defineStore } from 'pinia'
import type { Stepable } from '../interfaces/stepable'
import type { Taskable } from '../interfaces/taskable'
import { Task } from '../models/task'
import { useTaskRecordStore } from '@/modules/record/stores/useTaskRecordStore'

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
    editStepsToTask(taskId: string, steps: Stepable[]) {
      this.tasks = this.tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const newTask = Task.fromTaskable(task)

        newTask.newSteps(steps)
        useTaskRecordStore().cleanCurrentStepId(newTask)

        return newTask
      })
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
