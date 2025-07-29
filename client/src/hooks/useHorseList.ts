// src/hooks/useHorseList.ts
import { useEffect, useState } from "react";
import type { Horse, FetchHorsesResponse } from "../services/api";
import { fetchHorses } from "../services/api";

export function useHorseList(params: Record<string, any> = {}) {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params.page ?? 1);
  const [limit, setLimit] = useState(params.limit ?? 10);

  useEffect(() => {
    setLoading(true);
    fetchHorses({ page, limit, ...params })
      .then((data: FetchHorsesResponse) => {
        setHorses(data.data);
        setTotal(data.total);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, JSON.stringify(params)]);

  return { horses, loading, error, total, page, limit, setPage, setLimit };
}