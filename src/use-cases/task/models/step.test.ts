import { describe, expect, it } from 'vitest'
import { Step } from '@/use-cases/task/models/step'
import { faker } from '@faker-js/faker'
import type { Stepable } from '@/use-cases/task/interfaces/stepable'

const createStep = (partialStep?: Partial<Stepable>) =>
  new Step(
    partialStep?.id ?? faker.datatype.uuid(),
    partialStep?.title ?? faker.animal.bird(),
    partialStep?.estimation
  )

describe('Step', () => {
  it('adds substeps', () => {
    const step = createStep()

    step.addSteps(createStep())

    expect(step.steps.length).toEqual(1)
  })

  it('removes substeps', () => {
    const step = createStep()
    step.addSteps(createStep())

    step.removeStep(0)

    expect(step.steps.length).toEqual(0)
  })

  it('tells the estimation based on the sum of its substeps', () => {
    const step = createStep()
      .addSteps(
        createStep({
          estimation: 1
        })
      )
      .addSteps(
        createStep({
          estimation: 2
        })
      )
      .addSteps(
        createStep({
          estimation: 3
        })
      )

    expect(step.totalEstimation).toBe(6)
  })

  it('tells the total estimation if the step estimation is set even with substeps', () => {
    const step = createStep({
      estimation: 8
    })
      .addSteps(
        createStep({
          estimation: 1
        })
      )
      .addSteps(
        createStep({
          estimation: 2
        })
      )

    expect(step.totalEstimation).toEqual(8)
  })

  it('flattens the substeps', () => {
    const leafs = [
      createStep({
        id: 'leaf-1'
      }),
      createStep({
        id: 'leaf-2'
      }),
      createStep({
        id: 'leaf-3'
      })
    ]

    const step = createStep().addSteps(
      createStep().addSteps(leafs[0], leafs[1]),
      createStep().addSteps(createStep().addSteps(leafs[2]))
    )
    const steps = Step.getStepLeafs([step])

    expect(steps).toEqual(leafs)
  })
})
