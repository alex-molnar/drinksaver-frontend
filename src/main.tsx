import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create MUI theme with mobile-friendly settings
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Mobile-first: larger base font sizes
    fontSize: 16,
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.9375rem', // 15px - readable on mobile
    },
    button: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          minHeight: 48,
          fontSize: '1rem',
        },
        sizeLarge: {
          fontSize: '1.125rem',
          minHeight: 56,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 56,
            fontSize: '16px', // Prevents iOS zoom
          },
          '& .MuiInputBase-input': {
            fontSize: '16px', // Prevents iOS zoom
            padding: '16px 14px',
          },
          '& .MuiInputLabel-root': {
            fontSize: '16px',
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          minHeight: 56,
          fontSize: '16px', // Prevents iOS zoom
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          minHeight: 48,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Ensure minimum touch target
          minWidth: 48,
          minHeight: 48,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          height: 36,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: 56,
          },
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
