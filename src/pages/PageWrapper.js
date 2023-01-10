import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import './PageWrapper.css';
import { Box } from '@mui/material';
import useIsMobile from '../hooks/useIsMobile';

export default function PageWrapper() {
  const isMobile = useIsMobile();

  return (
    <>
      <NavBar />
      <Box sx={{ paddingX: isMobile ? 1 : 10, paddingY: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
