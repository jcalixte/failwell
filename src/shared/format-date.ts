import type { ISODate } from './types/date'

export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleString()

export const formatLongDate = (date: Date | ISODate) =>
  new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

export const formatDiffInMinutes = (date1: ISODate, date2: ISODate) => {
  const diffInMs = new Date(date2).getTime() - new Date(date1).getTime()
  // TODO: diff in minutes not in seconds
  return Math.max(0, Math.round(diffInMs / 1000))
}
