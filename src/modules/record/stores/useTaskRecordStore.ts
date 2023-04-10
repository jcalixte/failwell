import { defineStore } from 'pinia'
import type { Recordable } from '../interfaces/recordable'

export interface TaskRecordStoreState {
  records: { [taskId: string]: Recordable[] }
}

export const useTaskRecordStore = defineStore('task-record-store', {
  persist: true,
  state: (): TaskRecordStoreState => ({
    records: {}
  })
})
