import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React, { useState } from 'react'
import { CsvRow } from '../interfaces/row.type'
import theme from '../theme/theme'
import DataDetailsModal from './DataDetailsModal'
import {
  FilterContainer,
  NoDataContainer,
  StyledTableContainer,
  StyledTableRow,
} from './StyledComponents'

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

  const filteredData = data.filter((row) =>
    Object.keys(filters).every((key) => {
      const filterValue = filters[key]
      if (!filterValue) return true
      // @ts-expect-error
      const cellValue = row[key as Partial<CsvRow>]?.toString().toLowerCase()
      return cellValue.includes(filterValue.toLowerCase())
    })
  )

  const headers = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <ThemeProvider theme={theme}>
      <Box p={2} sx={{ background: '#FFFFFF' }}>
        <FilterContainer sx={{ marginBottom: '10px' }}>
          <Grid container spacing={2}>
            {headers.map((header) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={header}>
                <Typography sx={{ fontWeight: 500 }}>{header}</Typography>
                {header === 'Entity' || header === 'Operating status' ? (
                  <FormControl
                    variant='standard'
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                      },
                    }}
                  >
                    <Select
                      value={filters[header] || ''}
                      onChange={(e) =>
                        handleFilterChange(header, e.target.value)
                      }
                      displayEmpty
                      variant='outlined'
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      {header === 'Entity' && [
                        <MenuItem key='carrier' value='CARRIER'>
                          CARRIER
                        </MenuItem>,
                        <MenuItem key='broker' value='BROKER'>
                          BROKER
                        </MenuItem>,
                      ]}
                      {header === 'Operating status' && [
                        <MenuItem key='authorized' value='Authorized'>
                          Authorized
                        </MenuItem>,
                        <MenuItem key='not-authorized' value='Not Authorized'>
                          Not Authorized
                        </MenuItem>,
                      ]}
                    </Select>
                  </FormControl>
                ) : header === 'Created_DT' ||
                  header === 'Out Of Service Date' ||
                  header === 'Modified_DT' ? (
                  <TextField
                    type='date'
                    variant='outlined'
                    value={filters[header] || ''}
                    onChange={(e) => handleFilterChange(header, e.target.value)}
                    placeholder={`Filter ${header}`}
                    sx={{ width: '100%' }}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : header === 'Power units' ? (
                  <TextField
                    type='number'
                    variant='outlined'
                    value={filters[header] || ''}
                    onChange={(e) => handleFilterChange(header, e.target.value)}
                    placeholder={`Filter ${header}`}
                    sx={{ width: '100%' }}
                  />
                ) : (
                  <TextField
                    variant='outlined'
                    value={filters[header] || ''}
                    onChange={(e) => handleFilterChange(header, e.target.value)}
                    placeholder={`Filter ${header}`}
                    sx={{ width: '100%' }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </FilterContainer>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>
                    <TableSortLabel>{header}</TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length}>
                    <NoDataContainer>
                      <InfoOutlinedIcon
                        sx={{
                          fontSize: 40,
                          color: theme.palette.text.disabled,
                        }}
                      />
                      <Typography sx={{ mt: 1 }}>No Data Found</Typography>
                    </NoDataContainer>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <StyledTableRow
                      key={index}
                      onClick={() => handleRowClick(row)}
                    >
                      {headers.map((header) => (
                        // @ts-ignore
                        <TableCell key={header}>{row[header] || '-'}</TableCell>
                      ))}
                    </StyledTableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
