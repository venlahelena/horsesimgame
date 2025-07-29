import { useParams, useNavigate } from "react-router-dom";
import { useHorse } from "../../../hooks/useHorses";

export default function HorseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { horse, loading, error } = useHorse(id);

  if (loading) return <p>Loading horse info...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!horse) return <p>Horse not found.</p>;

  return (
    <div className="horse-detail">
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>
        ← Back to Stable
      </button>
      <h2>{horse.name}</h2>
      <p>Breed: {horse.breed}</p>
      <p>Age: {horse.age}</p>
      <p>Gender: {horse.gender}</p>
      <p>
        Stats: Speed {horse.stats?.speed}, Stamina {horse.stats?.stamina}, Agility{" "}
        {horse.stats?.agility}
      </p>
      <p>
        Traits: Coat {horse.traits?.coatColor}, Markings {horse.traits?.markings}
      </p>
    </div>
  );
}