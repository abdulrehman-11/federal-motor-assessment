import React, { useEffect, useRef, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { DataTableProps, QueryData } from "../interfaces/row.type";
import theme from "../theme/theme";
import { NoDataContainer, StyledTableContainer } from "./StyledComponents";
import OutOfServiceBarChart from "./OutOfServiceBarChart";

const DataTable: React.FC<DataTableProps> = ({
  headers,
  filteredData,
  editableCell,
  onFinishEditing,
  setQueryData
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<GridRowModel[]>(filteredData);
  const [originalValues, setOriginalValues] = useState<Record<string, GridRowModel>>({});

  useEffect(() => {
    // Set the initial values
    const initialValues: Record<string, GridRowModel> = {};
    filteredData.forEach(row => {
      initialValues[row.id as string] = row;
    });
    setOriginalValues(initialValues);
    setRows(filteredData);
  }, [filteredData]);

  const columns: GridColDef[] = headers.map((header) => ({
    field: header,
    headerName: header,
    width: 150,
    editable: true,
    renderCell: (params) => {
      if (
        editableCell?.rowIndex === params.id &&
        editableCell?.header === params.field
      ) {
        return (
          <input
            value={params.value || ""}
            onChange={(e) => handleFieldChange(params.id as string, params.field, e.target.value)}
            onBlur={() => handleFieldBlur(params.id as string, params.field)}
            ref={inputRef}
            style={{ width: '100%' }}
          />
        );
      }
      return params.value || "-";
    },
  }));

  const handleFieldChange = (id: string, field: string, value: string | number) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  
    //@ts-ignore
    setQueryData((prevQueryData: QueryData) => ({
      ...prevQueryData,
      [id]: {
        ...(prevQueryData[id] || {}),
        [field]: value,
      },
    }));
  };
  
  const handleFieldBlur = (id: string, field: string) => {
    const originalRow = originalValues[id];
    if (originalRow) {
      const originalValue = originalRow[field];
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: originalValue } : row
        )
      );
    }
    onFinishEditing();
  };

  const handleProcessRowUpdate = (
    updatedRow: GridRowModel,
    originalRow: GridRowModel
  ): GridRowModel => {
    const updatedFields = Object.keys(updatedRow).reduce<Partial<GridRowModel>>(
      (acc, field) => {
        if (updatedRow[field] !== originalRow[field]) {
          acc[field] = updatedRow[field];
        }
        return acc;
      },
      {}
    );
    
      //@ts-ignore
    setQueryData((prevQueryData) => ({
      ...prevQueryData,
      [updatedRow.id as string]: {
        ...prevQueryData[updatedRow.id as string],
        ...updatedFields,
      },
    }));

    return updatedRow;
  };


  return (
    <>
      <StyledTableContainer>
        <div style={{ height: '400px', width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableColumnFilter
            disableColumnSelector
            disableColumnMenu
            pagination
            processRowUpdate={handleProcessRowUpdate}
          />
        </div>
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
      <Box mt={10}>
        <OutOfServiceBarChart data={filteredData} />
      </Box>
    </>
  );
};

export default DataTable;
