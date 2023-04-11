import { createUuid } from '@/shared/create-uuid'
import type { Stepable } from '../interfaces/stepable'

export const adaptStepsToTextarea = (steps: Stepable[]) =>
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

export const adaptTextareaToSteps = (textareaValue: string): Stepable[] =>
  textareaValue
    .split('\n')
    .map((rawStep) => {
      const [title, estimation] = extractTitleAndEstimationFromStep(rawStep)

      if (!title) {
        return null
      }

      return { id: createUuid(), title, estimation }
    })
    .filter((step) => step !== null) as Stepable[]
