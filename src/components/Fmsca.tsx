import { Box, FormControlLabel, Switch, ThemeProvider } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { CsvRow, QueryData } from '../interfaces/row.type'
import theme from '../theme/theme'
import DataTable from './DataTable'
import FilterSection from './FilterSection'
import PivotTable from './PivotTable'
import { FilterContainer } from './StyledComponents'

interface FmscaProps {
  data: CsvRow[]
  setQueryData: (data: QueryData) => void
  queryData: QueryData
}

const Fmsca: React.FC<FmscaProps> = ({
  data: initialData,
  setQueryData,
  queryData,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const [view, setView] = useState<'table' | 'pivot'>('table')
  const [editableCell, setEditableCell] = useState<{
    rowIndex: number
    header: string
  } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialFilters: { [key: string]: string } = {}
    let initialSearchQuery = ''

    params.forEach((value, key) => {
      if (key === 'search') {
        initialSearchQuery = value
      } else {
        initialFilters[key] = value
      }
    })

    setFilters(initialFilters)
    setSearchQuery(initialSearchQuery)

    if (!params.toString()) {
      const storedFilters = JSON.parse(
        localStorage.getItem('queryData') || '{}'
      )
      setFilters(storedFilters.filters || {})
      setSearchQuery(storedFilters.searchQuery || '')
    }
  }, [])

  const headers = useMemo(
    () => (initialData.length > 0 ? Object.keys(initialData[0]) : []),
    [initialData]
  )

  const filteredData = useMemo(() => {
    return initialData
      .filter((row) =>
        Object.keys(filters).every((key) => {
          const filterValue = filters[key]
          if (!filterValue) return true
          const cellValue = row[key as keyof CsvRow]?.toString().toLowerCase()
          return cellValue?.includes(filterValue.toLowerCase())
        })
      )
      .filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
  }, [initialData, filters, searchQuery])

  const updateQueryData = (
    newFilters: { [key: string]: string },
    newSearchQuery: string
  ) => {
    const updatedQueryData: Record<string, any> = {
      ...newFilters,
      searchQuery: newSearchQuery,
    }

    setQueryData(updatedQueryData)
    localStorage.setItem('queryData', JSON.stringify(updatedQueryData))

    const params = new URLSearchParams()
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params.append(key, newFilters[key])
    })
    if (newSearchQuery) params.append('search', newSearchQuery)

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    )
  }

  const handleFilterChange = (header: string, value: string) => {
    const newFilters = { ...filters, [header]: value }
    setFilters(newFilters)
    updateQueryData(newFilters, searchQuery)
  }

  const handleClearFilters = () => {
    const clearedFilters = headers.reduce((acc, header) => {
      acc[header] = ''
      return acc
    }, {} as { [key: string]: string })
    setFilters(clearedFilters)
    setSearchQuery('')
    updateQueryData(clearedFilters, '')
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    updateQueryData(filters, query)
  }

  const handleFinishEditing = () => {
    setEditableCell(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box p={2} sx={{ background: '#FFFFFF' }}>
        <FilterContainer sx={{ marginBottom: '10px' }}>
          <FilterSection
            headers={headers}
            filters={filters}
            searchQuery={searchQuery}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSearchChange={handleSearchChange}
          />
        </FilterContainer>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={view === 'pivot'}
                onChange={() =>
                  setView((prev) => (prev === 'table' ? 'pivot' : 'table'))
                }
                color='primary'
              />
            }
            label={
              view === 'table'
                ? 'Switch to Pivot Table'
                : 'Switch to Data Table'
            }
            labelPlacement='start'
          />
        </Box>

        {view === 'table' ? (
          <DataTable
            headers={headers}
            filteredData={filteredData}
            editableCell={editableCell}
            onFinishEditing={handleFinishEditing}
            setQueryData={setQueryData}
            queryData={queryData}
          />
        ) : (
          <PivotTable data={filteredData} headers={headers} />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Fmsca
