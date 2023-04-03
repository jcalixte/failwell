import { describe, expect, it } from 'vitest'
import { Step } from '@/use-cases/task/models/step'
import { createStepFixture } from '@/use-cases/task/models/step.fixture'

describe('Step', () => {
  it('adds substeps', () => {
    const step = createStepFixture()

    step.addSteps(createStepFixture())

    expect(step.steps.length).toEqual(1)
  })

  it('removes substeps', () => {
    const step = createStepFixture()
    step.addSteps(createStepFixture())

    step.removeStep(0)

    expect(step.steps.length).toEqual(0)
  })

  it('tells the estimation based on the sum of its substeps', () => {
    const step = createStepFixture()
      .addSteps(
        createStepFixture({
          estimation: 1
        })
      )
      .addSteps(
        createStepFixture({
          estimation: 2
        })
      )
      .addSteps(
        createStepFixture({
          estimation: 3
        })
      )

    expect(step.totalEstimation).toBe(6)
  })

  it('tells the total estimation if the step estimation is set even with substeps', () => {
    const step = createStepFixture({
      estimation: 8
    })
      .addSteps(
        createStepFixture({
          estimation: 1
        })
      )
      .addSteps(
        createStepFixture({
          estimation: 2
        })
      )

    expect(step.totalEstimation).toEqual(8)
  })

  it('flattens the substeps', () => {
    const leafs = [
      createStepFixture({
        id: 'leaf-1'
      }),
      createStepFixture({
        id: 'leaf-2'
      }),
      createStepFixture({
        id: 'leaf-3'
      })
    ]

    const step = createStepFixture().addSteps(
      createStepFixture().addSteps(leafs[0], leafs[1]),
      createStepFixture().addSteps(createStepFixture().addSteps(leafs[2]))
    )
    const steps = Step.getStepLeafs([step])

    expect(steps).toEqual(leafs)
  })
})
