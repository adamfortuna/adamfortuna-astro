import isDate from 'lodash/isDate'

export const getYearDiffWithMonth = (startDate: Date, endDate: Date) => {
  const ms = endDate.getTime() - startDate.getTime()

  const date = new Date(ms)

  return Math.abs(date.getUTCFullYear() - 1969)
}

export const dateFormatLong = (date: any) => {
  const d = isDate(date) ? date : new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const dateFullLong = (date: any) => {
  const d = isDate(date) ? date : new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const dateFormatMicroformat = (date: any) => {
  const d = isDate(date) ? date : new Date(date)
  return d.toISOString()
}
