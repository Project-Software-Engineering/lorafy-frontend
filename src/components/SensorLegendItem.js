import { useState } from 'react';
import { BASE_API_URL } from '../constants';
import { Box, CircularProgress } from '@mui/material';

const TEST_DATAPOINTS = 7;
const TEST_FROM = 1670536693; // 08 december 2022 22:58
const TEST_TO = TEST_FROM + 3600 * 24 * 7;

export default function SensorLegendItem({ sensorLegend, onOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sensorData, setSensorData] = useState([]);

  const loadSensorData = async () => {
    // Load the sensor data
    try {
      setIsLoading(true);
      const getDataPointsRequest = await fetch(
        `${BASE_API_URL}/data?datapoints=${TEST_DATAPOINTS}&from=${TEST_FROM}&to=${TEST_TO}&eui=${sensorLegend.eui}`,
      );
      const jsonResponse = await getDataPointsRequest.json();
      setSensorData(jsonResponse.map((d) => d.payload));
      onOpen?.(jsonResponse.map((d) => d.payload));
    } catch (e) {
      console.error('Could not load sensor data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    } else {
      setIsOpen(true);

      await loadSensorData();
    }
  };

  return (
    <Box
      className="sensor-legend"
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
      {isLoading && (
        <CircularProgress color="secondary" sx={{ ml: 1 }} size={15} />
      )}
    </Box>
  );
}
