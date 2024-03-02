import type { Stepable } from '@/modules/task/interfaces/stepable'
import type { Taskable } from '@/modules/task/interfaces/taskable'
import { toISODate } from '@/shared/types/date'

export class Task implements Taskable {
  public readonly stepHistory: Stepable[][] = []
  public date = toISODate(new Date())
  public link: string | null = null

  constructor(
    public readonly id: string,
    public readonly title: string,
    history: Stepable[][] = []
  ) {
    this.stepHistory = history
  }

  public get initialPlan() {
    return this.stepHistory[0] ?? []
  }

  public get steps(): Stepable[] {
    return this.stepHistory[this.stepHistory.length - 1] ?? []
  }

  public get wasUpdated() {
    return this.stepHistory.length > 0
  }

  public editSteps(...steps: Stepable[]) {
    this.stepHistory.push([...this.steps, ...steps])
    return this
  }

  public newSteps(steps: Stepable[]) {
    this.stepHistory.push(steps)
    return this
  }

  public removeStep(index: number) {
    if (index < 0) {
      return this
    }

    if (index >= this.steps.length) {
      return this
    }

    this.stepHistory.push(this.steps.filter((_, i) => i !== index))
    return this
  }

  public updateSteps(steps: Stepable[]) {
    this.stepHistory.push(steps)
    return this
  }

  public get totalEstimation() {
    return this.steps.map((step) => step.estimation).reduce((a, b) => a + b, 0)
  }

  public static fromTaskable(taskable: Taskable) {
    const task = new Task(taskable.id, taskable.title, taskable.stepHistory)
    task.link = taskable.link
    task.date = taskable.date

    return task
  }

  public static validate(task: Taskable) {
    return !!task.id && !!task.title && Task.fromTaskable(task).steps.length > 0
  }
}
