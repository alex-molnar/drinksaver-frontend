import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  hideBottomNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'DrinkSaver',
  showBackButton = false,
  hideBottomNav = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on current route
  const getNavValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/detailed') return 1;
    return -1;
  };

  const handleNavChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) navigate('/');
    else if (newValue === 1) navigate('/detailed');
    // History tab placeholder - could navigate to '/history' in future
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Top App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {showBackButton ? (
            <IconButton
              edge="start"
              onClick={() => navigate(-1)}
              sx={{ mr: 1, color: 'text.primary' }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <LocalBarIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
          )}
          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1, color: 'text.primary' }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          px: 2,
          pb: hideBottomNav ? 2 : 10, // Extra padding for bottom nav
        }}
      >
        {children}
      </Container>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            pb: 'env(safe-area-inset-bottom)', // iOS safe area
            zIndex: 1100,
          }}
        >
          <BottomNavigation
            value={getNavValue()}
            onChange={handleNavChange}
            showLabels
          >
            <BottomNavigationAction
              label="Quick Save"
              icon={<FlashOnIcon />}
            />
            <BottomNavigationAction
              label="Add Drink"
              icon={<AddCircleIcon />}
            />
            <BottomNavigationAction
              label="History"
              icon={<HistoryIcon />}
              disabled
            />
          </BottomNavigation>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
