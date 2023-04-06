import type { Taskable } from '@/use-cases/task/interfaces/taskable'
import { Task } from '@/use-cases/task/models/task'
import { createStepFixture } from '@/use-cases/task/models/step.fixture'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

describe('Task', () => {
  it('has a simple id', () => {
    const uuid = faker.datatype.uuid()

    const task = new Task(uuid)

    expect(task.id).equals(uuid)
  })

  it('allows a new task from a taskable object', () => {
    const taskable: Taskable = {
      id: faker.datatype.uuid(),
      title: faker.animal.lion(),
      link: faker.internet.url(),
      steps: [createStepFixture()]
    }
    const task = Task.fromTaskable(taskable)

    expect(task).toEqual(taskable)
  })

  it('adds steps and removes them', () => {
    const task = new Task(faker.datatype.uuid())

    const [firstStep, secondStep] = [createStepFixture(), createStepFixture()]

    task.addSteps(firstStep, secondStep)

    expect(task.steps).toEqual([firstStep, secondStep])

    task.removeStep(0)
    expect(task.steps).toEqual([secondStep])

    task.removeStep(0)
    expect(task.steps).toEqual([])
  })

  it('must have an id, a title and steps to be valid', () => {
    const task = new Task(faker.datatype.uuid())
    expect(Task.validate(task)).toEqual(false)

    task.title = faker.animal.bird()
    expect(Task.validate(task)).toEqual(false)

    task.addSteps(createStepFixture())
    expect(Task.validate(task)).toEqual(true)
  })
})
