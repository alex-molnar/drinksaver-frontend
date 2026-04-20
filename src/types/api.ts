// API Types based on OpenAPI schema

export interface Drink {
  userId: number;
  date: string;
  alcoholTypeId: number;
  alcoholVolumeId: number;
  comments?: string;
}

export interface SavedDrink extends Drink {
  id: number;
}

export interface Beer {
  userId: number;
  date: string;
  alcoholTypeId: number;
  alcoholVolumeId: number;
  brandId: number;
  consumptionTypeId: number;
  comments?: string;
}

export interface SavedBeer extends Beer {
  id: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface AlcoholType {
  id: number;
  name: string;
  volumeIds: number[];
}

export interface AlcoholVolume {
  id: number;
  name: string;
  volume: number;
}

export interface NewAlcoholEntry {
  name: string;
  volumes?: NewVolumeEntry[];
}

export interface NewVolumeEntry {
  name: string;
  volume: number;
}

export interface Recommendation {
  id: number;
  userId: number;
  name: string;
  alcoholTypeId: number;
  alcoholVolumeId: number;
  brandId?: number;
  consumptionTypeId?: number;
}

export interface ConsumptionType {
  id: number;
  name: string;
}

// Navigation state types
export interface ErrorPageState {
  message: string;
}

export interface SuccessPageState {
  message: string;
}

export interface NewVolumePageState {
  alcoholTypeId: number;
  alcoholTypeName: string;
}

// Helper to check if a recommendation is for beer
export const isBeerRecommendation = (rec: Recommendation): boolean => {
  return rec.brandId !== undefined && rec.brandId !== null && rec.brandId > 0;
};
