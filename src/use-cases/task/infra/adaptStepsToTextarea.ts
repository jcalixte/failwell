import { createUuid } from '@/shared/create-uuid'
import { Step } from '../models/step'

export const adaptStepsToTextarea = (steps: Step[]) =>
  steps.map((step) => `- ${step.title} | ${step.estimation}`).join('\n')

const extractTitleAndEstimationFromStep = (
  rawStep: string
): [string, number] => {
  const [rawTitle, rawEstimation] = rawStep
    .trim()
    .replace(/^-\s*/, '')
    .split('|')
  const title = rawTitle.trim()

  const estimationString = (rawEstimation || '').trim()
  const estimation = Number(estimationString)

  if (isNaN(estimation)) {
    return [title, 0]
  }

  return [title, estimation]
}

export const adaptTextareaToSteps = (textareaValue: string): Step[] =>
  textareaValue
    .split('\n')
    .map((rawStep) => {
      const [title, estimation] = extractTitleAndEstimationFromStep(rawStep)

      if (!title) {
        return null
      }

      return new Step(createUuid(), title, estimation)
    })
    .filter((step) => step !== null) as Step[]
