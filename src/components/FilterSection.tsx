// components/FilterSection.tsx

import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

interface FilterSectionProps {
  headers: string[]
  filters: { [key: string]: string }
  onFilterChange: (header: string, value: string) => void
  onClearFilters: () => void
}

const FilterSection: React.FC<FilterSectionProps> = ({
  headers,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <Grid container spacing={2} alignItems='flex-end'>
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
                onChange={(e) => onFilterChange(header, e.target.value)}
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
              onChange={(e) => onFilterChange(header, e.target.value)}
              placeholder={`Filter ${header}`}
              sx={{ width: '100%' }}
              InputLabelProps={{ shrink: true }}
            />
          ) : header === 'Power units' ? (
            <TextField
              type='number'
              variant='outlined'
              value={filters[header] || ''}
              onChange={(e) => onFilterChange(header, e.target.value)}
              placeholder={`Filter ${header}`}
              sx={{ width: '100%' }}
            />
          ) : (
            <TextField
              variant='outlined'
              value={filters[header] || ''}
              onChange={(e) => onFilterChange(header, e.target.value)}
              placeholder={`Filter ${header}`}
              sx={{ width: '100%' }}
            />
          )}
        </Grid>
      ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant='outlined' color='secondary' onClick={onClearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default FilterSection
