import { generateId } from '@/shared/generate-id'
import type { Stepable } from '../interfaces/stepable'

export const adaptStepsToTextarea = (steps: Stepable[]) =>
  steps.map((step) => `- ${step.title} | ${step.estimation}`).join('\n')

const isIndented = (line: string): boolean => /^[\t ]+/.test(line)

const extractTitleAndEstimationFromStep = (
  rawStep: string
): [string, number] => {
  const [rawTitle, rawEstimation] = rawStep
    .trim()
    .replace(/^-\s*(\[[ x]\]\s*)?/, '')
    .split('|')
  const title = rawTitle.trim()

  const estimationString = (rawEstimation || '').trim()
  const estimation = Number(estimationString)

  if (isNaN(estimation)) {
    return [title, 0]
  }

  return [title, estimation]
}

export const adaptTextareaToSteps = (textareaValue: string): Stepable[] => {
  const lines = textareaValue.split('\n')
  const result: Array<{ title: string; estimation: number }> = []

  let currentParent: { title: string; estimation: number } | null = null
  let parentHasChildren = false

  const flushParent = () => {
    if (currentParent && !parentHasChildren) {
      result.push(currentParent)
    }
    currentParent = null
    parentHasChildren = false
  }

  for (const line of lines) {
    const [title, estimation] = extractTitleAndEstimationFromStep(line)

    if (!title) {
      continue
    }

    if (isIndented(line)) {
      // Indented line - flatten with parent prefix if parent exists
      if (currentParent && currentParent.title) {
        const flattenedTitle = `(${currentParent.title}) - ${title}`
        result.push({ title: flattenedTitle, estimation })
        parentHasChildren = true
      } else {
        // Orphan indented line - treat as regular step
        result.push({ title, estimation })
      }
    } else {
      // Non-indented line - potential parent
      flushParent()
      currentParent = { title, estimation }
    }
  }

  // Flush any remaining parent
  flushParent()

  return result
    .map(({ title, estimation }) => ({
      id: generateId(`${title}-${estimation}`),
      title,
      estimation
    }))
    .map((step, index, steps) => {
      const subSteps = steps.slice(0, index + 1)
      const duplicates = subSteps.filter((s) => s.id === step.id).length

      return { ...step, id: `${step.id}-${duplicates}` }
    })
}
