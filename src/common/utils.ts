import { format, isValid, parse } from 'date-fns'
import { CsvRow } from '../interfaces/row.type'

export const transformDate = (dateStr: string, interval: string): string => {
  if (!dateStr) {
    return '' // Return empty string for missing or empty date values
  }

  // Adjust the expected format to match your date strings
  const expectedFormat = 'yyyy-MM-dd' // Use 'yyyy-MM-dd' for date strings like '2024-07-20'
  const date = parse(dateStr, expectedFormat, new Date())

  console.log({ date })

  // Check if the date is valid
  if (!isValid(date)) {
    console.error(`Invalid date detected: ${dateStr}`)
    return '' // Return empty string or a default value for invalid dates
  }

  switch (interval) {
    case 'year':
      return format(date, 'yyyy') // Group by year
    case 'month':
      return format(date, 'yyyy-MM') // Group by month
    case 'week':
      return format(date, 'yyyy-wo') // Group by week
    default:
      return dateStr // Return the original string if no grouping is applied
  }
}

export const transformRowData = (
  row: CsvRow,
  rowPivots: string[],
  columnPivots: string[],
  headers: string[],
  dateGroupingInterval: string,
  transformDate: (dateStr: string, interval: string) => string,
  isDateField: (field: string) => boolean
): CsvRow => {
  const transformedRow: Partial<CsvRow> = { ...row }

  // Transform row pivots
  rowPivots.forEach((pivot) => {
    if (
      dateGroupingInterval !== 'none' &&
      headers.includes(pivot) &&
      isDateField(pivot)
    ) {
      const dateValue = row[pivot as keyof CsvRow]
      if (typeof dateValue === 'string') {
        transformedRow[pivot as keyof CsvRow] = transformDate(
          dateValue,
          dateGroupingInterval
        ) as any
      }
    }
  })

  // Transform column pivots
  columnPivots.forEach((pivot) => {
    if (
      dateGroupingInterval !== 'none' &&
      headers.includes(pivot) &&
      isDateField(pivot)
    ) {
      const dateValue = row[pivot as keyof CsvRow]
      if (typeof dateValue === 'string') {
        transformedRow[pivot as keyof CsvRow] = transformDate(
          dateValue,
          dateGroupingInterval
        ) as any
      }
    }
  })

  return transformedRow as CsvRow
}
