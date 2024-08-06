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
import React, { useEffect, useMemo, useState } from 'react'
import { CsvRow } from '../interfaces/row.type'

interface PivotTableProps {
  data: CsvRow[]
  headers: string[]
}

const PivotTable: React.FC<PivotTableProps> = ({ data, headers }) => {
  const [rowPivot, setRowPivot] = useState<string>('Entity')
  const [columnPivot, setColumnPivot] = useState<string>('Operating status')
  const [valuePivot, setValuePivot] = useState<string>('Power units')
  const [aggregation, setAggregation] = useState<string>('sum')
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
      worker.postMessage({
        data,
        rowPivot,
        columnPivot,
        valuePivot,
        aggregation,
      })
      worker.onmessage = (e) => {
        setPivotData(e.data)
        setLoading(false)
      }
    }
  }, [worker, data, rowPivot, columnPivot, valuePivot, aggregation])

  const uniqueColumnValues = useMemo(() => {
    const uniqueValues = new Set<string>()
    data.forEach((row) => {
      uniqueValues.add(row[columnPivot] as string)
    })
    return Array.from(uniqueValues)
  }, [data, columnPivot])

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
            <InputLabel>Row</InputLabel>
            <Select
              value={rowPivot}
              onChange={(e) => {
                setLoading(true)
                setRowPivot(e.target.value as string)
              }}
              label='Row'
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
            <InputLabel>Column</InputLabel>
            <Select
              value={columnPivot}
              onChange={(e) => {
                setLoading(true)
                setColumnPivot(e.target.value as string)
              }}
              label='Column'
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
                  {rowPivot}
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
              {Object.entries(pivotData).map(([rowKey, columns]) => (
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
                      {columns[colValue] || 0}
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
