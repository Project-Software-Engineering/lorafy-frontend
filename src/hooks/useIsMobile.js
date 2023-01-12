import useMediaBreakpointDown from './useMediaBreakpointDown';

export default function useIsMobile() {
  // Anything from the "md" media query and lower we consider "mobile"
  return useMediaBreakpointDown('md');
}
