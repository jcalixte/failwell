import { router } from '@/router'
import { createTaskFixture } from '@/use-cases/task/models/task.fixture'
import type { TaskStoreState } from '@/use-cases/task/stores/useTask.store'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'

export interface InitialState {
  'task-store': TaskStoreState
}

const initialState = {
  'task-store': { tasks: [createTaskFixture(), createTaskFixture()] }
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
