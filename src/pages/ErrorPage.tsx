import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import Layout from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
import { useAppNavigation } from '../hooks/useNavigation';
import type { ErrorPageState } from '../types/api';

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const { navigateToHome, navigateToSuccess, navigateToError } = useAppNavigation();
  const state = location.state as ErrorPageState | null;
  const [retrying, setRetrying] = useState(false);

  const message = state?.message || 'An unexpected error occurred.';
  const retryOperation = state?.retryOperation;

  const handleRetry = useCallback(async () => {
    if (!retryOperation) return;
    
    setRetrying(true);
    try {
      await retryOperation();
      navigateToSuccess('Operation completed successfully!');
    } catch (error) {
      console.error('Retry failed:', error);
      navigateToError('Retry failed. Please try again.', retryOperation);
    } finally {
      setRetrying(false);
    }
  }, [retryOperation, navigateToSuccess, navigateToError]);

  return (
    <Layout title="Error">
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'error.light',
            borderRadius: 3,
            width: '100%',
            maxWidth: 320,
          }}
        >
          <ErrorOutlined
            sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
          />
          <Typography
            variant="h6"
            color="error.dark"
            sx={{ fontWeight: 500, mb: 1 }}
          >
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 200 }}>
          {retryOperation && (
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleRetry}
              loading={retrying}
              fullWidth
            >
              Retry
            </LoadingButton>
          )}
          <LoadingButton
            variant="outlined"
            color="primary"
            onClick={navigateToHome}
            fullWidth
          >
            Back to Home
          </LoadingButton>
        </Box>
      </Box>
    </Layout>
  );
};

export default ErrorPage;
