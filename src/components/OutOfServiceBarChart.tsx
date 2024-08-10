import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { CsvRow } from '../interfaces/row.type';
import { useTheme } from '@mui/material/styles';

interface BarChartProps {
    data: CsvRow[];
}

const OutOfServiceBarChart: React.FC<BarChartProps> = ({ data }) => {
    const theme = useTheme();
    const processData = () => {
        const monthlyCounts: { [key: string]: number } = {};

        data.forEach(item => {
            const date = new Date(item['Out Of Service Date']);
            if (!isNaN(date.getTime())) {
                const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (monthlyCounts[month]) {
                    monthlyCounts[month]++;
                } else {
                    monthlyCounts[month] = 1;
                }
            }
        });

        return Object.keys(monthlyCounts).map(month => ({
            month,
            count: monthlyCounts[month],
        }));
    };

    const chartData = processData();

    return (
        <>
            <div>
                <h1 className='viewer'>Companies that went Out of Service Chart</h1>
            </div>
            <div style={{ width: '100%', padding: '20px' }}>
                <BarChart
                    width={1000}
                    height={400}
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: theme.palette.text.primary }}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 12, fill: theme.palette.text.primary }} />
                    <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                    <Legend />
                    <Bar
                        dataKey="count"
                        fill={theme.palette.primary.main}
                        barSize={40}
                        radius={[5, 5, 0, 0]}
                    />
                </BarChart>
            </div>
        </>
    );
};

export default OutOfServiceBarChart;
