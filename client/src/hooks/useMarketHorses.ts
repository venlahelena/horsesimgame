// src/hooks/useMarketHorses.ts
import { useEffect, useState } from "react";
import type { Horse } from "../services/api";
import { API_BASE } from "../services/api";

export function useMarketHorses() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketHorses = async () => {
      try {
        const res = await fetch(`${API_BASE}/market/horses`);
        if (!res.ok) throw new Error(`Failed to load market horses: ${res.status}`);
        const data = await res.json();
        setHorses(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketHorses();
  }, []);

  return { horses, loading, error };
}