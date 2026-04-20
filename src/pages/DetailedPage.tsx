import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  type SelectChangeEvent,
  CircularProgress,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
import { useAppNavigation } from '../hooks/useNavigation';
import {
  getAlcoholTypes,
  getVolumesByAlcoholType,
  getConsumptionTypes,
  getBrands,
  saveDrink,
  saveBeer,
} from '../api/endpoints';

// Beer type ID - typically ID 1, but we check by name as fallback
const BEER_TYPE_NAME = 'Beer';

const DetailedPage: React.FC = () => {
  const { navigateToSuccess, navigateToError, navigateToNewAlcohol, navigateToNewVolume, navigateToNewBrand } =
    useAppNavigation();

  // Form state
  const [alcoholTypeId, setAlcoholTypeId] = useState<number | ''>('');
  const [volumeId, setVolumeId] = useState<number | ''>('');
  const [consumptionTypeId, setConsumptionTypeId] = useState<number | ''>('');
  const [brandId, setBrandId] = useState<number | ''>('');
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch alcohol types
  const { data: alcoholTypes, isLoading: loadingTypes } = useQuery({
    queryKey: ['alcoholTypes'],
    queryFn: () => getAlcoholTypes(),
  });

  // Check if selected type is beer
  const selectedType = alcoholTypes?.find((t) => t.id === alcoholTypeId);
  const isBeer =
    selectedType?.name.toLowerCase() === BEER_TYPE_NAME.toLowerCase();

  // Fetch volumes when alcohol type is selected
  const { data: volumes, isLoading: loadingVolumes } = useQuery({
    queryKey: ['volumes', alcoholTypeId],
    queryFn: () => getVolumesByAlcoholType(alcoholTypeId as number),
    enabled: alcoholTypeId !== '',
  });

  // Fetch beer-specific data when beer is selected
  const { data: consumptionTypes, isLoading: loadingConsumption } = useQuery({
    queryKey: ['consumptionTypes'],
    queryFn: () => getConsumptionTypes(),
    enabled: isBeer,
  });

  const { data: brands, isLoading: loadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(),
    enabled: isBeer,
  });

  // Reset dependent fields when alcohol type changes
  useEffect(() => {
    setVolumeId('');
    setConsumptionTypeId('');
    setBrandId('');
  }, [alcoholTypeId]);

  // Form validation
  const isFormValid = () => {
    if (alcoholTypeId === '' || volumeId === '') return false;
    if (isBeer && (consumptionTypeId === '' || brandId === '')) return false;
    return true;
  };

  const handleAlcoholTypeChange = (event: SelectChangeEvent<number | ''>) => {
    setAlcoholTypeId(event.target.value as number | '');
  };

  const handleSave = useCallback(async () => {
    if (!isFormValid()) return;

    setSaving(true);

    const saveOperation = async () => {
      if (isBeer) {
        await saveBeer({
          alcoholTypeId: alcoholTypeId as number,
          alcoholVolumeId: volumeId as number,
          brandId: brandId as number,
          consumptionTypeId: consumptionTypeId as number,
          comments: comments || undefined,
        });
      } else {
        await saveDrink({
          alcoholTypeId: alcoholTypeId as number,
          alcoholVolumeId: volumeId as number,
          comments: comments || undefined,
        });
      }
    };

    try {
      await saveOperation();
      navigateToSuccess('Your drink has been saved!');
    } catch (error) {
      console.error('Failed to save drink:', error);
      navigateToError('Failed to save your drink. Please try again.');
    }
  }, [
    alcoholTypeId,
    volumeId,
    brandId,
    consumptionTypeId,
    comments,
    isBeer,
    navigateToSuccess,
    navigateToError,
  ]);

  if (loadingTypes) {
    return (
      <Layout title="Add Drink">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Add Drink">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
        {/* Alcohol Type Selector */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="alcohol-type-label">Alcohol Type</InputLabel>
            <Select
              labelId="alcohol-type-label"
              value={alcoholTypeId}
              label="Alcohol Type"
              onChange={handleAlcoholTypeChange}
            >
              {alcoholTypes?.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            color="primary"
            onClick={navigateToNewAlcohol}
            sx={{ mt: 1, minWidth: 44, minHeight: 44 }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Show remaining fields only when alcohol type is selected */}
        {alcoholTypeId !== '' && (
          <>
            {/* Volume Selector */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="volume-label">Volume</InputLabel>
                <Select
                  labelId="volume-label"
                  value={volumeId}
                  label="Volume"
                  onChange={(e) => setVolumeId(e.target.value as number | '')}
                  disabled={loadingVolumes}
                >
                  {volumes?.map((vol) => (
                    <MenuItem key={vol.id} value={vol.id}>
                      {vol.name} ({vol.volume}L)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                color="primary"
                onClick={() =>
                  navigateToNewVolume(alcoholTypeId as number, selectedType?.name || '')
                }
                sx={{ mt: 1, minWidth: 44, minHeight: 44 }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Beer-specific fields */}
            {isBeer && (
              <>
                {/* Consumption Type - NO + button */}
                <FormControl fullWidth>
                  <InputLabel id="consumption-type-label">Consumption Type</InputLabel>
                  <Select
                    labelId="consumption-type-label"
                    value={consumptionTypeId}
                    label="Consumption Type"
                    onChange={(e) =>
                      setConsumptionTypeId(e.target.value as number | '')
                    }
                    disabled={loadingConsumption}
                  >
                    {consumptionTypes?.map((ct) => (
                      <MenuItem key={ct.id} value={ct.id}>
                        {ct.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Brand Selector */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="brand-label">Brand</InputLabel>
                    <Select
                      labelId="brand-label"
                      value={brandId}
                      label="Brand"
                      onChange={(e) => setBrandId(e.target.value as number | '')}
                      disabled={loadingBrands}
                    >
                      {brands?.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="primary"
                    onClick={navigateToNewBrand}
                    sx={{ mt: 1, minWidth: 44, minHeight: 44 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </>
            )}

            {/* Comments */}
            <TextField
              label="Comments (optional)"
              multiline
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
            />

            {/* Save Button */}
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              loading={saving}
              disabled={!isFormValid()}
              sx={{
                mt: 2,
                py: 1.5,
                opacity: isFormValid() ? 1 : 0.5,
              }}
              fullWidth
            >
              Save Drink
            </LoadingButton>

            {!isFormValid() && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Please fill in all required fields
              </Typography>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default DetailedPage;
