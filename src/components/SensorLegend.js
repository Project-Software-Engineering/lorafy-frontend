import { Box } from '@mui/material';
import SensorLegendItem from './SensorLegendItem';

export default function SensorLegend({
  sensorLegendData,
  onOpenSensor,
  onCloseSensor,
}) {
  return (
    <Box sx={{ p: 2, width: 120 }}>
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
