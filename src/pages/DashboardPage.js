import React, { useState, useCallback } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
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
import {
  DeviceThermostat,
  House,
  Park,
  ThermostatAuto,
  WbCloudy,
} from '@mui/icons-material';

const COLORS = [
  '#008FFB',
  '#00E396',
  '#FEB019',
  '#FF4560',
  '#775DD0',
  '#546E7A',
  '#26a69a',
  '#D10CE8',
];

function getHHMM(date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

function getTimeRange(t) {
  if (t === '1h') {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    date.setMinutes(0, 0, 0);
    const from = Math.floor(date.getTime() / 1000);
    const to = from + 3600;
    return {
      from,
      to,
      dataPoints: [getHHMM(date), 1, 2, 3, 4, 4],
    };
  }
}

// const TEST_DATAPOINTS = 7;
// const TEST_FROM = 1670536695; // 08 december 2022 22:58
// const TEST_TO = TEST_FROM + 3600 * 24 * 7;

// const TEST_DATAPOINTS = 34;
// const TEST_TO = Math.floor(1673553149);
// const TEST_FROM = TEST_TO - 3600 * 24 * TEST_DATAPOINTS;

const TEST_DATAPOINTS = 24;

const date = new Date();
date.setMinutes(0, 0, 0);
date.setHours(date.getHours() + 1);
const TEST_TO = Math.floor(date.getTime() / 1000);
const TEST_FROM = TEST_TO - 3600 * TEST_DATAPOINTS;

console.log('from', new Date(TEST_FROM * 1000));
console.log('to', new Date(TEST_TO * 1000));

function getLabelsForDay(from) {
  const labels = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date(from * 1000 + 3600 * 1000 * i);
    labels.push(getHHMM(date));
  }
  return labels;
}

const parameters = [
  {
    id: 'temperatureOutside',
    name: 'Temperature Outside',
    icon: <Park />,
    unit: '°C',
  },
  {
    id: 'temperatureInside',
    name: 'Temperature Inside',
    icon: <House />,
    unit: '°C',
  },
  {
    id: 'light',
    name: 'Light',
    icon: <WbSunnyIcon />,
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: <WbCloudy />,
  },
  {
    id: 'humidity',
    name: 'Humidity',
    icon: <OpacityIcon />,
    unit: '%',
  },
];

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sensors = useLoaderData();
  const [parameter, setParameter] = useState(parameters[0].id);
  const [sensorData, setSensorData] = useState({});
  const [currentDataOptions, setCurrentDataOptions] = useState({
    from: TEST_FROM,
    to: TEST_TO,
    count: TEST_DATAPOINTS,
  });

  const getFormattedYValue = useCallback(
    (value) => {
      if (value == null) return value;

      // Replace dot with comma
      value = value.toString().replace('.', ',');

      const unit = parameters.find((p) => p.id === parameter)?.unit;
      if (unit) {
        return `${value} ${unit}`;
      } else {
        return value;
      }
    },
    [parameter],
  );

  // Create the legend data that will be passed through to the SensorLegend component
  const sensorLegendData = sensors.map((sensor, index) => ({
    eui: sensor.eui,
    name: sensor.name,
    color: COLORS[index],
  }));

  // Calculate the series that will be displayed by the graph
  const sensorSeries = [];
  if (parameter) {
    for (const sensor of sensors) {
      if (sensorData[sensor.eui]) {
        const data = sensorData[sensor.eui].map((d) => {
          const datapoint = d.payload?.[parameter];
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
          {parameters.map((p) => (
            <Tooltip title={p.name} key={p.id} arrow value={p.id}>
              <ToggleButton value={p.id} aria-label={p.name}>
                {p.icon}
              </ToggleButton>
            </Tooltip>
          ))}
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
                categories: getLabelsForDay(currentDataOptions.from),
                labels: {
                  rotate: -45,
                  rotateAlways: true,
                },
              },
              yaxis: {
                labels: {
                  formatter: getFormattedYValue,
                },
              },
              tooltip: {
                y: {
                  formatter: getFormattedYValue,
                },
              },
              markers: {
                size: 4,
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
          dataOptions={currentDataOptions}
        />
      </Box>
    </Card>
  );
}
