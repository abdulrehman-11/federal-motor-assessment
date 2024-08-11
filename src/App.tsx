import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import Papa from 'papaparse'
import React, { useEffect, useState } from 'react'
import FmscaTable from './components/Fmsca'
import { CsvRow } from './interfaces/row.type'
import { Row } from './types/Row'

const App: React.FC = () => {
  const [data, setData] = useState<CsvRow[]>([])
  const [originalData, setOriginalData] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)
  const [message, setMessage] = useState('')
  const [queryData, setQueryData] = useState<Record<string, any>>({})

  // Set loader visibility
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Fetch CSV data
  const fetchCsv = async (): Promise<string> => {
    const response = await fetch('/FMSCA.csv')
    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if (!reader) throw new Error('No reader available')

    const result = await reader.read()
    return decoder.decode(result.value)
  }

  // Process CSV data
  const processCsvData = async (csvData: string) => {
    const results = Papa.parse(csvData, { header: true }) as { data: Row[] }

    const filteredData: CsvRow[] = results.data.map((row, index) => ({
      id: index + 1,
      Created_DT: dayjs(row.created_dt).isValid()
        ? dayjs(row.created_dt).format('YYYY-MM-DD')
        : '-',
      Modified_DT: dayjs(row.data_source_modified_dt).isValid()
        ? dayjs(row.data_source_modified_dt).format('YYYY-MM-DD')
        : '-',
      Entity: row.entity_type || '-',
      ['Operating status']: row.operating_status || '-',
      ['Legal name']: row.legal_name || '-',
      ['DBA name']: row.dba_name || '-',
      ['Physical address']: row.physical_address || '-',
      ['Street']: row.p_street || '-',
      ['City']: row.p_city || '-',
      ['State']: row.p_state || '-',
      ['Zip']: row.p_zip_code || '-',
      Phone: row.phone || '-',
      DOT: row.usdot_number || '-',
      ['MC/MX/FF']: row.mc_mx_ff_number || '-',
      ['Power units']: row.power_units ? parseInt(row.power_units, 10) : '-',
      ['MCS-150 Form Date']: dayjs(row.mcs_150_form_date).isValid()
        ? dayjs(row.mcs_150_form_date).format('YYYY-MM-DD')
        : '-',
      ['Out Of Service Date']: dayjs(row.out_of_service_date).isValid()
        ? dayjs(row.out_of_service_date).format('YYYY-MM-DD')
        : '-',
      ['State Carrier ID Number']: row.state_carrier_id_number || '-',
      ['DUNS Number']: row.duns_number || '-',
      Drivers: row.drivers ? parseInt(row.drivers, 10) : '-',
      ['MCS-150 Mileage Year']: row.mcs_150_mileage_year || '-',
      ['Credit Score']: row.credit_score || '-',
      ['Record Status']: row.record_status || '-',
    }))

    setOriginalData(filteredData)
    setData(filteredData)
    setLoading(false)
  }

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const csvData = await fetchCsv()
        await processCsvData(csvData)
      } catch (error) {
        console.error('Error fetching CSV data:', error)
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const parsedData: Record<string, any> = {}

    query.forEach((value, key) => {
      const [id, field] = key.split('[').map((part) => part.replace(']', ''))
      if (!parsedData[id]) parsedData[id] = {}
      parsedData[id][field] = value
    })

    if (Object.keys(parsedData).length > 0) {
      // If there are query parameters, save them to localStorage
      localStorage.setItem('queryData', JSON.stringify(parsedData))
    }

    setQueryData(parsedData)
  }, [])

  // Apply query parameters to data
  useEffect(() => {
    const updatedData = originalData.map((row) => ({
      ...row,
      //@ts-ignore
      ...(queryData[row.id] || {}),
    }))

    setData(updatedData)
  }, [queryData, originalData])

  console.log(queryData)
  // Handle share button click
  const handleShareClick = () => {
    if (!Object.keys(queryData).length) {
      setMessage('No filters applied to share')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    const params = new URLSearchParams()

    Object.entries(queryData).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value !== null) {
        // If the value is an object, iterate over its keys
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null && subValue !== '') {
            params.append(subKey, String(subValue))
          }
        })
      } else if (value !== undefined && value !== null && value !== '') {
        // If the value is not an object, directly append it
        params.append(key, String(value))
      }
    })

    const link = `${window.location.origin}${
      window.location.pathname
    }?${params.toString()}`
    console.log({ link })

    navigator.clipboard.writeText(link).then(() => {
      setMessage('Link Copied')
      setTimeout(() => setMessage(''), 2000)
    })
  }

  return (
    <div className='App'>
      <Container>
        <Box p={2}>
          <Typography variant='h4' gutterBottom>
            Motor Carrier Safety Administration
          </Typography>
          <Box mb={2}>
            <Button
              variant='outlined'
              onClick={handleShareClick}
              sx={{ mr: 2 }}
            >
              {message || 'Share Link'}
            </Button>
          </Box>
          {showLoader || loading ? (
            <Box className='loader-wrapper'>
              <div className='loader'></div>
            </Box>
          ) : (
            <FmscaTable
              data={data}
              setQueryData={setQueryData}
              queryData={queryData}
            />
          )}
        </Box>
      </Container>
    </div>
  )
}

export default App
