import { describe, expect, it } from 'vitest'
import { fixtureStep } from '../models/step.fixture'
import {
  adaptStepsToTextarea,
  adaptTextareaToSteps
} from './adaptStepsToTextarea'

describe('adapt steps to textarea value', () => {
  it('returns a string with the listed steps', () => {
    const steps = [fixtureStep(), fixtureStep(), fixtureStep(), fixtureStep()]

    const stepsInTextarea = steps
      .map((step) => `- ${step.title} | ${step.estimation}`)
      .join('\n')

    expect(adaptStepsToTextarea(steps)).toEqual(stepsInTextarea)
  })

  it('returns a list of steps from a textarea value', () => {
    const stepsInTextarea = `- step 1 | 3
- step 2 | 4
- step 3 | 5`

    const expectedSteps = [
      fixtureStep({
        id: expect.any(String),
        title: 'step 1',
        estimation: 3
      }),
      fixtureStep({
        id: expect.any(String),
        title: 'step 2',
        estimation: 4
      }),
      fixtureStep({
        id: expect.any(String),
        title: 'step 3',
        estimation: 5
      })
    ]

    expect(adaptTextareaToSteps(stepsInTextarea)).toEqual(expectedSteps)
  })

  it('fallbacks to 0 for the estimation if there is no estimation', () => {
    const stepInTextarea = '- step 1'

    const expectedStep = fixtureStep({
      id: expect.any(String),
      title: 'step 1',
      estimation: 0
    })

    expect(adaptTextareaToSteps(stepInTextarea)).toEqual([expectedStep])
  })

  it('fallbacks to 0 for the estimation if it can not read the number', () => {
    const stepInTextarea = '- step 1 | not an estimation'

    const expectedStep = fixtureStep({
      id: expect.any(String),
      title: 'step 1',
      estimation: 0
    })

    expect(adaptTextareaToSteps(stepInTextarea)).toEqual([expectedStep])
  })

  it('does not create a step with an empty title', () => {
    const stepInTextArea = '\n-'

    expect(adaptTextareaToSteps(stepInTextArea)).toEqual([])
  })

  it('creates generated ids based on title and estimation', () => {
    const stepInTextarea = '- step 1 | 3'

    const [step] = adaptTextareaToSteps(stepInTextarea)

    expect(step.id).toMatchInlineSnapshot(`"66f312736335fce1df9a8b95c7be3fce-1"`)
  })

  it('creates generated ids based on title and estimation and indexes when duplicated', () => {
    const stepInTextarea = `- step duplicated | 3
- step duplicated | 3`

    const [step1, step2] = adaptTextareaToSteps(stepInTextarea)

    expect(step1.id).toMatchInlineSnapshot(
      `"9b237c28d5254f2b819fa66c853a9a60-1"`
    )
    expect(step2.id).toMatchInlineSnapshot(
      `"9b237c28d5254f2b819fa66c853a9a60-2"`
    )
  })
})
