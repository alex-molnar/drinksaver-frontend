import apiClient from './client';
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

const USER_ID = 1; // Hardcoded for initial implementation

// Drinks endpoints
export const saveDrink = async (drink: Omit<Drink, 'userId' | 'date'> & { date?: string }): Promise<SavedDrink> => {
  const payload: Drink = {
    ...drink,
    userId: USER_ID,
    date: drink.date || new Date().toISOString().split('T')[0],
  };
  const response = await apiClient.post<SavedDrink>('/v1/drinks/new', payload);
  return response.data;
};

export const saveBeer = async (beer: Omit<Beer, 'userId' | 'date'> & { date?: string }): Promise<SavedBeer> => {
  const payload: Beer = {
    ...beer,
    userId: USER_ID,
    date: beer.date || new Date().toISOString().split('T')[0],
  };
  const response = await apiClient.post<SavedBeer>('/v1/drinks/beer/new', payload);
  return response.data;
};

// Recommendations endpoints
export const getRecommendations = async (): Promise<Recommendation[]> => {
  const response = await apiClient.get<Recommendation[]>(`/v1/recommendations/${USER_ID}/list`);
  return response.data;
};

// Alcohol endpoints
export const getAlcoholTypes = async (amount: number = 100): Promise<AlcoholType[]> => {
  const response = await apiClient.get<AlcoholType[]>('/v1/alcohol/types', {
    params: { amount },
  });
  return response.data;
};

export const createAlcoholType = async (entry: NewAlcoholEntry): Promise<AlcoholType> => {
  const response = await apiClient.post<AlcoholType>('/v1/alcohol/types', entry);
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

export const getBrands = async (amount: number = 100): Promise<Brand[]> => {
  const response = await apiClient.get<Brand[]>('/v1/beer/brands', {
    params: { amount },
  });
  return response.data;
};

export const createBrand = async (brandName: string): Promise<Brand> => {
  const response = await apiClient.post<Brand>(`/v1/beer/brands/${encodeURIComponent(brandName)}`);
  return response.data;
};
