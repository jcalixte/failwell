import type { Task } from '@/modules/task/models/task'
import { toISODate, type ISODate } from '@/shared/types/date'
import { defineStore } from 'pinia'
import type { Recordable } from '../interfaces/recordable'
import type { TimeRange } from '../interfaces/time-range'
import { TaskRecord } from '../models/task-record'
import { addBreakTimeToStepRecords } from '../services/breaktime-service'

export interface TaskRecordStoreState {
  records: { [recordId: string]: Recordable }
}

export const useTaskRecordStore = defineStore('task-record-store', {
  persist: true,
  state: (): TaskRecordStoreState => ({
    records: {}
  }),
  actions: {
    syncTaskRecord(task: Task) {
      if (!(task.id in this.records)) {
        return
      }

      const record = this.records[task.id]

      const taskRecordStepIds = Object.keys(record)
      const taskStepIds = new Set(task.steps.map((step) => step.id))

      const hasSameSteps =
        taskRecordStepIds.length === taskStepIds.size &&
        taskRecordStepIds.every((taskRecordStepId) =>
          taskStepIds.has(taskRecordStepId)
        )

      if (!hasSameSteps) {
        this.records[task.id] = new TaskRecord(task.id)
      }
    },
    addRecord(taskId: string) {
      if (taskId in this.records) {
        return
      }

      this.records[taskId] = new TaskRecord(taskId)
    },
    removeRecord(taskId: string) {
      delete this.records[taskId]
    },
    startStepRecord(params: {
      taskId: string
      stepId: string
      start: ISODate
    }) {
      const record = this.records[params.taskId]

      if (!record) {
        return
      }

      if (!record.stepRecords) {
        record.stepRecords = {}
      }

      if (Object.values(record.stepRecords).length === 0) {
        record.start = params.start
      }

      this.$patch({
        records: {
          ...this.records,
          [params.taskId]: {
            ...record,
            breakTime: undefined,
            stepRecords: {
              ...record.stepRecords,
              [params.stepId]: {
                start: params.start
              }
            },
            currentStepId: params.stepId
          }
        }
      })
    },
    endStepRecord(params: { taskId: string; stepId: string; end: ISODate }) {
      const stepRecord = this.records[params.taskId]?.stepRecords[params.stepId]

      if (!stepRecord) {
        return
      }

      stepRecord.end = params.end
    },
    nextStepRecord(params: {
      taskId: string
      currentStepId: string
      nextStepId: string | null
      tick: ISODate
    }) {
      this.endStepRecord({
        taskId: params.taskId,
        stepId: params.currentStepId,
        end: params.tick
      })

      if (!params.nextStepId) {
        this.endRecord(params.taskId)
        return
      }

      this.startStepRecord({
        taskId: params.taskId,
        stepId: params.nextStepId,
        start: params.tick
      })
    },
    endRecord(taskId: string) {
      if (!this.records[taskId]) {
        return
      }

      this.records[taskId].end = toISODate(new Date())
      this.records[taskId].currentStepId = null
    },
    updateRecordNotes(taskId: string, notes: string) {
      const record = this.records[taskId]

      if (!record) {
        return
      }

      this.$patch({
        records: {
          ...this.records,
          [taskId]: {
            ...record,
            notes
          }
        }
      })
    },
    reset(taskId: string) {
      if (!this.records[taskId]) {
        return
      }
      this.records[taskId].stepRecords = {}
      this.records[taskId].end = undefined
      this.records[taskId].currentStepId = null
    },
    pause(taskId: string) {
      if (this.records[taskId]?.breakTime) {
        return
      }

      const record = this.records[taskId]

      this.$patch({
        records: {
          ...this.records,
          [taskId]: {
            ...record,
            breakTime: {
              start: toISODate(new Date())
            }
          }
        }
      })
    },
    resume(taskId: string) {
      const record = this.records[taskId]

      if (!record?.breakTime) {
        return
      }

      record.breakTime.end = toISODate(new Date())

      const newRecord: Recordable = {
        ...addBreakTimeToStepRecords(record),
        breakTime: undefined
      }

      this.$patch({
        records: {
          ...this.records,
          [taskId]: {
            ...newRecord
          }
        }
      })
    }
  },
  getters: {
    getTaskRecord() {
      return (taskId: string): TaskRecord | null => {
        const hasTaskRecord = !!this.records[taskId]

        if (hasTaskRecord) {
          return TaskRecord.fromRecordable(this.records[taskId])
        }

        return null
      }
    },
    getRecord() {
      return (taskId: string): Recordable | null => this.records[taskId] ?? null
    },
    getStepRecord() {
      return (taskId: string, stepId: string): TimeRange | null =>
        this.records[taskId]?.stepRecords?.[stepId] ?? null
    },
    getRecordNotes() {
      return (taskId: string): string => this.records[taskId]?.notes ?? ''
    }
  }
})
