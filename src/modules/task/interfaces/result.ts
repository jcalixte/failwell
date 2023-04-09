export enum ResultStatus {
  RUN,
  DEBRIEF
}

export interface Result {
  taskId: string
  time: number
  steps: Record<string, number>
  currentStepId: string | null
  status: ResultStatus
}
