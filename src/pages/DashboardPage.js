import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useLoaderData } from 'react-router-dom';
import { BASE_API_URL } from '../constants';
import SensorLegend from '../components/SensorLegend';

// TODO: Load data:
//   const test = await fetch(
//     `${BASE_API_URL}/data?datapoints=5&from=1670536693&to=1671141493&eui=70B3D5499ED96FBD`,
//   );
//   console.log('test', test);

const COLORS = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sensors = useLoaderData();
  const [parameter, setParameter] = useState('temperature');
  const [openSensors, setOpenSensors] = useState(
    sensors.length > 0 ? [sensors[0].eui] : [],
  );

  // Function that is called when the SensorLegend component selects a new legend
  const onSensorLegendSelect = (sensorLegend) => {
    if (openSensors.includes(sensorLegend.eui)) {
      setOpenSensors(openSensors.filter((s) => s !== sensorLegend.eui));
    } else {
      setOpenSensors([...openSensors, sensorLegend.eui]);
    }
  };

  // Create the legend data that will be passed through to the SensorLegend component
  const sensorLegendData = sensors.map((sensor, index) => ({
    eui: sensor.eui,
    name: sensor.name,
    color: COLORS[index], // TODO: What if there are more sensors than colors?
    open: openSensors.includes(sensor.eui),
    loading: openSensors.includes(sensor.eui), // TODO: Make this load when there is a request for the data,
  }));

  // Calculate the series that will be displayed by the graph
  const sensorSeries = [];
  for (const sensor of sensors) {
    if (openSensors.includes(sensor.eui)) {
      sensorSeries.push({
        name: sensor.name,
        data: [1, 2, 3, 5, 8, 9],
      });
    }
  }

  return (
    <Card sx={{ p: 3 }}>
      TODO: Implement time range selector
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <ToggleButtonGroup
          orientation="vertical"
          value={parameter}
          exclusive
          onChange={(_, newValue) => setParameter(newValue)}
        >
          <ToggleButton value="temperature" aria-label="temperature">
            <ThermostatIcon />
          </ToggleButton>
          <ToggleButton value="light" aria-label="light">
            <WbSunnyIcon />
          </ToggleButton>
          <ToggleButton value="pressure" aria-label="pressure">
            <CloudDownloadIcon />
          </ToggleButton>
          <ToggleButton value="humidity" aria-label="humidity">
            <OpacityIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <Chart
          options={{
            chart: {
              background: 'transparent',
            },
            legend: {
              show: false, // Disable legend because we have our own legend
            },
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
            },
          }}
          series={sensorSeries}
          type="line"
          width="600"
        />
        <SensorLegend
          sensorLegendData={sensorLegendData}
          onSensorLegendSelect={onSensorLegendSelect}
        />
      </Box>
    </Card>
  );
}
