import type { 
  Farmer, 
  InsertFarmer, 
  Alert, 
  WeatherResponse, 
  RiskDetection,
  DashboardStats,
  Crop,
  Field,
  InsertField
} from "@shared/schema";
import { apiRequest } from "./queryClient";

export const farmersApi = {
  getAll: () => fetch("/api/farmers").then(res => res.json()) as Promise<Farmer[]>,
  
  create: (data: InsertFarmer) => 
    apiRequest("POST", "/api/farmers", data).then(res => res.json()) as Promise<Farmer>,
  
  update: (id: string, data: Partial<InsertFarmer>) =>
    apiRequest("PUT", `/api/farmers/${id}`, data).then(res => res.json()) as Promise<Farmer>,
  
  delete: (id: string) =>
    apiRequest("DELETE", `/api/farmers/${id}`),
};

export const weatherApi = {
  getByLocation: (location: string) =>
    fetch(`/api/weather/${encodeURIComponent(location)}`).then(res => res.json()) as Promise<WeatherResponse>,
  
  getByCoordinates: (lat: number, lon: number, location: string) =>
    fetch(`/api/weather/coordinates/${lat}/${lon}?location=${encodeURIComponent(location)}`).then(res => res.json()) as Promise<WeatherResponse>,
};

export const risksApi = {
  getByLocation: (location: string) =>
    fetch(`/api/risks/${encodeURIComponent(location)}`).then(res => res.json()) as Promise<RiskDetection[]>,
};

export const alertsApi = {
  getAll: () => fetch("/api/alerts").then(res => res.json()) as Promise<Alert[]>,
  
  send: (data: { 
    farmerIds: string[];
    riskType: string;
    description: string;
    severity: string;
  }) => apiRequest("POST", "/api/alerts/send", data),
};

export const dashboardApi = {
  getStats: () => fetch("/api/dashboard/stats").then(res => res.json()) as Promise<DashboardStats>,
};

export const cropsApi = {
  getAll: () => fetch("/api/crops").then(res => res.json()) as Promise<Crop[]>,
  
  search: (query: string) =>
    fetch(`/api/crops?search=${encodeURIComponent(query)}`).then(res => res.json()) as Promise<Crop[]>,
  
  getById: (id: string) =>
    fetch(`/api/crops/${id}`).then(res => res.json()) as Promise<Crop>,
};

export const fieldsApi = {
  getByFarmer: (farmerId: string) =>
    fetch(`/api/fields?farmerId=${farmerId}`).then(res => res.json()) as Promise<Field[]>,
  
  getById: (id: string) =>
    fetch(`/api/fields/${id}`).then(res => res.json()) as Promise<Field>,
  
  create: (data: InsertField) =>
    apiRequest("POST", "/api/fields", data).then(res => res.json()) as Promise<Field>,
  
  update: (id: string, data: Partial<InsertField>) =>
    apiRequest("PUT", `/api/fields/${id}`, data).then(res => res.json()) as Promise<Field>,
  
  delete: (id: string) =>
    apiRequest("DELETE", `/api/fields/${id}`),
};
