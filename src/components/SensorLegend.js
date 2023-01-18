import { Box } from '@mui/material';
import SensorLegendItem from './SensorLegendItem';
import { getStorageItem, saveStorageItem } from '../utils/storage';

export default function SensorLegend({
  sensorLegendData,
  onOpenSensor,
  onCloseSensor,
  dataOptions,
}) {
  return (
    <Box sx={{ p: 2 }}>
      {sensorLegendData.map((sensorLegend, i) => {
        const openStorageKey = `${sensorLegend.eui}/open`;
        const currentOpen = getStorageItem(openStorageKey) ?? false;

        return (
          <SensorLegendItem
            key={sensorLegend.eui}
            sensorLegend={sensorLegend}
            onOpen={(data) => {
              onOpenSensor?.(sensorLegend.eui, data);
              saveStorageItem(openStorageKey, true);
            }}
            onClose={() => {
              onCloseSensor?.(sensorLegend.eui);
              saveStorageItem(openStorageKey, false);
            }}
            dataOptions={dataOptions}
            initialOpen={i === 0 || currentOpen} // Open the first sensor by default
          />
        );
      })}
    </Box>
  );
}
