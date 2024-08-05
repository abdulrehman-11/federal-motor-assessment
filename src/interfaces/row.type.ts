export interface RawCsvRow {
  created_dt: string
  data_source_modified_dt: string
  entity_type: string
  operating_status: string
  legal_name: string
  dba_name: string
  physical_address: string
  phone: string
  usdot_number: string
  mc_mx_ff_number: string
  power_units: string
  out_of_service_date: string
}

interface RowData {
  [key: string]: string | number | null | undefined
}

export interface DataDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  rowData: RowData; 
}

export interface CsvRow {
  [key: string]: string | number | null | undefined 
  Created_DT: string
  Modified_DT: string
  Entity: string
  'Operating status': string
  'Legal name': string
  'DBA name': string
  'Physical address': string
  Phone: string
  DOT: string
  'MC/MX/FF': string
  'Power units': string
  'Out Of Service Date': string
}
