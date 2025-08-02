import { Link } from "react-router-dom";
import { useHorseList } from "../../hooks/useHorseList";
import HorseCard from "../../components/shared/HorseCard/HorseCard";
import "./StableView.css";

const MAX_STABLE_SIZE = 10;

export default function StableView() {
  const { horses, loading, error } = useHorseList({ page: 1, limit: 20 });

  const filledStalls = horses.length;
  const emptyStalls = MAX_STABLE_SIZE - filledStalls;

  if (loading) return <p>Loading your stable...</p>;
  if (error) return <p>Error loading stable: {error}</p>;

  return (
    <div className="stable-view">
      <h2>Your Stable</h2>
      <div className="stable-corridor">
        {horses.map((horse) => (
          <Link
            to={`/horse/${horse._id}`}
            key={horse._id}
            className="stable-stall"
          >
            <HorseCard horse={horse} />
          </Link>
        ))}

        {Array.from({ length: emptyStalls }).map((_, i) => (
          <div key={`empty-${i}`} className="stable-stall empty">
            <div className="stall-sign">
              <em>Empty Stall</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}