import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { INITIAL_THEME } from './constants';

// MUI theme settings
export const themeSetting = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#000b1f',
              paper: '#151618',
            },
          }
        : {
            background: {
              default: '#81A3E7',
            },
          }),
    },
    typography: {
      fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
      fontSize: 12,
      fontWeightMedium: 600,
      h1: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useTheme = () => {
  const [mode, setMode] = useState(INITIAL_THEME);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [],
  );
  const theme = useMemo(() => createTheme(themeSetting(mode)), [mode]);

  return [theme, colorMode];
};
