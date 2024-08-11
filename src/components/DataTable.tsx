import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid'
import React, { useEffect, useRef, useState } from 'react'
import { DataTableProps, QueryData } from '../interfaces/row.type'
import theme from '../theme/theme'
import OutOfServiceBarChart from './OutOfServiceBarChart'
import { NoDataContainer, StyledTableContainer } from './StyledComponents'

const DataTable: React.FC<DataTableProps> = ({
  headers,
  filteredData,
  editableCell,
  onFinishEditing,
  setQueryData,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<GridRowModel[]>(filteredData)
  const [originalValues, setOriginalValues] = useState<
    Record<string, GridRowModel>
  >({})

  useEffect(() => {
    const initialValues: Record<string, GridRowModel> = {}
    filteredData.forEach((row) => {
      initialValues[row.id as number] = row
    })
    setOriginalValues(initialValues)
    setRows(filteredData)
  }, [filteredData])

  const columns: GridColDef[] = headers.map((header) => ({
    field: header,
    headerName: header,
    width: 150,
    editable: true,
    resizable: true,
    renderCell: (params) => {
      if (
        editableCell?.rowIndex === params.id &&
        editableCell?.header === params.field
      ) {
        return (
          <input
            value={params.value || ''}
            onChange={(e) =>
              handleFieldChange(
                params.id as string,
                params.field,
                e.target.value
              )
            }
            onBlur={() => handleFieldBlur(params.id as string, params.field)}
            ref={inputRef}
            style={{ width: '100%' }}
          />
        )
      }
      return params.value || '-'
    },
  }))

  const handleFieldChange = (
    id: string,
    field: string,
    value: string | number
  ) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    )
    setRows(updatedRows)

    //@ts-ignore
    setQueryData((prevQueryData: QueryData) => ({
      ...prevQueryData,
      [id]: {
        ...(prevQueryData[id] || {}),
        [field]: value,
      },
    }))
  }

  const handleFieldBlur = (id: string, field: string) => {
    const originalRow = originalValues[id]
    if (originalRow) {
      const originalValue = originalRow[field]
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: originalValue } : row
        )
      )
    }
    onFinishEditing()
  }

  const handleProcessRowUpdate = (
    updatedRow: GridRowModel,
    originalRow: GridRowModel
  ): GridRowModel => {
    const updatedFields = Object.keys(updatedRow).reduce<Partial<GridRowModel>>(
      (acc, field) => {
        if (updatedRow[field] !== originalRow[field]) {
          acc[field] = updatedRow[field]
        }
        return acc
      },
      {}
    )

    //@ts-ignore
    setQueryData((prevQueryData) => ({
      ...prevQueryData,
      [updatedRow.id as string]: {
        ...prevQueryData[updatedRow.id as string],
        ...updatedFields,
      },
    }))

    return updatedRow
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
    >
      <StyledTableContainer>
        <Box sx={{ height: '500px', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            disableColumnFilter
            disableColumnSelector
            disableColumnMenu
            processRowUpdate={handleProcessRowUpdate}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.paper,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.default,
              },
            }}
          />
        </Box>
      </StyledTableContainer>

      {rows.length === 0 && (
        <NoDataContainer>
          <InfoOutlinedIcon
            sx={{
              fontSize: 40,
              color: theme.palette.text.disabled,
            }}
          />
          <Typography sx={{ mt: 1 }}>No Data Found</Typography>
        </NoDataContainer>
      )}

      <Box sx={{ mt: 2 }}>
        <OutOfServiceBarChart data={filteredData} />
      </Box>
    </Box>
  )
}

export default DataTable
