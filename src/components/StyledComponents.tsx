import { Box, Paper, TableContainer, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTableContainer = styled(TableContainer)({
    maxHeight: '600px',
    overflow: 'auto',
    marginTop: '20px',
});

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer',
    },
}));

export const FilterContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

export const NoDataContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(1),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
}));