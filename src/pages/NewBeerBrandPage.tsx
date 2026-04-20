import React, { useState, useCallback } from 'react';
import { Box, TextField } from '@mui/material';
import Layout from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
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
    <Layout title="New Beer Brand">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        {/* Brand Name */}
        <TextField
          label="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          fullWidth
          required
          placeholder="e.g., Heineken, Budweiser, Corona"
        />

        {/* Submit Button */}
        <LoadingButton
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          loading={saving}
          disabled={!isFormValid()}
          sx={{
            mt: 1,
            py: 1.5,
            opacity: isFormValid() ? 1 : 0.5,
          }}
          fullWidth
        >
          Create Brand
        </LoadingButton>
      </Box>
    </Layout>
  );
};

export default NewBeerBrandPage;
