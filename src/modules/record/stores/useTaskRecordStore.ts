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
    addRecord(taskRecord: TaskRecord) {
      this.records[taskRecord.id] = taskRecord
    },
    removeRecord(recordId: string) {
      delete this.records[recordId]
    },
    startStepRecord(params: {
      recordId: string
      stepId: string
      start: ISODate
    }) {
      const record = this.records[params.recordId]

      if (Object.values(record.stepRecords).length === 0) {
        record.start = params.start
      }

      this.$patch({
        records: {
          ...this.records,
          [params.recordId]: {
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
    endStepRecord(params: { recordId: string; stepId: string; end: ISODate }) {
      const stepRecord =
        this.records[params.recordId].stepRecords[params.stepId]

      if (!stepRecord) {
        return
      }

      stepRecord.end = params.end
    },
    nextStepRecord(params: {
      recordId: string
      currentStepId: string
      nextStepId: string | null
      tick: ISODate
    }) {
      this.endStepRecord({
        recordId: params.recordId,
        stepId: params.currentStepId,
        end: params.tick
      })

      if (!params.nextStepId) {
        this.endRecord(params.recordId)
        return
      }

      this.startStepRecord({
        recordId: params.recordId,
        stepId: params.nextStepId,
        start: params.tick
      })
    },
    endRecord(recordId: string) {
      this.records[recordId].end = toISODate(new Date())
      this.currentStepId = null
    },
    updateRecordNotes(recordId: string, notes: string) {
      const record = this.records[recordId]

      if (record) {
        this.$patch({
          records: {
            ...this.records,
            [recordId]: {
              ...record,
              notes
            }
          }
        })
      }
    }
  },
  getters: {
    getTaskRecords() {
      return (taskId: string): TaskRecord[] =>
        Object.values(this.records)
          .filter((record) => record.taskId === taskId)
          .map((record) => TaskRecord.fromRecordable(record))
    },
    createAndRetrieveTaskRecord() {
      return (taskId: string, recordId: string): TaskRecord => {
        const hasTaskRecord = !!this.records[recordId]

        if (hasTaskRecord) {
          return TaskRecord.fromRecordable(this.records[recordId])
        }

        const newTaskRecord = new TaskRecord(recordId, taskId)
        this.records[recordId] = newTaskRecord

        return newTaskRecord
      }
    },
    getRecord() {
      return (recordId: string): Recordable | null =>
        this.records[recordId] ?? null
    },
    getStepRecord() {
      return (recordId: string, stepId: string): StepRecordable | null =>
        this.records[recordId]?.stepRecords[stepId] ?? null
    },
    getRecordNotes() {
      return (recordId: string): string => this.records[recordId]?.notes ?? ''
    }
  }
})
