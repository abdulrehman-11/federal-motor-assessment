import { Box } from '@mui/material'
import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { transformDate, transformRowData } from '../common/utils'
import { CsvRow } from '../interfaces/row.type'

interface PivotGraphProps {
  data: CsvRow[]
  headers: string[]
  rowPivots: string[]
  columnPivots: string[]
  valuePivot: string
  dateGroupingInterval: string
}

const PivotChart: React.FC<PivotGraphProps> = ({
  data,
  headers,
  rowPivots,
  columnPivots,
  valuePivot,
  dateGroupingInterval,
}) => {
  const transformedData = data.map((row) =>
    transformRowData(
      row,
      rowPivots,
      columnPivots,
      headers,
      dateGroupingInterval,
      transformDate,
      isDateField
    )
  )

  const graphData = transformedData.map((row) => {
    const key = rowPivots.map((pivot) => row[pivot as keyof CsvRow]).join(' / ')
    const value = parseFloat(row[valuePivot as keyof CsvRow] as string) || 0

    return {
      name: key,
      [valuePivot]: value,
    }
  })

  return (
    <Box>
      <h1 className='viewer'>Pivot Graph</h1>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey={valuePivot}
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

const isDateField = (field: string) => {
  return field.includes('DT') || field.toLowerCase().includes('date')
}

export default PivotChart
