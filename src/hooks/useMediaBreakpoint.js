import { useMediaQuery, useTheme } from '@mui/material';

export default function useMediaBreakpoint(key) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(key));
}
