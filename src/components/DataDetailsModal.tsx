import { Box, Divider, IconButton, Modal, Typography } from '@mui/material'
import React from 'react'
import { IoClose } from 'react-icons/io5'
import { DataDetailsModalProps } from '../interfaces/row.type'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  outline: 'none',
}

const DataDetailsModal: React.FC<DataDetailsModalProps> = ({
  open,
  handleClose,
  rowData,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoClose />
        </IconButton>
        <Typography
          variant='h5'
          component='h2'
          gutterBottom
          sx={{ mb: 2, textAlign: 'center' }}
        >
          USDOT Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {Object.entries(rowData).map(([key, value]) => (
          <Typography key={key} variant='body2' gutterBottom sx={{ mb: 1 }}>
            <strong>{key} :</strong>{' '}
            {value !== null && value !== undefined ? value.toString() : 'N/A'}
          </Typography>
        ))}
      </Box>
    </Modal>
  )
}

export default DataDetailsModal
