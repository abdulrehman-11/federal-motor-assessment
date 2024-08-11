import { Box, Paper, Typography, useTheme } from '@mui/material'
import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CsvRow } from '../interfaces/row.type'

interface BarChartProps {
  data: CsvRow[]
}

const OutOfServiceBarChart: React.FC<BarChartProps> = ({ data }) => {
  const theme = useTheme()

  const processData = () => {
    const monthlyCounts: { [key: string]: number } = {}

    data.forEach((item) => {
      const date = new Date(item['Out Of Service Date'])
      if (!isNaN(date.getTime())) {
        const month = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`
        if (monthlyCounts[month]) {
          monthlyCounts[month]++
        } else {
          monthlyCounts[month] = 1
        }
      }
    })

    return Object.keys(monthlyCounts).map((month) => ({
      month,
      count: monthlyCounts[month],
    }))
  }

  const chartData = processData()

  return (
    <Paper
      elevation={3}
      sx={{ padding: theme.spacing(3), marginTop: theme.spacing(4) }}
    >
      <Typography
        variant='h6'
        align='center'
        gutterBottom
        sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
      >
        Companies that went Out of Service per Month
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey='month'
              tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              angle={-45}
              textAnchor='end'
            />
            <YAxis tick={{ fontSize: 12, fill: theme.palette.text.primary }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              cursor={{ fill: theme.palette.action.hover }}
            />
            <Legend verticalAlign='top' height={36} />
            <Bar
              dataKey='count'
              fill={theme.palette.primary.main}
              barSize={40}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}

export default OutOfServiceBarChart
