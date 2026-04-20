import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import type { ErrorPageState, SuccessPageState, NewVolumePageState } from '../types/api';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateToSuccess = useCallback(
    (message: string) => {
      const state: SuccessPageState = { message };
      navigate('/success', { state });
    },
    [navigate]
  );

  const navigateToError = useCallback(
    (message: string) => {
      const state: ErrorPageState = { message };
      navigate('/error', { state });
    },
    [navigate]
  );

  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const navigateToDetailed = useCallback(() => {
    navigate('/detailed');
  }, [navigate]);

  const navigateToNewAlcohol = useCallback(() => {
    navigate('/new-alcohol');
  }, [navigate]);

  const navigateToNewVolume = useCallback(
    (alcoholTypeId: number, alcoholTypeName: string) => {
      const state: NewVolumePageState = { alcoholTypeId, alcoholTypeName };
      navigate('/new-volume', { state });
    },
    [navigate]
  );

  const navigateToNewBrand = useCallback(() => {
    navigate('/new-brand');
  }, [navigate]);

  return {
    navigateToSuccess,
    navigateToError,
    navigateToHome,
    navigateToDetailed,
    navigateToNewAlcohol,
    navigateToNewVolume,
    navigateToNewBrand,
  };
};
