import { Box, Button } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React, { useMemo, useState } from 'react'
import { CsvRow } from '../interfaces/row.type'
import theme from '../theme/theme'
import DataDetailsModal from './DataDetailsModal'
import DataTable from './DataTable'
import FilterSection from './FilterSection'
import PivotTable from './PivotTable'
import { FilterContainer } from './StyledComponents'

const Fmsca: React.FC<{ data: CsvRow[] }> = ({ data }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedRowData, setSelectedRowData] = useState<CsvRow | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    Created_DT: '',
    Modified_DT: '',
    Entity: '',
    'Operating status': '',
    'Power units': '',
  })
  const [view, setView] = useState<'table' | 'pivot'>('table')

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleRowClick = (rowData: CsvRow) => {
    setSelectedRowData(rowData)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleFilterChange = (header: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [header]: value,
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      Created_DT: '',
      Modified_DT: '',
      Entity: '',
      'Operating status': '',
      'Power units': '',
    })
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : []

  // Memoize the filtered data to avoid unnecessary recalculations
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.keys(filters).every((key) => {
        const filterValue = filters[key]
        if (!filterValue) return true
        // @ts-expect-error
        const cellValue = row[key as Partial<CsvRow>]?.toString().toLowerCase()
        return cellValue.includes(filterValue.toLowerCase())
      })
    )
  }, [data, filters]) // Only recalculate if data or filters change

  return (
    <ThemeProvider theme={theme}>
      <Box p={2} sx={{ background: '#FFFFFF' }}>
        <FilterContainer sx={{ marginBottom: '10px' }}>
          <FilterSection
            headers={headers}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </FilterContainer>
        <Button
          variant='outlined'
          sx={{ mb: 2 }}
          onClick={() =>
            setView((prev) => (prev === 'table' ? 'pivot' : 'table'))
          }
        >
          Switch to {view === 'table' ? 'Pivot Table' : 'Data Table'}
        </Button>
        {view === 'table' ? (
          <DataTable
            headers={headers}
            filteredData={filteredData}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onRowClick={handleRowClick}
          />
        ) : (
          <PivotTable data={filteredData} headers={headers} />
        )}
      </Box>
      {/* @ts-ignore */}
      <DataDetailsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        rowData={selectedRowData || {}}
      />
    </ThemeProvider>
  )
}

export default Fmsca
