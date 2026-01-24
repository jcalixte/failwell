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

    expect(step.id).toMatchInlineSnapshot(
      `"66f312736335fce1df9a8b95c7be3fce-1"`
    )
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

  it('parses steps with unchecked checkbox format', () => {
    const stepInTextarea = '- [ ] step with checkbox | 20'

    const expectedStep = fixtureStep({
      id: expect.any(String),
      title: 'step with checkbox',
      estimation: 20
    })

    expect(adaptTextareaToSteps(stepInTextarea)).toEqual([expectedStep])
  })

  it('parses steps with checked checkbox format', () => {
    const stepInTextarea = '- [x] completed step | 15'

    const expectedStep = fixtureStep({
      id: expect.any(String),
      title: 'completed step',
      estimation: 15
    })

    expect(adaptTextareaToSteps(stepInTextarea)).toEqual([expectedStep])
  })

  it('parses checkbox steps without estimation', () => {
    const stepInTextarea = '- [ ] step without estimation'

    const expectedStep = fixtureStep({
      id: expect.any(String),
      title: 'step without estimation',
      estimation: 0
    })

    expect(adaptTextareaToSteps(stepInTextarea)).toEqual([expectedStep])
  })

  describe('subtask support', () => {
    it('flattens indented subtasks with parent prefix', () => {
      const stepInTextarea = `- Parent task | 5
  - Child task 1 | 3
  - Child task 2 | 2`

      const expectedSteps = [
        fixtureStep({
          id: expect.any(String),
          title: '(Parent task) - Child task 1',
          estimation: 3
        }),
        fixtureStep({
          id: expect.any(String),
          title: '(Parent task) - Child task 2',
          estimation: 2
        })
      ]

      expect(adaptTextareaToSteps(stepInTextarea)).toEqual(expectedSteps)
    })

    it('ignores parent estimation when it has children', () => {
      const stepInTextarea = `- Parent | 10
  - Child | 3`

      const steps = adaptTextareaToSteps(stepInTextarea)

      expect(steps).toHaveLength(1)
      expect(steps[0].title).toBe('(Parent) - Child')
      expect(steps[0].estimation).toBe(3)
    })

    it('treats standalone items (no children) as regular steps', () => {
      const stepInTextarea = `- Standalone task | 4`

      const expectedSteps = [
        fixtureStep({
          id: expect.any(String),
          title: 'Standalone task',
          estimation: 4
        })
      ]

      expect(adaptTextareaToSteps(stepInTextarea)).toEqual(expectedSteps)
    })

    it('handles mixed subtasks and standalone items', () => {
      const stepInTextarea = `- Parent task | 5
  - Child task 1 | 3
  - Child task 2 | 2
- Standalone | 4`

      const expectedSteps = [
        fixtureStep({
          id: expect.any(String),
          title: '(Parent task) - Child task 1',
          estimation: 3
        }),
        fixtureStep({
          id: expect.any(String),
          title: '(Parent task) - Child task 2',
          estimation: 2
        }),
        fixtureStep({
          id: expect.any(String),
          title: 'Standalone',
          estimation: 4
        })
      ]

      expect(adaptTextareaToSteps(stepInTextarea)).toEqual(expectedSteps)
    })

    it('handles tab indentation', () => {
      const stepInTextarea = `- Parent | 5
\t- Child | 3`

      const steps = adaptTextareaToSteps(stepInTextarea)

      expect(steps).toHaveLength(1)
      expect(steps[0].title).toBe('(Parent) - Child')
    })

    it('treats orphan indented line as regular step', () => {
      const stepInTextarea = `  - Orphan indented | 3`

      const expectedSteps = [
        fixtureStep({
          id: expect.any(String),
          title: 'Orphan indented',
          estimation: 3
        })
      ]

      expect(adaptTextareaToSteps(stepInTextarea)).toEqual(expectedSteps)
    })

    it('handles multiple parents with their children', () => {
      const stepInTextarea = `- Parent 1 | 5
  - Child 1a | 2
  - Child 1b | 3
- Parent 2 | 4
  - Child 2a | 1`

      const expectedSteps = [
        fixtureStep({
          id: expect.any(String),
          title: '(Parent 1) - Child 1a',
          estimation: 2
        }),
        fixtureStep({
          id: expect.any(String),
          title: '(Parent 1) - Child 1b',
          estimation: 3
        }),
        fixtureStep({
          id: expect.any(String),
          title: '(Parent 2) - Child 2a',
          estimation: 1
        })
      ]

      expect(adaptTextareaToSteps(stepInTextarea)).toEqual(expectedSteps)
    })
  })
})
