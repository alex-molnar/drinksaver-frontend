import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Chip,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
import { useAppNavigation } from '../hooks/useNavigation';
import { createAlcoholType } from '../api/endpoints';
import type { NewVolumeEntry } from '../types/api';

const NewAlcoholPage: React.FC = () => {
  const { navigateToSuccess, navigateToError } = useAppNavigation();

  // Form state
  const [alcoholName, setAlcoholName] = useState('');
  const [volumeName, setVolumeName] = useState('');
  const [volumeValue, setVolumeValue] = useState('');
  const [volumeError, setVolumeError] = useState('');
  const [volumes, setVolumes] = useState<NewVolumeEntry[]>([]);
  const [saving, setSaving] = useState(false);

  // Validate volume value (positive, < 2)
  const validateVolume = (value: string): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setVolumeError('Please enter a valid number');
      return false;
    }
    if (num <= 0) {
      setVolumeError('Volume must be positive');
      return false;
    }
    if (num >= 2) {
      setVolumeError('Volume must be less than 2 liters');
      return false;
    }
    setVolumeError('');
    return true;
  };

  const handleVolumeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVolumeValue(value);
    if (value) {
      validateVolume(value);
    } else {
      setVolumeError('');
    }
  };

  const handleAddVolume = () => {
    if (!volumeName.trim() || !volumeValue.trim()) return;
    if (!validateVolume(volumeValue)) return;

    const newVolume: NewVolumeEntry = {
      name: volumeName.trim(),
      volume: parseFloat(volumeValue),
    };

    setVolumes([...volumes, newVolume]);
    setVolumeName('');
    setVolumeValue('');
    setVolumeError('');
  };

  const handleRemoveVolume = (index: number) => {
    setVolumes(volumes.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return alcoholName.trim().length > 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) return;

    setSaving(true);

    const saveOperation = async () => {
      await createAlcoholType({
        name: alcoholName.trim(),
        volumes: volumes.length > 0 ? volumes : undefined,
      });
    };

    try {
      await saveOperation();
      navigateToSuccess(`Alcohol type "${alcoholName}" has been created!`);
    } catch (error) {
      console.error('Failed to create alcohol type:', error);
      navigateToError('Failed to create alcohol type. Please try again.');
    }
  }, [alcoholName, volumes, navigateToSuccess, navigateToError]);

  const canAddVolume = volumeName.trim() && volumeValue.trim() && !volumeError;

  return (
    <Layout title="New Alcohol Type">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        {/* Alcohol Name */}
        <TextField
          label="Alcohol Type Name"
          value={alcoholName}
          onChange={(e) => setAlcoholName(e.target.value)}
          fullWidth
          required
          placeholder="e.g., Whiskey, Wine, Vodka"
        />

        {/* Added Volumes Display */}
        {volumes.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Added volumes:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {volumes.map((vol, index) => (
                <Chip
                  key={index}
                  label={`${vol.name} (${vol.volume}L)`}
                  onDelete={() => handleRemoveVolume(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Volume Input Section */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Add volumes (optional):
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              label="Volume Name"
              value={volumeName}
              onChange={(e) => setVolumeName(e.target.value)}
              placeholder="e.g., Shot, Glass"
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Liters"
              value={volumeValue}
              onChange={handleVolumeValueChange}
              placeholder="e.g., 0.5"
              type="number"
              size="small"
              error={!!volumeError}
              helperText={volumeError}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">L</InputAdornment>,
                },
                htmlInput: { step: 0.01, min: 0.01, max: 1.99 },
              }}
              sx={{ flex: 1 }}
            />
            <IconButton
              onClick={handleAddVolume}
              disabled={!canAddVolume}
              sx={{ 
                mt: 0, 
                width: 56, 
                height: 56, 
                bgcolor: canAddVolume ? 'primary.main' : 'grey.300', 
                color: 'white', 
                borderRadius: 2,
                '&:hover': { bgcolor: canAddVolume ? 'primary.dark' : 'grey.400' },
                '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' }
              }}
            >
              <AddIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Box>

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
          Create Alcohol Type
        </LoadingButton>
      </Box>
    </Layout>
  );
};

export default NewAlcoholPage;
