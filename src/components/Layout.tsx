import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'DrinkSaver' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <LocalBarIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 1.5,
          px: 1.5,
          maxWidth: '600px',
          width: '100%',
          mx: 'auto',
          // On mobile, use minimal side padding
          '@media (max-width: 600px)': {
            px: 1,
            py: 1,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
