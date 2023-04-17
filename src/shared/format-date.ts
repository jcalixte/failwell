import type { ISODate } from './types/date'

const isTimeSpeedUp = () => process.env.NODE_ENV === 'development'

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
  return Math.max(0, Math.round(diffInMs / (1000 * (isTimeSpeedUp() ? 1 : 60))))
}
