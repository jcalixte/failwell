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
