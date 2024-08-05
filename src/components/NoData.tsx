import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import theme from '../theme/theme'
import { NoDataContainer } from './StyledComponents'

interface NoDataProps {
  colSpan: number
}

const NoData: React.FC<NoDataProps> = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
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
  )
}

export default NoData
