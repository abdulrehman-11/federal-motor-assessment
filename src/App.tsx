import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FmscaTable from './components/Fmsca';
import { Container } from '@mui/material';
import { CsvRow } from './interfaces/row.type';
import { Row } from './types/Row';

const App: React.FC = () => {
  const [data, setData] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchCsv = async (): Promise<string> => {
    const response = await fetch('/FMSCA.csv');
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (!reader) {
      throw new Error('No reader available');
    }

    const result = await reader.read();
    return decoder.decode(result.value);
  };

  const formatDateString = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const getCsvData = async () => {
    try {
      const csvData = await fetchCsv();
      const results = Papa.parse(csvData, { header: true }) as { data: Row[] };
      const filteredData: CsvRow[] = results.data.map((row) => {
        console.log(row, 'row')
        return ({
          Created_DT: formatDateString(row.created_dt),
          Modified_DT: formatDateString(row.data_source_modified_dt) || "-",
          Entity: row.entity_type || "-",
          ['Operating status']: row['operating_status'] || "-",
          ['Legal name']: row['legal_name'] || "-",
          ['DBA name']: row['dba_name'] || "-",
          ['Physical address']: row['physical_address'] || "-",
          Phone: row.phone || "-",
          DOT: row.usdot_number || "-",
          ['MC/MX/FF']: row['mc_mx_ff_number'] || "-",
          ['Power units']: row['power_units'] || "-",
          ['Out Of Service Date']: row['out_of_service_date'] || "-",
        })
      });
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCsvData();
  }, []);

  return (
    <div className="App">
      <Container>
        <div className="">
          <h1 className="heading">Motor Carrier Safety Administration</h1>
        </div>
        <div className='wrapper'>
          <h1 className='viewer'> FMSCA Viewer</h1>
          {showLoader || loading ? (
            <div className="loader-wrapper">
              <div className="loader"></div>
            </div>
          ) : (
            <FmscaTable data={data} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default App;
