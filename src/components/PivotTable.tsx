import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { format, isValid, parse } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { CsvRow } from '../interfaces/row.type'

interface PivotTableProps {
  data: CsvRow[]
  headers: string[]
}

// Function to transform dates into desired intervals
const transformDate = (dateStr: string, interval: string) => {
  // Specify the expected format of the date string
  const expectedFormat = 'M/d/yyyy'

  const date = parse(dateStr, expectedFormat, new Date())

  // Check if the date is valid
  if (!isValid(date)) {
    console.error(`Invalid date detected: ${dateStr}`)
    return 'Invalid Date' // or return an empty string or default value
  }

  switch (interval) {
    case 'year':
      return format(date, 'yyyy') // Group by year
    case 'month':
      return format(date, 'yyyy-MM') // Group by month
    case 'week':
      return format(date, 'yyyy-wo') // Group by week
    default:
      return dateStr
  }
}

const PivotTable: React.FC<PivotTableProps> = ({ data, headers }) => {
  const [rowPivots, setRowPivots] = useState<string[]>(['Entity'])
  const [columnPivots, setColumnPivots] = useState<string[]>([
    'Operating status',
  ])
  const [valuePivot, setValuePivot] = useState<string>('Power units')
  const [aggregation, setAggregation] = useState<string>('sum')
  const [dateGroupingInterval, setDateGroupingInterval] =
    useState<string>('none')
  const [pivotData, setPivotData] = useState<{
    [key: string]: { [key: string]: number }
  }>({})
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Initialize the web worker
  useEffect(() => {
    const newWorker = new Worker(
      new URL('../workers/worker.ts', import.meta.url),
      { type: 'module' }
    )
    setWorker(newWorker)
    return () => {
      newWorker.terminate()
    }
  }, [])

  useEffect(() => {
    if (worker) {
      setLoading(true)
      const transformedData = data.map((row) => {
        const transformedRow = { ...row }

        // Apply date transformation to row pivots
        rowPivots.forEach((pivot) => {
          if (
            dateGroupingInterval !== 'none' &&
            headers.includes(pivot) &&
            isDateField(pivot)
          ) {
            transformedRow[pivot] = transformDate(
              row[pivot] as string,
              dateGroupingInterval
            )
          }
        })

        // Apply date transformation to column pivots
        columnPivots.forEach((pivot) => {
          if (
            dateGroupingInterval !== 'none' &&
            headers.includes(pivot) &&
            isDateField(pivot)
          ) {
            transformedRow[pivot] = transformDate(
              row[pivot] as string,
              dateGroupingInterval
            )
          }
        })

        return transformedRow
      })

      worker.postMessage({
        data: transformedData,
        rowPivots,
        columnPivots,
        valuePivot,
        aggregation,
      })
      worker.onmessage = (e) => {
        setPivotData(e.data)
        setLoading(false)
      }
    }
  }, [
    worker,
    data,
    rowPivots,
    columnPivots,
    valuePivot,
    aggregation,
    dateGroupingInterval,
  ])

  // Function to determine if a field is a date field
  const isDateField = (field: string) => {
    // A simple check for fields that contain 'DT' or common date patterns
    return field.includes('DT') || field.toLowerCase().includes('date')
  }

  // Determine if date grouping should be enabled
  const enableDateGrouping = useMemo(() => {
    return rowPivots.some(isDateField) || columnPivots.some(isDateField)
  }, [rowPivots, columnPivots])

  const uniqueColumnValues = useMemo(() => {
    const uniqueValues = new Set<string>()
    data.forEach((row) => {
      const columnKey = columnPivots
        .map((pivot) => {
          if (isDateField(pivot) && dateGroupingInterval !== 'none') {
            return transformDate(row[pivot] as string, dateGroupingInterval)
          }
          return row[pivot]
        })
        .join(' / ')
      uniqueValues.add(columnKey)
    })
    return Array.from(uniqueValues)
  }, [data, columnPivots, dateGroupingInterval])

  const uniqueRowKeys = useMemo(() => {
    const uniqueKeys = new Set<string>()
    data.forEach((row) => {
      const rowKey = rowPivots
        .map((pivot) => {
          if (isDateField(pivot) && dateGroupingInterval !== 'none') {
            return transformDate(row[pivot] as string, dateGroupingInterval)
          }
          return row[pivot]
        })
        .join(' / ')
      uniqueKeys.add(rowKey)
    })
    return Array.from(uniqueKeys)
  }, [data, rowPivots, dateGroupingInterval])

  // Check if the selected value column is numeric
  const isValueColumnNumeric = useMemo(() => {
    return data.every((row) => {
      let rawValue = row[valuePivot]

      // Handle "-" or undefined as 0
      if (rawValue === '-' || rawValue === undefined || rawValue === null) {
        rawValue = '0'
      }

      const value = parseFloat(rawValue as string)
      return !isNaN(value)
    })
  }, [data, valuePivot])

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Pivot Table
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Rows</InputLabel>
            <Select
              multiple
              value={rowPivots}
              onChange={(e) => {
                setLoading(true)
                setRowPivots(e.target.value as string[])
              }}
              label='Rows'
            >
              {headers.map((header) => (
                <MenuItem key={header} value={header}>
                  {header}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Columns</InputLabel>
            <Select
              multiple
              value={columnPivots}
              onChange={(e) => {
                setLoading(true)
                setColumnPivots(e.target.value as string[])
              }}
              label='Columns'
            >
              {headers.map((header) => (
                <MenuItem key={header} value={header}>
                  {header}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Value</InputLabel>
            <Select
              value={valuePivot}
              onChange={(e) => setValuePivot(e.target.value as string)}
              label='Value'
            >
              <MenuItem value='Power units'>Power Units</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Aggregation</InputLabel>
            <Select
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as string)}
              label='Aggregation'
              disabled={!isValueColumnNumeric}
            >
              <MenuItem value='sum'>Sum</MenuItem>
              <MenuItem value='count'>Count</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {enableDateGrouping && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel>Date Grouping Interval</InputLabel>
              <Select
                value={dateGroupingInterval}
                onChange={(e) => {
                  setLoading(true)
                  setDateGroupingInterval(e.target.value as string)
                }}
                label='Date Grouping Interval'
              >
                <MenuItem value='none'>None</MenuItem>
                <MenuItem value='year'>Year</MenuItem>
                <MenuItem value='month'>Month</MenuItem>
                <MenuItem value='week'>Week</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      {!isValueColumnNumeric && aggregation === 'sum' ? (
        <Typography color='error' sx={{ mb: 2 }}>
          The selected value column contains non-numeric data, which cannot be
          summed. Please select a numeric column or use "Count" as the
          aggregation method.
        </Typography>
      ) : loading ? (
        <div className='loader-wrapper'>
          <div className='loader'></div>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          style={{ maxHeight: 600, overflowX: 'auto' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 2,
                  }}
                >
                  {rowPivots.join(' / ')}
                </TableCell>
                {uniqueColumnValues.map((colValue) => (
                  <TableCell
                    key={colValue}
                    align='right'
                    style={{
                      top: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                    }}
                  >
                    {colValue}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {uniqueRowKeys.map((rowKey) => (
                <TableRow key={rowKey}>
                  <TableCell
                    style={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#f4f4f4',
                      zIndex: 1,
                    }}
                  >
                    {rowKey}
                  </TableCell>
                  {uniqueColumnValues.map((colValue) => (
                    <TableCell key={colValue} align='right'>
                      {pivotData[rowKey]?.[colValue] || 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default PivotTable
