import { generateId } from '@/shared/generate-id'
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

      return { id: generateId(`${title}-${estimation}`), title, estimation }
    })
    .filter((step): step is Stepable => step !== null)
    .map((step, index, steps) => {
      const subSteps = steps.slice(0, index + 1)
      const duplicates = subSteps.filter((s) => s.id === step.id).length

      return { ...step, id: `${step.id}-${duplicates}` }
    })
