import { useEffect, useState } from "react";
import type { Horse } from "../services/api";
import { API_BASE } from "../services/api";

export function useHorse(id?: string | null) {
  const [horse, setHorse] = useState<Horse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_BASE}/horses/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch horse with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setHorse(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { horse, loading, error };
}