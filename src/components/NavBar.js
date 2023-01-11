import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Toolbar,
  useTheme,
} from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext } from '../themes';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import Logo from './Logo';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';

const NAV_BAR_LINKS = [
  {
    title: 'Dashboard',
    path: '/',
  },
  {
    title: 'Sensors',
    path: '/sensors',
  },
  {
    title: 'Settings',
    path: '/settings',
  },
  {
    title: 'About',
    path: '/about',
  },
];

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && drawerOpen) {
      // Close the drawer when the screen size changes to desktop
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  return (
    <AppBar
      position="static"
      style={{ backgroundImage: 'unset' }}
      color="default"
      sx={{ paddingX: isMobile ? 0 : 15 }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Logo />
        </Box>
        {!isMobile && (
          <>
            {NAV_BAR_LINKS.map((link, index) => (
              <Button
                component={Link}
                to={link.path}
                key={index}
                color="inherit"
              >
                {link.title}
              </Button>
            ))}
          </>
        )}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Toolbar>

      <Drawer
        variant="temporary"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <List>
          {NAV_BAR_LINKS.map((link, index) => (
            <ListItem key={index}>
              <ListItemButton component={Link} to={link.path}>
                <ListItemText>{link.title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
