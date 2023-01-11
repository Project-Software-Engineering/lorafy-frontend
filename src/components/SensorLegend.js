import { Box } from '@mui/material';
import './SensorLegend.css';
import SensorLegendItem from './SensorLegendItem';

export default function SensorLegend({
  sensorLegendData,
  onOpenSensor,
  onCloseSensor,
}) {
  return (
    <Box>
      {sensorLegendData.map((sensorLegend) => (
        <SensorLegendItem
          key={sensorLegend.eui}
          sensorLegend={sensorLegend}
          onOpen={(data) => onOpenSensor?.(sensorLegend.eui, data)}
          onClose={() => onCloseSensor?.(sensorLegend.eui)}
        />
      ))}
    </Box>
  );
}
