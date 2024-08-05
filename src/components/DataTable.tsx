import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import React from 'react'
import { DataTableProps } from '../interfaces/row.type'
import theme from '../theme/theme'
import {
  NoDataContainer,
  StyledTableContainer,
  StyledTableRow,
} from './StyledComponents'

const DataTable: React.FC<DataTableProps> = ({
  headers,
  filteredData,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}) => {
  return (
    <>
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
                  <StyledTableRow key={index} onClick={() => onRowClick(row)}>
                    {headers.map((header) => (
                      <TableCell key={header}>
                        {
                          // @ts-ignore
                          row[header] || '-'
                        }
                      </TableCell>
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
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  )
}

export default DataTable
