import { useState } from 'react';
import { BASE_API_URL } from '../constants';
import { Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import './SensorLegendItem.css';

const TEST_DATAPOINTS = 7;
const TEST_FROM = 1670536695; // 08 december 2022 22:58
const TEST_TO = TEST_FROM + 3600 * 24 * 7;

async function fetchSensorData(sensorEui, from, to, dataPoints) {
  const getDataPointsRequest = await fetch(
    `${BASE_API_URL}/data?datapoints=${dataPoints}&from=${from}&to=${to}&eui=${sensorEui}`,
  );
  return getDataPointsRequest.json();
}

export default function SensorLegendItem({ sensorLegend, onOpen, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  const queryKey = [
    'sensor-data',
    sensorLegend.eui,
    TEST_FROM,
    TEST_TO,
    TEST_DATAPOINTS,
  ];
  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchSensorData(sensorLegend.eui, TEST_FROM, TEST_TO, TEST_DATAPOINTS),
    enabled: isOpen,
    onSuccess: (data) => {
      if (isOpen) {
        onOpen(data);
      }
    },
  });

  const onClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    } else {
      setIsOpen(true);
      if (query.data) {
        onOpen(query.data);
      }
    }
  };

  return (
    <Box
      className="sensor-legend-item"
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        opacity: isOpen ? 1 : 0.5,
        paddingY: 1,
      }}
      key={sensorLegend.eui}
    >
      <div
        className="sensor-legend-marker"
        style={{ backgroundColor: sensorLegend.color }}
      />
      <span className="sensor-legend-name">{sensorLegend.name}</span>
      {query.isLoading && isOpen && (
        <CircularProgress color="secondary" sx={{ ml: 1 }} size={15} />
      )}
    </Box>
  );
}
