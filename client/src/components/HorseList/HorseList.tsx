import React, { useEffect, useState } from 'react';
import { fetchHorses } from '../../services/api.ts';

// Define the shape of a Horse object (adjust fields as needed)
interface Horse {
  _id: string;
  name: string;
  breed: string;
  age: number;
  // Add other fields if you want, like gender, stats, traits etc.
}

// Define the shape of the API response
interface FetchHorsesResponse {
  page: number;
  limit: number;
  total: number;
  data: Horse[];
}

export default function HorseList() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetchHorses({ page, limit })
      .then((data: FetchHorsesResponse) => {
        setHorses(data.data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  if (loading) return <p>Loading horses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Horse List</h2>
      <ul>
        {horses.map(horse => (
          <li key={horse._id}>
            {horse.name} — {horse.breed} — Age: {horse.age}
          </li>
        ))}
      </ul>
      <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(p => p + 1)}>
        Next
      </button>
    </div>
  );
}