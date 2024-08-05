import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 750,
          position: "relative",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          marginTop: "0px !important",
          maxWidth: "90vw",
          margin: "0 auto",
          minHeight: "80vh !important",
          maxHeight: "80vh !important",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        .MuiBox-root {
          padding: 0 4px;
        }
      `,
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e0e0e0",
          padding: "10px",
          paddingLeft: "10px",
          minWidth: "150px",
          textAlign: "center",
        },
        head: {
          backgroundColor: "#f5f5f5",
          color: "#333",
          fontWeight: "bold",
          position: "sticky",
          top: 0,
          zIndex: 10,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: "2px solid #5a5c5a",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          //   display: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        icon: {
          display: "none",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "8px 6px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root .MuiInputBase-input": {
            padding: "8px 6px",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            border: "1px solid rgba(0, 0, 0, 0.23)",
          },
        },
      },
    },
  },
});

export default theme;
