import { isValid, v } from 'suretype'

export interface Stepable {
  id: string
  title: string
  estimation?: number
  steps: Stepable[]
  /**
   * total estimation in minutes
   */
  totalEstimation: number
}

const stepableSchema = v.object({
  id: v.string().minLength(1).required(),
  title: v.string().minLength(1).required(),
  estimation: v.number(),
  totalEstimation: v.number().required()
})

const isValidStepable = (data: unknown) => isValid(stepableSchema, data)
