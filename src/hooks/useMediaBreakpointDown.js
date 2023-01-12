import { useMediaQuery, useTheme } from '@mui/material';

export default function useMediaBreakpointDown(key) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(key));
}
