import { useState } from 'react';
import { BASE_API_URL } from '../constants';
import { Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import './SensorLegendItem.css';

async function fetchSensorData(sensorEui, from, to, dataPoints) {
  const getDataPointsRequest = await fetch(
    `${BASE_API_URL}/data?datapoints=${dataPoints}&from=${from}&to=${to}&eui=${sensorEui}`,
  );
  return getDataPointsRequest.json();
}

export default function SensorLegendItem({ sensorLegend, onOpen, onClose, dataOptions }) {
  const [isOpen, setIsOpen] = useState(false);

  const queryKey = [
    'sensor-data',
    sensorLegend.eui,
    dataOptions.from,
    dataOptions.to,
    dataOptions.count,
  ];
  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchSensorData(sensorLegend.eui, dataOptions.from, dataOptions.to, dataOptions.count),
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
      <span className="sensor-legend-name">
        {/* Replace hyphen with non-breaking hyphen */}
        {sensorLegend.name.replace('-', '‑')}{' '}
      </span>
      {query.isLoading && isOpen && (
        <CircularProgress color="secondary" sx={{ ml: 1 }} size={15} />
      )}
    </Box>
  );
}
