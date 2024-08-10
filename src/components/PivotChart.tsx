import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';
import { CsvRow } from '../interfaces/row.type';
import { format, isValid, parse } from 'date-fns';

interface PivotGraphProps {
    data: CsvRow[];
    headers: string[];
    rowPivots: string[];
    columnPivots: string[];
    valuePivot: string;
    dateGroupingInterval: string;
}

const transformDate = (dateStr: string, interval: string) => {
    const expectedFormat = 'M/d/yyyy';
    const date = parse(dateStr, expectedFormat, new Date());

    if (!isValid(date)) {
        console.error(`Invalid date detected: ${dateStr}`);
        return 'Invalid Date';
    }

    switch (interval) {
        case 'year':
            return format(date, 'yyyy');
        case 'month':
            return format(date, 'yyyy-MM');
        case 'week':
            return format(date, 'yyyy-wo');
        default:
            return dateStr;
    }
};

const PivotChart: React.FC<PivotGraphProps> = ({
    data,
    headers,
    rowPivots,
    columnPivots,
    valuePivot,
    dateGroupingInterval,
}) => {
    const transformedData = data.map((row) => {
        const transformedRow = { ...row };

        rowPivots.forEach((pivot) => {
            if (
                dateGroupingInterval !== 'none' &&
                headers.includes(pivot) &&
                isDateField(pivot)
            ) {
                transformedRow[pivot] = transformDate(
                    row[pivot] as string,
                    dateGroupingInterval
                );
            }
        });

        columnPivots.forEach((pivot) => {
            if (
                dateGroupingInterval !== 'none' &&
                headers.includes(pivot) &&
                isDateField(pivot)
            ) {
                transformedRow[pivot] = transformDate(
                    row[pivot] as string,
                    dateGroupingInterval
                );
            }
        });

        return transformedRow;
    });

    const graphData = transformedData.map((row) => {
        const key = rowPivots.map((pivot) => row[pivot]).join(' / ');
        const value = parseFloat(row[valuePivot] as string) || 0;

        return {
            name: key,
            [valuePivot]: value,
        };
    });

    return (
        <Box>
            <h1 className='viewer'>
                Pivot Graph
            </h1>
            <ResponsiveContainer width='100%' height={400}>
                <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type='monotone'
                        dataKey={valuePivot}
                        stroke='#8884d8'
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

const isDateField = (field: string) => {
    return field.includes('DT') || field.toLowerCase().includes('date');
};

export default PivotChart;
