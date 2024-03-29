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
  getDataOptionsForCustomRange,
  getDataOptionsForDay,
  getDataOptionsForMonth,
  getDataOptionsForWeek,
  getDataOptionsForYear,
} from '../utils/dataOptions';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import {
  getDateRangeFromStorage,
  getStorageItem,
  saveDateRangeToStorage,
  saveStorageItem,
} from '../utils/storage';

// The minimum date that can be selected in the date picker. This is the date that we started collecting data.
const MIN_SELECTION_DATE = '2022-12-09';

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

const PARAMETERS = [
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
    unit: '%',
    valueMapper: (value) => (value / 255) * 100,
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: <WbCloudy />,
    unit: 'kPa',
    valueMapper: (value) => value * ((115 - 50) / 1023) + 50, // From MPL115A1 datasheet
  },
  {
    id: 'humidity',
    name: 'Humidity',
    icon: <Opacity />,
    unit: '%',
  },
];

const DEFAULT_PARAMETER_ID = PARAMETERS[0].id;

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

const DEFAULT_TIME_RANGE = 'day';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const isMobile = useIsMobile();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sensors = useLoaderData();
  const [parameter, setParameter] = useState(
    getStorageItem('parameter') ?? DEFAULT_PARAMETER_ID,
  );
  const [sensorData, setSensorData] = useState({});

  const [customDateRange, setCustomDateRange] = useState(
    getDateRangeFromStorage() ?? [null, null],
  );
  const [customDateRangeOpen, setCustomDateRangeOpen] = useState(false);

  const [selectedTimeRangeOption, setSelectedTimeRangeOption] = useState(
    getStorageItem('selectedTimeRangeOption') ?? DEFAULT_TIME_RANGE,
  );
  const [dataOptions, setDataOptions] = useState(
    STATIC_TIME_RANGES[DEFAULT_TIME_RANGE]?.dataOptions,
  );

  // Use effect that updates the data options when the selected time range option changes.
  useEffect(() => {
    if (selectedTimeRangeOption !== 'custom') {
      setDataOptions(STATIC_TIME_RANGES[selectedTimeRangeOption]?.dataOptions);
    } else if (customDateRange[0] && customDateRange[1]) {
      setDataOptions(getDataOptionsForCustomRange(customDateRange));
      saveDateRangeToStorage(customDateRange);
    }

    saveStorageItem('selectedTimeRangeOption', selectedTimeRangeOption);
  }, [selectedTimeRangeOption, customDateRange]);

  useEffect(() => {
    saveStorageItem('parameter', parameter);
  }, [parameter]);

  const onSelectTimeRangeOption = useCallback(
    (_, newValue) => {
      if (newValue && newValue !== 'custom') {
        setSelectedTimeRangeOption(newValue);
      } else if (
        newValue === 'custom' ||
        selectedTimeRangeOption === 'custom'
      ) {
        setCustomDateRangeOpen(true);
      }
    },
    [selectedTimeRangeOption],
  );

  const onDateRangeAccept = useCallback(() => {
    setSelectedTimeRangeOption('custom');
  }, []);

  const onDateRangeClose = useCallback(() => {
    setCustomDateRangeOpen(false);
  }, []);

  const getFormattedYValue = useCallback(
    (value) => {
      if (value == null) return value;

      // Replace dot with comma
      value = value.toString().replace('.', ',');

      const unit = PARAMETERS.find((p) => p.id === parameter)?.unit;
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
    const valueMapper = PARAMETERS.find((p) => p.id === parameter)?.valueMapper;

    for (const sensor of sensors) {
      if (sensorData[sensor.eui]) {
        const data = sensorData[sensor.eui].map((d) => {
          let datapoint = d.payload?.[parameter];

          if (datapoint != null) {
            if (valueMapper) {
              datapoint = valueMapper(datapoint);
            }
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
      <DateRangePicker
        closeOnSelect={true}
        open={customDateRangeOpen}
        disableFuture
        minDate={dayjs(MIN_SELECTION_DATE)}
        value={customDateRange}
        onChange={setCustomDateRange}
        onAccept={onDateRangeAccept}
        onClose={onDateRangeClose}
        showToolbar={false}
        renderInput={() => (
          <ToggleButtonGroup
            orientation="horizontal"
            value={selectedTimeRangeOption}
            exclusive
            onChange={onSelectTimeRangeOption}
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
        )}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexBasis: '10%',
          width: '100%'
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
          {PARAMETERS.map((p) => (
            <Tooltip title={p.name} key={p.id} arrow value={p.id}>
              <ToggleButton value={p.id} aria-label={p.name}>
                {p.icon}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
        <Box sx={{ mx: 3, width: '100%' }}>
          <Chart
            options={{
              chart: {
                background: 'transparent',
              },
              stroke: {
                curve: 'smooth',
              },
              legend: {
                show: false, // Disable legend because we have our own legend
              },
              theme: {
                mode: isDark ? 'dark' : 'light',
              },
              xaxis: {
                categories: dataOptions?.labels || [],
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
            width={isMobile ? '100%' : 800}
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
