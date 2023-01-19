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
    <Box sx={{ p: 2, border: 'rgba(0, 0, 0, 0.12) solid 1px', borderRadius: 4 }}>
      {sensorLegendData.map((sensorLegend, i) => {
        const openStorageKey = `${sensorLegend.eui}/open`;
        const currentOpen = getStorageItem(openStorageKey) ?? true;

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
            initialOpen={currentOpen} // Open the first sensor by default
          />
        );
      })}
    </Box>
  );
}
