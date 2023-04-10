export interface Recordable {
  id: string
  taskId: string
  start: Date
  end?: Date
  stepRecords: Record<string, { start: Date; end?: Date }>
}
