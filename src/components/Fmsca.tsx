import React, { useMemo, useState } from 'react';
import { Box, Button, ThemeProvider } from '@mui/material';
import { CsvRow, QueryData } from '../interfaces/row.type';
import theme from '../theme/theme';
import DataTable from './DataTable';
import FilterSection from './FilterSection';
import PivotTable from './PivotTable';
import { FilterContainer } from './StyledComponents';

interface FmscaProps {
  data: CsvRow[];
  setQueryData: (data: QueryData) => void;
  queryData: QueryData;
}

const Fmsca: React.FC<FmscaProps> = ({ data: initialData, setQueryData ,queryData}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    Created_DT: '',
    Modified_DT: '',
    Entity: '',
    'Operating status': '',
    'Power units': '',
  });
  const [view, setView] = useState<'table' | 'pivot'>('table');
  const [editableCell, setEditableCell] = useState<{ rowIndex: number; header: string } | null>(null);

  const headers = useMemo(() => initialData.length > 0 ? Object.keys(initialData[0]) : [], [initialData]);

  const filteredData = useMemo(() => {
    return initialData
      .filter((row) =>
        Object.keys(filters).every((key) => {
          const filterValue = filters[key];
          if (!filterValue) return true;
          const cellValue = row[key as keyof CsvRow]?.toString().toLowerCase();
          return cellValue?.includes(filterValue.toLowerCase());
        })
      )
      .filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
  }, [initialData, filters, searchQuery]);

  const handleFilterChange = (header: string, value: string) => {
    setFilters((prev) => ({ ...prev, [header]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      Created_DT: '',
      Modified_DT: '',
      Entity: '',
      'Operating status': '',
      'Power units': '',
    });
    setSearchQuery('');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFinishEditing = () => {
    setEditableCell(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p={2} sx={{ background: '#FFFFFF' }}>
        <FilterContainer sx={{ marginBottom: '10px' }}>
          <FilterSection
            headers={headers}
            filters={filters}
            searchQuery={searchQuery}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSearchChange={handleSearchChange}
          />
        </FilterContainer>
        <Button
          variant='outlined'
          sx={{ mb: 2 }}
          onClick={() => setView((prev) => (prev === 'table' ? 'pivot' : 'table'))}
        >
          Switch to {view === 'table' ? 'Pivot Table' : 'Data Table'}
        </Button>
        {view === 'table' ? (
          <DataTable
            headers={headers}
            filteredData={filteredData}
            editableCell={editableCell}
            onFinishEditing={handleFinishEditing}
            setQueryData={setQueryData}
            queryData={queryData}
          />
        ) : (
          <PivotTable data={filteredData} headers={headers} />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Fmsca;
