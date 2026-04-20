import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import Layout from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
import { useAppNavigation } from '../hooks/useNavigation';
import type { SuccessPageState } from '../types/api';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const { navigateToHome } = useAppNavigation();
  const state = location.state as SuccessPageState | null;

  const message = state?.message || 'Operation completed successfully!';

  return (
    <Layout title="Success">
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
            bgcolor: 'success.light',
            borderRadius: 3,
            width: '100%',
            maxWidth: 320,
          }}
        >
          <CheckCircleOutlined
            sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
          />
          <Typography
            variant="h6"
            color="success.dark"
            sx={{ fontWeight: 500, mb: 1 }}
          >
            Success!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Paper>

        <LoadingButton
          variant="contained"
          color="primary"
          onClick={navigateToHome}
          sx={{ minWidth: 200 }}
        >
          Back to Home
        </LoadingButton>
      </Box>
    </Layout>
  );
};

export default SuccessPage;
