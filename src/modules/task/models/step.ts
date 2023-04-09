import type { Stepable } from '@/modules/task/interfaces/stepable'

export class Step implements Stepable {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly estimation: number
  ) {
    return this
  }

  public static fromStepable(...stepables: Stepable[]): Step[] {
    return stepables.map(
      (stepable) => new Step(stepable.id, stepable.title, stepable.estimation)
    )
  }
}
