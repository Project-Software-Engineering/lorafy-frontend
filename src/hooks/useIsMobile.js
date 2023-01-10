import useMediaBreakpoint from './useMediaBreakpoint';

export default function useIsMobile() {
  // Anything from the laptop media query and lower we consider "mobile"
  return !useMediaBreakpoint('laptop');
}
