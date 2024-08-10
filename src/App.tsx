import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import FmscaTable from './components/Fmsca';
import { CsvRow } from './interfaces/row.type';
import { Row } from './types/Row';

const App: React.FC = () => {
  const [data, setData] = useState<CsvRow[]>([]);
  const [originalData, setOriginalData] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [message, setMessage] = useState('');
  const [queryData, setQueryData] = useState<Record<string, any>>({});

  // Set loader visibility
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch CSV data
  const fetchCsv = async (): Promise<string> => {
    const response = await fetch('/FMSCA.csv');
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (!reader) throw new Error('No reader available');

    const result = await reader.read();
    return decoder.decode(result.value);
  };

  // Process CSV data
  const processCsvData = async (csvData: string) => {
    const results = Papa.parse(csvData, { header: true }) as { data: Row[] };
    const filteredData: CsvRow[] = results.data.map((row, index) => ({
      id: index + 1,
      Created_DT: dayjs(row.created_dt).format('YYYY-MM-DD'),
      Modified_DT: dayjs(row.data_source_modified_dt).format('YYYY-MM-DD') || '-',
      Entity: row.entity_type || '-',
      ['Operating status']: row['operating_status'] || '-',
      ['Legal name']: row['legal_name'] || '-',
      ['DBA name']: row['dba_name'] || '-',
      ['Physical address']: row['physical_address'] || '-',
      Phone: row.phone || '-',
      DOT: row.usdot_number || '-',
      ['MC/MX/FF']: row['mc_mx_ff_number'] || '-',
      ['Power units']: row['power_units'] || '-',
      ['Out Of Service Date']: row['out_of_service_date'] || '-',
    }));

    setOriginalData(filteredData);
    setData(filteredData);
    setLoading(false);
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const csvData = await fetchCsv();
        await processCsvData(csvData);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Parse query parameters
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const parsedData: Record<string, any> = {};

    query.forEach((value, key) => {
      const [id, field] = key.split('[').map(part => part.replace(']', ''));
      if (!parsedData[id]) parsedData[id] = {};
      parsedData[id][field] = value;
    });

    setQueryData(parsedData);
  }, []);

  // Apply query parameters to data
  useEffect(() => {
    const updatedData = originalData.map(row => ({
      ...row,
      //@ts-ignore
      ...(queryData[row.id] || {})
    }));

    setData(updatedData);
  }, [queryData, originalData]);


  console.log(queryData)
  // Handle share button click
  const handleShareClick = () => {
    const params = new URLSearchParams();
    Object.keys(queryData).forEach(id => {
      const entry = queryData[id];
      Object.keys(entry).forEach(key => {
        params.append(`${id}[${key}]`, entry[key]);
      });
    });

    const link = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(link).then(() => {
      setMessage('Link Copied');
      setTimeout(() => setMessage(''), 2000);
    });
  };

  
  const handleReset = () => {
    setQueryData({});
    setData(originalData);
  };

  return (
    <div className='App'>
      <Container>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            Motor Carrier Safety Administration
          </Typography>
          <Box mb={2}>
            <Button
              variant="outlined"
              onClick={handleShareClick}
              sx={{ mr: 2 }}
            >
              {message || 'Share'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Box>
          {showLoader || loading ? (
            <Box className='loader-wrapper'>
              <div className='loader'></div>
            </Box>
          ) : (
            <FmscaTable data={data} setQueryData={setQueryData} queryData={queryData} />
          )}
        </Box>
      </Container>
    </div>
  );
};

export default App;
