import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { FilterSectionProps } from '../interfaces/row.type'

const FilterSection: React.FC<FilterSectionProps> = ({
  headers,
  filters,
  onFilterChange,
  onClearFilters,
  onSearchChange,
  searchQuery,
}) => {
  const handleDeleteFilter = (header: string) => {
    onFilterChange(header, '')
  }

  return (
    <Box>
      {/* Selected Filters as Chips */}
      <Box sx={{ mb: 2 }}>
        {Object.keys(filters).map((key) =>
          filters[key] ? (
            <Chip
              key={key}
              label={`${key}: ${filters[key]}`}
              onDelete={() => handleDeleteFilter(key)}
              sx={{ marginRight: 1, marginBottom: 1 }}
            />
          ) : null
        )}
      </Box>

      {/* Filter Accordion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Filter Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems='flex-end'>
            {headers.map(
              (header) =>
                header !== 'ID' && (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={header}>
                    <Typography sx={{ fontWeight: 500 }}>{header}</Typography>
                    {header === 'Entity' ||
                    header === 'Operating status' ||
                    header === 'Record Status' ? (
                      <FormControl
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                      >
                        <Select
                          value={filters[header] || ''}
                          onChange={(e) =>
                            onFilterChange(header, e.target.value)
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
                            <MenuItem
                              key='not-authorized'
                              value='Not Authorized'
                            >
                              Not Authorized
                            </MenuItem>,
                          ]}
                          {header === 'Record Status' && [
                            <MenuItem key='active' value='active'>
                              Active
                            </MenuItem>,
                            <MenuItem key='inactive' value='inactive'>
                              Inactive
                            </MenuItem>,
                          ]}
                        </Select>
                      </FormControl>
                    ) : header === 'Created_DT' ||
                      header === 'Out Of Service Date' ||
                      header === 'Modified_DT' ||
                      header === 'MCS-150 Form Date' ? (
                      <TextField
                        type='date'
                        variant='outlined'
                        value={filters[header] || ''}
                        onChange={(e) => onFilterChange(header, e.target.value)}
                        placeholder={`Filter ${header}`}
                        sx={{ width: '100%' }}
                        InputLabelProps={{ shrink: true }}
                      />
                    ) : header === 'Power units' ||
                      header === 'Drivers' ||
                      header === 'Credit Score' ? (
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
                )
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Search and Clear Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant='outlined' color='secondary' onClick={onClearFilters}>
          Clear All Filters
        </Button>
        <TextField
          variant='outlined'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search...'
          InputProps={{
            endAdornment: (
              <IconButton edge='end'>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  )
}

export default FilterSection
