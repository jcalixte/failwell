import type { Stepable } from '@/modules/task/interfaces/stepable'
import type { Taskable } from '@/modules/task/interfaces/taskable'
import { toISODate } from '@/shared/types/date'

export class Task implements Taskable {
  public date = toISODate(new Date())
  public steps: Stepable[] = []
  public link: string | null = null

  constructor(public readonly id: string, public readonly title: string) {}

  public addSteps(...steps: Stepable[]) {
    this.steps.push(...steps)
    return this
  }

  public removeStep(index: number) {
    if (index < 0) {
      return this
    }

    if (index >= this.steps.length) {
      return this
    }

    this.steps.splice(index, 1)
    return this
  }

  public get totalEstimation() {
    return this.steps.map((step) => step.estimation).reduce((a, b) => a + b, 0)
  }

  public static fromTaskable(taskable: Taskable) {
    const task = new Task(taskable.id, taskable.title)
    task.link = taskable.link
    task.date = taskable.date
    task.addSteps(...taskable.steps)

    return task
  }

  public static validate(task: Taskable) {
    return !!task.id && !!task.title && task.steps.length > 0
  }
}
