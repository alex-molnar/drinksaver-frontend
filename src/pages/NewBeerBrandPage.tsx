import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Fab,
  Zoom,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Layout from '../components/Layout';
import { useAppNavigation } from '../hooks/useNavigation';
import { createBrand } from '../api/endpoints';

const NewBeerBrandPage: React.FC = () => {
  const { navigateToSuccess, navigateToError } = useAppNavigation();

  const [brandName, setBrandName] = useState('');
  const [saving, setSaving] = useState(false);

  const isFormValid = () => {
    return brandName.trim().length > 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) return;

    setSaving(true);

    const saveOperation = async () => {
      await createBrand(brandName.trim());
    };

    try {
      await saveOperation();
      navigateToSuccess(`Beer brand "${brandName}" has been created!`);
    } catch (error) {
      console.error('Failed to create brand:', error);
      navigateToError('Failed to create beer brand. Please try again.');
    }
  }, [brandName, navigateToSuccess, navigateToError]);

  return (
    <Layout title="New Beer Brand" showBackButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 10 }}>
        {/* Brand Details */}
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <SportsBarIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Brand Details
            </Typography>
          </Box>

          <TextField
            label="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            fullWidth
            required
            placeholder="e.g., Heineken, Budweiser, Corona"
          />
        </Paper>
      </Box>

      {/* Floating Action Button */}
      <Zoom in={isFormValid()}>
        <Fab
          color="primary"
          onClick={handleSubmit}
          disabled={saving || !isFormValid()}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            zIndex: 1200,
          }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
        </Fab>
      </Zoom>
    </Layout>
  );
};

export default NewBeerBrandPage;
