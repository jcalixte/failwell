import { fixtureRecordable } from '@/modules/record/interfaces/recordable.fixture'
import type { TaskRecordStoreState } from '@/modules/record/stores/useTaskRecordStore'
import { fixtureTask } from '@/modules/task/models/task.fixture'
import type { TaskStoreState } from '@/modules/task/stores/useTask.store'
import { router } from '@/router'
import { toISODate } from '@/shared/types/date'
import { createTestingPinia } from '@pinia/testing'
import type { GlobalMountOptions } from '@vue/test-utils/dist/types'
import { vi } from 'vitest'

export interface InitialState {
  'task-store': TaskStoreState
  'task-record-store': TaskRecordStoreState
}

const tasks = [fixtureTask(), fixtureTask()]
const [firstTask, secondTask] = tasks

const initialState: InitialState = {
  'task-store': { tasks },
  'task-record-store': {
    records: {
      [firstTask.id]: fixtureRecordable({
        taskId: firstTask.id,
        stepRecords: {},
        start: toISODate(new Date()),
        notes: ''
      }),
      [secondTask.id]: fixtureRecordable({
        taskId: secondTask.id,
        stepRecords: {},
        start: toISODate(new Date()),
        notes: ''
      })
    }
  }
}

export const withPlugins = (
  partialState?: Partial<InitialState>,
  global?: Partial<GlobalMountOptions>
): { global: GlobalMountOptions } => ({
  global: {
    ...global,
    plugins: [
      createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          ...initialState,
          ...partialState
        }
      }),
      router
    ]
  }
})
