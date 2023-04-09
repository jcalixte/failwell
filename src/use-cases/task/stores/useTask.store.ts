import { defineStore } from 'pinia'
import type { Taskable } from '../interfaces/taskable'
import { Task } from '../models/task'

interface StoredTaskable extends Omit<Taskable, 'date'> {
  date: string
}

export interface TaskStoreState {
  tasks: StoredTaskable[]
}

export const useTaskStore = defineStore('task-store', {
  persist: true,
  state: (): TaskStoreState => ({
    tasks: []
  }),
  actions: {
    saveTask(task: Taskable) {
      this.tasks.push({
        ...task,
        date: task.date.toISOString()
      })
    },
    reset() {
      this.tasks = []
    }
  },
  getters: {
    recentTasks(state) {
      return state.tasks
        .map((task) =>
          Task.fromTaskable({ ...task, date: new Date(task.date) })
        )
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    }
  }
})
