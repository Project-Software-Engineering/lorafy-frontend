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
import SensorLegend from '../components/SensorLegend';
import { roundToDecimals } from '../utils/math';
import useIsMobile from '../hooks/useIsMobile';

const COLORS = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sensors = useLoaderData();
  const [parameter, setParameter] = useState('temperatureOutside');
  const [sensorData, setSensorData] = useState({});

  // Create the legend data that will be passed through to the SensorLegend component
  const sensorLegendData = sensors.map((sensor, index) => ({
    eui: sensor.eui,
    name: sensor.name,
    color: COLORS[index], // TODO: What if there are more sensors than colors?
  }));

  // Calculate the series that will be displayed by the graph
  const sensorSeries = [];
  if (parameter) {
    for (const sensor of sensors) {
      if (sensorData[sensor.eui]) {
        const data = sensorData[sensor.eui].map((d) => {
          const datapoint = d.payload[parameter];
          if (datapoint != null) {
            return roundToDecimals(datapoint);
          } else {
            return null;
          }
        });
        const hasData = data.some((d) => d !== null);

        if (hasData) {
          sensorSeries.push({
            name: sensor.name,
            data,
            color: sensorLegendData.find((s) => s.eui === sensor.eui).color,
          });
        }
      }
    }
  }

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: isMobile ? '100%' : 'min-content',
        margin: 'auto',
      }}
    >
      <ToggleButtonGroup orientation="horizontal">
        <ToggleButton value="temperatureOutside" aria-label="temperature">
          1H
        </ToggleButton>
        <ToggleButton value="temperatureOutside" aria-label="temperature">
          1D
        </ToggleButton>
        <ToggleButton value="temperatureOutside" aria-label="temperature">
          1W
        </ToggleButton>
        <ToggleButton value="temperatureOutside" aria-label="temperature">
          1M
        </ToggleButton>
        <ToggleButton value="temperatureOutside" aria-label="temperature">
          1Y
        </ToggleButton>
        <ToggleButton value="temperatureOutside" aria-label="temperature">
          Custom
        </ToggleButton>
      </ToggleButtonGroup>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexBasis: '10%',
        }}
      >
        <ToggleButtonGroup
          orientation={isMobile ? 'horizontal' : 'vertical'}
          value={parameter}
          exclusive
          onChange={(_, newValue) => {
            // Makes sure that you can't deselect the button
            if (newValue) {
              // Actually set the new value
              setParameter(newValue);
            }
          }}
        >
          <ToggleButton value="temperatureOutside" aria-label="temperature">
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
        <Box sx={{ mx: 3 }}>
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
                categories: [1, 2, 3, 4, 5, 6, 7],
              },
            }}
            series={sensorSeries}
            type="line"
            width={isMobile ? '120%' : 800}
          />
        </Box>
        <SensorLegend
          sensorLegendData={sensorLegendData}
          onCloseSensor={(eui) => {
            setSensorData((prev) => {
              const newData = { ...prev };
              delete newData[eui];
              return newData;
            });
          }}
          onOpenSensor={(eui, data) => {
            setSensorData((current) => {
              return {
                ...current,
                [eui]: data,
              };
            });
          }}
        />
      </Box>
    </Card>
  );
}
