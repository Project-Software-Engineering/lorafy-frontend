import React, { useState, useCallback, useEffect } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import SensorLegend from '../components/SensorLegend';
import { roundToDecimals } from '../utils/math';
import useIsMobile from '../hooks/useIsMobile';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { House, Park, WbCloudy, WbSunny, Opacity } from '@mui/icons-material';
import {
  getDataOptionsForDay,
  getDataOptionsForMonth,
  getDataOptionsForWeek,
  getDataOptionsForYear,
} from '../utils/dataOptions';

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
    icon: <WbSunny />,
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: <WbCloudy />,
  },
  {
    id: 'humidity',
    name: 'Humidity',
    icon: <Opacity />,
    unit: '%',
  },
];

const STATIC_TIME_RANGES = {
  day: {
    label: '1D',
    dataOptions: getDataOptionsForDay(),
  },
  week: {
    label: '1W',
    dataOptions: getDataOptionsForWeek(),
  },
  month: {
    label: '1M',
    dataOptions: getDataOptionsForMonth(),
  },
  year: {
    label: '1Y',
    dataOptions: getDataOptionsForYear(),
  },
};

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const isMobile = useIsMobile();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sensors = useLoaderData();
  const [parameter, setParameter] = useState(parameters[0].id);
  const [sensorData, setSensorData] = useState({});

  const [selectedTimeRange, setSelectedTimeRange] = useState('day');
  const dataOptions = STATIC_TIME_RANGES[selectedTimeRange].dataOptions;

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
      <ToggleButtonGroup
        orientation="horizontal"
        value={selectedTimeRange}
        exclusive
        onChange={(_, newValue) => {
          // Makes sure that you can't deselect the button
          if (newValue) {
            // Actually set the new value
            setSelectedTimeRange(newValue);
          }
        }}
      >
        {Object.entries(STATIC_TIME_RANGES).map(([key, timeRange]) => {
          return (
            <ToggleButton key={key} value={key}>
              {timeRange.label}
            </ToggleButton>
          );
        })}
        <ToggleButton value="custom">Custom</ToggleButton>
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
                categories: dataOptions.labels,
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
          dataOptions={dataOptions}
        />
      </Box>
    </Card>
  );
}
