import React from "react";
import useDocumentTitle from '../hooks/useDocumentTitle';
import {useLoaderData} from "react-router-dom";
import {Box} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';

const SENSOR_COLUMNS = [
  {field: 'eui', headerName: 'EUI', width: 100},
  {field: 'name', headerName: 'Name', width: 100},
  {field: 'address', headerName: 'Address', width: 100},
  {valueGetter: (sensor) => sensor.row.metadata?.battery || '-' , headerName: 'Battery', width: 100},
]

export default function SensorsPage() {
  useDocumentTitle('Sensors');

  const sensors = useLoaderData();

  return (
    <>
      <h1>Sensors Page</h1>
      <Box sx={{height: 550, width: '100%'}}>
        {sensors.length > 0 ? (
          <DataGrid
            rows={sensors}
            columns={SENSOR_COLUMNS}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            getRowId={row => row.eui}
          />
        ) : (
          <div>Loading data...</div>
        )}
      </Box>
    </>
  );
}
