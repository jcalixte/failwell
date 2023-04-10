import { defineStore } from 'pinia'
import type { Recordable } from '../interfaces/recordable'

interface StoredTaskRecordable
  extends Omit<Recordable, 'start' | 'end' | 'stepRecords'> {
  start: string
  end?: string
  stepRecords: Record<string, { start: string; end?: string }>
}

export interface TaskRecordStoreState {
  records: { [taskId: string]: StoredTaskRecordable[] }
}

export const useTaskRecordStore = defineStore('task-record-store', {
  persist: true,
  state: (): TaskRecordStoreState => ({
    records: {}
  })
})
