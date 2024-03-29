import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useLoaderData } from 'react-router-dom';
import { Box, Card, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Battery0Bar,
  Battery3Bar,
  Battery5Bar,
  BatteryFull,
} from '@mui/icons-material';
import './SensorsPage.css';
import useIsMobile from '../hooks/useIsMobile';

function getBatteryLevelIcon(batteryLevel) {
  if (batteryLevel <= 0) {
    return <Battery0Bar htmlColor="red" />;
  } else if (batteryLevel <= 1) {
    return <Battery3Bar htmlColor="#f7c11e" />;
  } else if (batteryLevel <= 2) {
    return <Battery5Bar htmlColor="#cfe34d" />;
  } else {
    return <BatteryFull htmlColor="#7fe34d" />;
  }
}

const SENSOR_COLUMNS = [
  {
    field: 'eui',
    headerName: 'EUI',
    description: 'The ID of the sensor.',
    flex: 2,
  },
  {
    field: 'name',
    headerName: 'Name',
    description: 'The name of the sensor.',
    flex: 2,
  },
  {
    field: 'address',
    headerName: 'Address',
    description: 'The address of the sensor in The Things Network.',
    flex: 2,
  },
  {
    field: 'batteryLevel',
    valueGetter: (sensor) => sensor.row.metadata?.battery,
    headerName: 'Battery Level',
    description: 'The current battery level of the sensor (0-3).',
    flex: 1,
    renderCell: (params) => {
      if (!params.value) return '-';

      const icon = getBatteryLevelIcon(params.value);
      return (
        <>
          <span className="battery-level">{params.value}</span>
          {icon}
        </>
      );
    },
  },
  {
    field: 'batteryVoltage',
    valueGetter: (sensor) => sensor.row.metadata?.batteryVoltage,
    headerName: 'Battery Voltage',
    description: 'The current battery voltage of the sensor.',
    flex: 1,
    renderCell: (params) => (params.value ? `${params.value} V` : '-'),
  },
];

export default function SensorsPage() {
  useDocumentTitle('Sensors');

  const sensors = useLoaderData();
  const isMobile = useIsMobile();

  return (
    <Card
      sx={{
        width: isMobile ? '100%' : '65%',
        p: 2,
        m: 'auto',
      }}
    >
      <Typography variant="h2">Sensors</Typography>

      <Box>
        <DataGrid
          autoHeight
          sx={{ mt: 2 }}
          rows={sensors}
          columns={SENSOR_COLUMNS}
          hideFooter={true}
          disableSelectionOnClick
          getRowId={(row) => row.eui}
        />
      </Box>
    </Card>
  );
}
