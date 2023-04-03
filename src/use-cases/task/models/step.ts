import type { Stepable } from '@/use-cases/task/interfaces/stepable'

export class Step implements Stepable {
  private _steps: Step[] = []

  constructor(
    readonly id: string,
    readonly title: string,
    readonly estimation?: number
  ) {
    return this
  }

  public get steps() {
    return this._steps
  }

  public addSteps(...steps: Stepable[]) {
    this._steps.push(...Step.fromStepable(...steps))
    return this
  }

  public removeStep(index: number) {
    if (index < 0 || index >= this._steps.length) {
      return
    }

    this._steps.splice(index)
  }

  public get totalEstimation(): number {
    return (
      this.estimation ??
      this._steps.reduce((acc, step) => acc + step.totalEstimation, 0)
    )
  }

  public static fromStepable(...stepables: Stepable[]): Step[] {
    return stepables.map((stepable) =>
      new Step(stepable.id, stepable.title, stepable.estimation).addSteps(
        ...Step.fromStepable(...stepable.steps)
      )
    )
  }

  public static getStepLeafs(steps: Stepable[]): Stepable[] {
    return steps.flatMap((step) =>
      step.steps.length > 0 ? Step.getStepLeafs(step.steps) : [step]
    )
  }
}
