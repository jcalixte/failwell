import type { TaskRecordStoreState } from '@/modules/record/stores/useTaskRecordStore'
import { createTaskFixture } from '@/modules/task/models/task.fixture'
import type { TaskStoreState } from '@/modules/task/stores/useTask.store'
import { router } from '@/router'
import { toISODate } from '@/shared/types/date'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'

export interface InitialState {
  'task-store': TaskStoreState
  'task-record-store': TaskRecordStoreState
}

const tasks = [createTaskFixture(), createTaskFixture()]

const initialState: InitialState = {
  'task-store': { tasks },
  'task-record-store': {
    currentStepId: null,
    records: {
      [tasks[0].id]: {
        taskId: tasks[0].id,
        stepRecords: {},
        start: toISODate(new Date()),
        notes: ''
      },
      [tasks[1].id]: {
        taskId: tasks[1].id,
        stepRecords: {},
        start: toISODate(new Date()),
        notes: ''
      }
    }
  }
}

export const withPlugins = (partialState?: TaskStoreState) => ({
  global: {
    plugins: [
      createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          ...partialState,
          ...initialState
        }
      }),
      router
    ]
  }
})
