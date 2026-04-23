import React, { useState, useCallback } from 'react';
import { Box, Grid, CircularProgress, Typography, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import RecommendationButton from '../components/RecommendationButton';
import { useAppNavigation } from '../hooks/useNavigation';
import { getRecommendations, saveBeer, saveDrink } from '../api/endpoints';
import type { Recommendation } from '../types/api';
import { isBeerRecommendation } from '../types/api';

const IndexPage: React.FC = () => {
  const { navigateToSuccess, navigateToError, navigateToDetailed } = useAppNavigation();
  const [savingId, setSavingId] = useState<number | null>(null);

  const {
    data: recommendations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
  });

  const handleSaveRecommendation = useCallback(
    async (recommendation: Recommendation) => {
      setSavingId(recommendation.id);

      const saveOperation = async () => {
        if (isBeerRecommendation(recommendation)) {
          await saveBeer({
            alcoholTypeId: recommendation.alcoholTypeId,
            alcoholVolumeId: recommendation.alcoholVolumeId,
            brandId: recommendation.brandId!,
            consumptionTypeId: recommendation.consumptionTypeId!,
          });
        } else {
          await saveDrink({
            alcoholTypeId: recommendation.alcoholTypeId,
            alcoholVolumeId: recommendation.alcoholVolumeId,
          });
        }
      };

      try {
        await saveOperation();
        navigateToSuccess(`${recommendation.name} has been saved!`);
      } catch (error) {
        console.error('Failed to save drink:', error);
        navigateToError(
          `Failed to save ${recommendation.name}. Please try again.`
        );
      }
    },
    [navigateToSuccess, navigateToError]
  );

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography color="error">Failed to load recommendations</Typography>
        </Box>
      </Layout>
    );
  }

  // Take first 7 recommendations max
  const displayRecommendations = recommendations?.slice(0, 7) || [];

  return (
    <Layout title="Quick Save">
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            One-tap save
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Tap your favorite drink to log it instantly
          </Typography>
        </Paper>

        {/* Recommendations Grid */}
        <Grid container spacing={2} sx={{ flex: 1 }}>
          {displayRecommendations.map((rec) => (
            <Grid
              size={6}
              key={rec.id}
              sx={{ minHeight: 120 }}
            >
              <RecommendationButton
                name={rec.name}
                onClick={() => handleSaveRecommendation(rec)}
                loading={savingId === rec.id}
                disabled={savingId !== null && savingId !== rec.id}
              />
            </Grid>
          ))}
          
          {/* Add Custom button - always last */}
          <Grid size={6} sx={{ minHeight: 120 }}>
            <RecommendationButton
              name="Add Custom"
              onClick={navigateToDetailed}
              disabled={savingId !== null}
              isAddButton
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default IndexPage;
