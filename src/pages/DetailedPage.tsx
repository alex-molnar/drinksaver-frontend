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
  Paper,
  Divider,
  Fab,
  Zoom,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
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

  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Form state
  const [alcoholTypeId, setAlcoholTypeId] = useState<number | ''>('');
  const [volumeId, setVolumeId] = useState<number | ''>('');
  const [consumptionTypeId, setConsumptionTypeId] = useState<number | ''>('');
  const [brandId, setBrandId] = useState<number | ''>('');
  const [drinkDate, setDrinkDate] = useState(getTodayDate());
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
      // Use selected date or default to today
      const dateToSend = drinkDate || getTodayDate();

      if (isBeer) {
        await saveBeer({
          alcoholTypeId: alcoholTypeId as number,
          alcoholVolumeId: volumeId as number,
          brandId: brandId as number,
          consumptionTypeId: consumptionTypeId as number,
          comments: comments || undefined,
          date: dateToSend,
        });
      } else {
        await saveDrink({
          alcoholTypeId: alcoholTypeId as number,
          alcoholVolumeId: volumeId as number,
          comments: comments || undefined,
          date: dateToSend,
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
    drinkDate,
    comments,
    isBeer,
    navigateToSuccess,
    navigateToError,
  ]);

  if (loadingTypes) {
    return (
      <Layout title="Add Drink">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Add Drink">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 10 }}>
        {/* Section 1: Drink Type */}
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <LocalBarIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              What are you drinking?
            </Typography>
          </Box>

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
              sx={{ mt: 0.5, minWidth: 48, minHeight: 48, bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Volume - shows when type selected */}
          {alcoholTypeId !== '' && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2 }}>
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
                sx={{ mt: 0.5, minWidth: 48, minHeight: 48, bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Paper>

        {/* Section 2: Beer Details (conditional) */}
        {isBeer && (
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <SportsBarIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Beer Details
              </Typography>
            </Box>

            {/* Consumption Type */}
            <FormControl fullWidth sx={{ mb: 2 }}>
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
                sx={{ mt: 0.5, minWidth: 48, minHeight: 48, bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        )}

        {/* Section 3: Additional Details */}
        {alcoholTypeId !== '' && (
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <CalendarTodayIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Additional Details
              </Typography>
            </Box>

            <TextField
              label="Date"
              type="date"
              value={drinkDate}
              onChange={(e) => setDrinkDate(e.target.value)}
              fullWidth
              helperText="When did you have this drink?"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: getTodayDate() },
              }}
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <TextField
              label="Notes (optional)"
              multiline
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
              placeholder="Add any notes about this drink..."
            />
          </Paper>
        )}

        {/* Validation hint */}
        {alcoholTypeId !== '' && !isFormValid() && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 1 }}
          >
            Please fill in all required fields to save
          </Typography>
        )}
      </Box>

      {/* Floating Action Button */}
      <Zoom in={isFormValid()}>
        <Fab
          color="primary"
          onClick={handleSave}
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

export default DetailedPage;
