import React, { useState, useCallback } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
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
          `Failed to save ${recommendation.name}. Please try again.`,
          saveOperation
        );
      } finally {
        setSavingId(null);
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
          <CircularProgress />
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: 'center' }}
        >
          Tap to save a drink quickly
        </Typography>

        <Grid container spacing={2} sx={{ flex: 1 }}>
          {displayRecommendations.map((rec) => (
            <Grid
              size={6}
              key={rec.id}
              sx={{ minHeight: 100 }}
            >
              <RecommendationButton
                name={rec.name}
                onClick={() => handleSaveRecommendation(rec)}
                loading={savingId === rec.id}
                disabled={savingId !== null && savingId !== rec.id}
              />
            </Grid>
          ))}
          
          {/* Navigation button to detailed page - always last */}
          <Grid size={6} sx={{ minHeight: 100 }}>
            <RecommendationButton
              name="+ Add Custom"
              onClick={navigateToDetailed}
              disabled={savingId !== null}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default IndexPage;
