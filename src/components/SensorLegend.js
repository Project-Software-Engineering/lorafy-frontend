import { Box, CircularProgress } from '@mui/material';
import './SensorLegend.css';

export default function SensorLegend({
  sensorLegendData,
  onSensorLegendSelect,
}) {
  return (
    <Box>
      {sensorLegendData.map((sensorLegend) => (
        <Box
          className="sensor-legend"
          onClick={() => onSensorLegendSelect?.(sensorLegend)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            opacity: sensorLegend.open ? 1 : 0.5,
            paddingY: 1,
          }}
          key={sensorLegend.eui}
        >
          <div
            className="sensor-legend-marker"
            style={{ backgroundColor: sensorLegend.color }}
          />
          <span className="sensor-legend-name">{sensorLegend.name}</span>
          {sensorLegend.loading && (
            <CircularProgress color="secondary" sx={{ ml: 1 }} size={15} />
          )}
        </Box>
      ))}
    </Box>
  );
}
