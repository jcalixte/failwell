import { createTaskFixture } from '@/use-cases/task/models/task.fixture'
import type { TaskStoreState } from '@/use-cases/task/stores/useTask.store'
import { createTestingPinia } from '@pinia/testing'

export interface InitialState {
  'task-store': TaskStoreState
}

const initialState = {
  'task-store': { tasks: [createTaskFixture(), createTaskFixture()] }
}

export const withStore = (partialState?: TaskStoreState) => ({
  global: {
    plugins: [
      createTestingPinia({
        ...partialState,
        initialState
      })
    ]
  }
})
