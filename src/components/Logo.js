import darkModeLogo from '../assets/logo_dark_mode.svg';
import lightModeLogo from '../assets/logo_light_mode.svg';
import { useTheme } from '@mui/material';

export default function Logo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <img
      src={isDark ? darkModeLogo : lightModeLogo}
      className="App-logo"
      alt={isDark ? 'darkModeLogo' : 'lightModeLogo'}
      width="100"
    />
  );
}
