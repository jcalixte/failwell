import { toISODate, type ISODate } from '@/shared/types/date'
import { defineStore } from 'pinia'
import type { Recordable } from '../interfaces/recordable'
import type { StepRecordable } from '../interfaces/step-recordable'
import { TaskRecord } from '../models/task-record'

export interface TaskRecordStoreState {
  currentStepId: string | null
  records: { [recordId: string]: Recordable }
}

export const useTaskRecordStore = defineStore('task-record-store', {
  persist: true,
  state: (): TaskRecordStoreState => ({
    currentStepId: null,
    records: {}
  }),
  actions: {
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

      if (Object.values(record.stepRecords).length === 0) {
        record.start = params.start
      }

      this.$patch({
        records: {
          ...this.records,
          [params.taskId]: {
            ...record,
            stepRecords: {
              ...record.stepRecords,
              [params.stepId]: {
                start: params.start
              }
            }
          }
        },
        currentStepId: params.stepId
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
      this.currentStepId = null
    },
    updateRecordNotes(taskId: string, notes: string) {
      const record = this.records[taskId]

      if (record) {
        this.$patch({
          records: {
            ...this.records,
            [taskId]: {
              ...record,
              notes
            }
          }
        })
      }
    },
    reset(taskId: string) {
      this.currentStepId = null
      if (!this.records[taskId]) {
        return
      }
      this.records[taskId].stepRecords = {}
      this.records[taskId].end = undefined
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
      return (taskId: string, stepId: string): StepRecordable | null =>
        this.records[taskId]?.stepRecords[stepId] ?? null
    },
    getRecordNotes() {
      return (taskId: string): string => this.records[taskId]?.notes ?? ''
    }
  }
})
