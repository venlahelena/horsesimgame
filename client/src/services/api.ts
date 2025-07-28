// src/services/api.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Define the Horse type consistent with backend and frontend
export interface Horse {
  _id: string;
  name: string;
  breed: string;
  age: number;
  gender?: string;
  stats?: {
    speed?: number;
    stamina?: number;
    agility?: number;
  };
  traits?: {
    coatColor?: string;
    markings?: string;
  };
}

export interface FetchHorsesResponse {
  page: number;
  limit: number;
  total: number;
  data: Horse[];
}

// params: a key-value object of query params, e.g., { page: 1, limit: 10 }
export async function fetchHorses(params: Record<string, any> = {}): Promise<FetchHorsesResponse> {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, val]) => {
      if (val !== undefined && val !== null) acc[key] = String(val);
      return acc;
    }, {})
  ).toString();

  const url = `${API_BASE}/horses?${query}`;

  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch error: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}