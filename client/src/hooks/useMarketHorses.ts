import { useState, useEffect, useCallback } from "react";
import type { Horse } from "../services/api";
import { API_BASE } from "../services/api";

export function useMarketHorses() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketHorses = useCallback(async () => {
    try {
      setLoading(true);
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
  }, []);

  useEffect(() => {
    fetchMarketHorses();
  }, [fetchMarketHorses]);

  const buyHorse = useCallback(async (horseId: string, buyerId: string) => {
    try {
      const res = await fetch(`${API_BASE}/market/horses/${horseId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to buy horse");
      }

      setHorses((prev) => prev.filter((horse) => horse._id !== horseId));
    } catch (err) {
      console.error("Buy error:", (err as Error).message);
      setError((err as Error).message);
    }
  }, []);

  return {
    horses,
    loading,
    error,
    buyHorse,
    refetch: fetchMarketHorses,
  };
}