import apiClient, { getCurrentUserId } from './client';
import type {
  Drink,
  SavedDrink,
  Beer,
  SavedBeer,
  Brand,
  AlcoholType,
  AlcoholVolume,
  NewAlcoholEntry,
  NewVolumeEntry,
  Recommendation,
  ConsumptionType,
} from '../types/api';

// Drinks endpoints
export const saveDrink = async (drink: Omit<Drink, 'userId' | 'date'> & { date?: string }): Promise<SavedDrink> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const payload: Drink = {
    ...drink,
    userId: userId,
    date: drink.date || new Date().toISOString().split('T')[0],
  };
  const response = await apiClient.post<SavedDrink>('/v1/drinks/new', payload);
  return response.data;
};

export const saveBeer = async (beer: Omit<Beer, 'userId' | 'date'> & { date?: string }): Promise<SavedBeer> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');
  
  const payload: Beer = {
    ...beer,
    userId: userId,
    date: beer.date || new Date().toISOString().split('T')[0],
  };
  const response = await apiClient.post<SavedBeer>('/v1/drinks/beer/new', payload);
  return response.data;
};

// Recommendations endpoints
export const getRecommendations = async (): Promise<Recommendation[]> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');
  
  const response = await apiClient.get<Recommendation[]>(`/v1/recommendations/${userId}/list`);
  return response.data;
};

// Alcohol endpoints
export const getAlcoholTypes = async (): Promise<AlcoholType[]> => {
  const userId = getCurrentUserId();
  const response = await apiClient.get<AlcoholType[]>('/v1/alcohol/types', {
    params: { userId },
  });
  return response.data;
};

export const createAlcoholType = async (entry: Omit<NewAlcoholEntry, 'userId'>): Promise<AlcoholType> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const payload: NewAlcoholEntry = {
    ...entry,
    userId,
  };
  const response = await apiClient.post<AlcoholType>('/v1/alcohol/types', payload);
  return response.data;
};

export const getVolumesByAlcoholType = async (alcoholTypeId: number): Promise<AlcoholVolume[]> => {
  const response = await apiClient.get<AlcoholVolume[]>(
    `/v1/alcohol/types/${alcoholTypeId}/volumes`
  );
  return response.data;
};

export const createVolumeForAlcoholType = async (
  alcoholTypeId: number,
  entry: NewVolumeEntry
): Promise<AlcoholVolume> => {
  const response = await apiClient.post<AlcoholVolume>(
    `/v1/alcohol/types/${alcoholTypeId}/volumes`,
    entry
  );
  return response.data;
};

// Beer endpoints
export const getConsumptionTypes = async (amount: number = 100): Promise<ConsumptionType[]> => {
  const response = await apiClient.get<ConsumptionType[]>('/v1/beer/consumption-types', {
    params: { amount },
  });
  return response.data;
};

export const getBrands = async (): Promise<Brand[]> => {
  const userId = getCurrentUserId();
  const response = await apiClient.get<Brand[]>('/v1/beer/brands', {
    params: { userId },
  });
  return response.data;
};

export const createBrand = async (brandName: string): Promise<Brand> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const response = await apiClient.post<Brand>(`/v1/beer/${userId}/brands/${encodeURIComponent(brandName)}`);
  return response.data;
};
