import type { ISODate } from '@/shared/types/date'
import { defineStore } from 'pinia'
import type { Recordable } from '../interfaces/recordable'
import type { StepRecordable } from '../interfaces/step-recordable'
import { TaskRecord } from '../models/task-record'

type RecordId = string

export interface TaskRecordStoreState {
  records: { [recordId: string]: Recordable }
  taskRecordMaps: { [taskId: string]: RecordId[] }
}

export const useTaskRecordStore = defineStore('task-record-store', {
  persist: true,
  state: (): TaskRecordStoreState => ({
    records: {},
    taskRecordMaps: {}
  }),
  actions: {
    addRecord(taskRecord: TaskRecord) {
      if (!this.taskRecordMaps[taskRecord.taskId]) {
        this.taskRecordMaps[taskRecord.taskId] = []
      }

      this.taskRecordMaps[taskRecord.taskId].push(taskRecord.id)

      this.records[taskRecord.id] = taskRecord
    },
    removeRecord(recordId: string) {
      for (const taskId in this.taskRecordMaps) {
        this.taskRecordMaps[taskId] = this.taskRecordMaps[taskId].filter(
          (rId) => rId !== recordId
        )
      }

      delete this.records[recordId]
    },
    startStepRecord(params: {
      recordId: string
      stepId: string
      start: ISODate
    }) {
      this.records[params.recordId].stepRecords[params.stepId] = {
        problems: [],
        start: params.start
      }
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
      nextStepId: string
      tick: ISODate
    }) {
      this.endStepRecord({
        recordId: params.recordId,
        stepId: params.currentStepId,
        end: params.tick
      })
      this.startStepRecord({
        recordId: params.recordId,
        stepId: params.nextStepId,
        start: params.tick
      })
    },
    addProblemToStepRecord(recordId: string, stepId: string, problem: string) {
      const stepRecord = this.getStepRecord(recordId, stepId)

      if (!stepRecord) {
        return
      }

      stepRecord.problems.push(problem)
    }
  },
  getters: {
    getTaskRecords() {
      return (taskId: string): TaskRecord[] =>
        this.taskRecordMaps?.[taskId]?.map((recordId) =>
          TaskRecord.fromRecordable(this.records[recordId])
        ) ?? []
    },
    createAndRetriveTaskRecord() {
      return (taskId: string, recordId: string): TaskRecord => {
        const hasTaskRecord = this.taskRecordMaps[taskId]?.some(
          (rId) => rId === recordId
        )

        if (hasTaskRecord) {
          return TaskRecord.fromRecordable(this.records[recordId])
        }

        const newTaskRecord = new TaskRecord(recordId, taskId)
        this.taskRecordMaps[taskId]?.push(recordId)
        this.records[recordId] = newTaskRecord

        return newTaskRecord
      }
    },
    getStepRecord() {
      return (recordId: string, stepId: string): StepRecordable | null =>
        this.records?.[recordId]?.stepRecords[stepId] ?? null
    }
  }
})
