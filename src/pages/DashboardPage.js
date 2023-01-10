import React from 'react';
import Chart from 'react-apexcharts';
import { Card, useTheme } from '@mui/material';
// import data from './jsonTest/data.json';
// import sensor from './jsonTest/sensor.json';

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      <h1>Home Page</h1>
      <Card sx={{ p: 3 }}>
        <Chart
          options={{
            chart: {
              id: 'basic-bar',
              foreColor: isDark ? '#fff' : '#000',
            },
            tooltip: {
              theme: isDark ? 'dark' : 'light',
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
            },
          }}
          series={[
            {
              name: 'series-1',
              data: [30, 40, 45, 50, 49, 60, 70, 91],
            },
          ]}
          type="line"
          width="600"
        />
      </Card>
    </>
  );
}
